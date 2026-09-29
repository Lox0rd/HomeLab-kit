import os
import subprocess
import socket
import pwd
import grp
from typing import Dict, Any, List, Optional
from pathlib import Path
from .lab_checker import LabChecker as CommandLabChecker
from ..labs_data import LABS


class LabChecker:
    @staticmethod
    def check_file_exists(path: str) -> bool:
        return os.path.exists(path)

    @staticmethod
    def check_directory_exists(path: str) -> bool:
        return os.path.isdir(path)

    @staticmethod
    def check_service_running(service: str) -> bool:
        try:
            result = subprocess.run(
                ["systemctl", "is-active", service],
                capture_output=True,
                timeout=5
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def check_service_enabled(service: str) -> bool:
        try:
            result = subprocess.run(
                ["systemctl", "is-enabled", service],
                capture_output=True,
                timeout=5
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def check_port_open(port: int, host: str = "localhost") -> bool:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex((host, port))
            sock.close()
            return result == 0
        except Exception:
            return False

    @staticmethod
    def check_package_installed(package: str) -> bool:
        try:
            result = subprocess.run(
                ["dpkg", "-l", package],
                capture_output=True,
                timeout=5
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def check_user_exists(username: str) -> bool:
        try:
            pwd.getpwnam(username)
            return True
        except KeyError:
            return False

    @staticmethod
    def check_group_exists(groupname: str) -> bool:
        try:
            grp.getgrnam(groupname)
            return True
        except KeyError:
            return False

    @staticmethod
    def check_process_exists(process: str) -> bool:
        try:
            result = subprocess.run(
                ["pgrep", "-f", process],
                capture_output=True,
                timeout=5
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def check_http_status(url: str, expected_status: int = 200) -> bool:
        try:
            import requests
            response = requests.get(url, timeout=5, verify=False)
            return response.status_code == expected_status
        except Exception:
            return False

    @staticmethod
    def check_command_output(command: str, expected_text: str) -> bool:
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                timeout=10,
                text=True
            )
            return expected_text in result.stdout or expected_text in result.stderr
        except Exception:
            return False

    @staticmethod
    def check_firewall_rule(port: int, protocol: str = "tcp") -> bool:
        try:
            result = subprocess.run(
                ["sudo", "ufw", "status", "numbered"],
                capture_output=True,
                timeout=5,
                text=True
            )
            if result.returncode == 0:
                rule_text = f"{port}/{protocol}"
                return rule_text in result.stdout or "ALLOW" in result.stdout
            return False
        except Exception:
            return False

    @classmethod
    def run_check(cls, check_type: str, **kwargs) -> bool:
        method_name = f"check_{check_type}"
        if hasattr(cls, method_name):
            method = getattr(cls, method_name)
            return method(**kwargs)
        return False


class LabManager:
    def __init__(self):
        self.labs = {lab["id"]: lab for lab in LABS}

    def get_lab(self, lab_id: str) -> Optional[Dict[str, Any]]:
        return self.labs.get(lab_id)

    def list_labs(self) -> List[Dict[str, Any]]:
        return list(self.labs.values())

    def get_lab_prerequisites(self, lab_id: str) -> List[str]:
        lab = self.get_lab(lab_id)
        if lab:
            return lab.get("prerequisites", [])
        return []

    def validate_solution(self, lab_id: str, solution: str) -> tuple:
        lab = self.get_lab(lab_id)
        if not lab:
            return False, "Lab not found"

        return CommandLabChecker.validate_solution(lab, solution)

    def get_hint(self, lab_id: str, hint_number: int = 0, lang: str = "en") -> str:
        lab = self.get_lab(lab_id)
        if not lab:
            return "Lab not found"

        hints_key = f"hints_{lang}" if f"hints_{lang}" in lab else "hints"
        hints = lab.get(hints_key, [])

        if hint_number < len(hints):
            return hints[hint_number]
        return "No more hints available"

    def reveal_solution(self, lab_id: str) -> str:
        lab = self.get_lab(lab_id)
        if not lab:
            return "Lab not found"

        return CommandLabChecker.reveal_solution(lab)

    def check_lab_task(self, lab_id: str, task_id: str) -> bool:
        lab = self.get_lab(lab_id)
        if not lab:
            return False

        for task in lab.get("tasks", []):
            if task["id"] == task_id:
                task_type = task.get("type")

                if task_type == "custom_message":
                    return True

                return LabChecker.run_check(task_type, **task)

        return False

    def check_lab(self, lab_id: str) -> Dict[str, Any]:
        lab = self.get_lab(lab_id)
        if not lab:
            return {"success": False, "error": "Lab not found"}

        results = {
            "lab_id": lab_id,
            "title": lab.get("title"),
            "tasks": [],
            "all_passed": True
        }

        for task in lab.get("tasks", []):
            passed = self.check_lab_task(lab_id, task["id"])
            results["tasks"].append({
                "id": task["id"],
                "description": task.get("description"),
                "passed": passed
            })
            if not passed:
                results["all_passed"] = False

        return results

    def get_lab_difficulty(self, lab_id: str) -> str:
        lab = self.get_lab(lab_id)
        if lab:
            return lab.get("difficulty", "unknown")
        return "unknown"

    def get_lab_estimated_time(self, lab_id: str) -> int:
        lab = self.get_lab(lab_id)
        if lab:
            return lab.get("estimated_time", 0)
        return 0

    def get_lab_theory(self, lab_id: str) -> str:
        lab = self.get_lab(lab_id)
        if lab:
            return lab.get("theory", "")
        return ""

    def get_lab_hints(self, lab_id: str) -> List[str]:
        lab = self.get_lab(lab_id)
        if lab:
            return lab.get("hints", [])
        return []

    def get_lab_solution(self, lab_id: str) -> str:
        lab = self.get_lab(lab_id)
        if lab:
            return lab.get("solution", "")
        return ""
