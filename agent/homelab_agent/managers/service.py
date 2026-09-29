import subprocess
from typing import Dict, Any, List, Optional


class ServiceManager:
    @staticmethod
    def is_running(service: str) -> bool:
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
    def is_enabled(service: str) -> bool:
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
    def get_status(service: str) -> Dict[str, Any]:
        try:
            result = subprocess.run(
                ["systemctl", "status", service],
                capture_output=True,
                timeout=5,
                text=True
            )
            return {
                "service": service,
                "active": ServiceManager.is_running(service),
                "enabled": ServiceManager.is_enabled(service),
                "output": result.stdout + result.stderr
            }
        except Exception as e:
            return {
                "service": service,
                "active": False,
                "enabled": False,
                "output": str(e)
            }

    @staticmethod
    def start(service: str) -> bool:
        try:
            result = subprocess.run(
                ["sudo", "systemctl", "start", service],
                capture_output=True,
                timeout=10
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def stop(service: str) -> bool:
        try:
            result = subprocess.run(
                ["sudo", "systemctl", "stop", service],
                capture_output=True,
                timeout=10
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def restart(service: str) -> bool:
        try:
            result = subprocess.run(
                ["sudo", "systemctl", "restart", service],
                capture_output=True,
                timeout=10
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def enable(service: str) -> bool:
        try:
            result = subprocess.run(
                ["sudo", "systemctl", "enable", service],
                capture_output=True,
                timeout=10
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def disable(service: str) -> bool:
        try:
            result = subprocess.run(
                ["sudo", "systemctl", "disable", service],
                capture_output=True,
                timeout=10
            )
            return result.returncode == 0
        except Exception:
            return False

    @staticmethod
    def list_services() -> List[Dict[str, Any]]:
        try:
            result = subprocess.run(
                ["systemctl", "list-units", "--type=service", "--all", "--output=json"],
                capture_output=True,
                timeout=10,
                text=True
            )
            if result.returncode == 0:
                import json
                units = json.loads(result.stdout)
                return [
                    {
                        "name": u.get("unit", ""),
                        "load": u.get("load", ""),
                        "active": u.get("active", ""),
                        "sub": u.get("sub", ""),
                        "description": u.get("description", "")
                    }
                    for u in units
                    if u.get("unit", "").endswith(".service")
                ]
            return []
        except Exception:
            return []

    @staticmethod
    def get_service_info(service: str) -> Optional[Dict[str, Any]]:
        try:
            result = subprocess.run(
                ["systemctl", "show", service],
                capture_output=True,
                timeout=5,
                text=True
            )
            if result.returncode == 0:
                info = {}
                for line in result.stdout.strip().split("\n"):
                    if "=" in line:
                        key, value = line.split("=", 1)
                        info[key.lower()] = value
                return info
            return None
        except Exception:
            return None
