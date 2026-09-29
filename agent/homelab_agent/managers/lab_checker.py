import subprocess
import re
from typing import Dict, Any, Tuple


class LabChecker:
    @staticmethod
    def validate_solution(lab: Dict[str, Any], solution: str) -> Tuple[bool, str]:
        """
        Validate a lab solution by executing commands and comparing output.
        Returns (is_valid, feedback_message)
        """
        validation = lab.get("validation", {})
        validation_type = validation.get("type", "command")

        if validation_type == "command":
            return LabChecker._validate_command(validation, solution)
        elif validation_type == "output":
            return LabChecker._validate_output(validation, solution)
        elif validation_type == "file":
            return LabChecker._validate_file(validation, solution)
        else:
            return False, "Unknown validation type"

    @staticmethod
    def _validate_command(validation: Dict[str, Any], solution: str) -> Tuple[bool, str]:
        """Execute validation command and check output."""
        try:
            command = validation.get("command", "")
            expected = validation.get("expected_output", "PASS")

            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=10
            )

            output = result.stdout.strip()
            actual = output.split('\n')[-1] if output else ""

            if actual == expected or expected in output:
                return True, f"✓ Solution validated. Output: {output[:100]}"
            else:
                return False, f"✗ Validation failed. Expected: {expected}, Got: {actual}"

        except subprocess.TimeoutExpired:
            return False, "✗ Command execution timeout"
        except Exception as e:
            return False, f"✗ Error during validation: {str(e)}"

    @staticmethod
    def _validate_output(validation: Dict[str, Any], solution: str) -> Tuple[bool, str]:
        """Check if solution output contains expected pattern."""
        try:
            expected_pattern = validation.get("expected_pattern", "")
            result = subprocess.run(
                solution,
                shell=True,
                capture_output=True,
                text=True,
                timeout=10
            )

            if re.search(expected_pattern, result.stdout):
                return True, "✓ Solution output matches expected pattern"
            else:
                return False, f"✗ Output doesn't match pattern: {expected_pattern}"

        except Exception as e:
            return False, f"✗ Error: {str(e)}"

    @staticmethod
    def _validate_file(validation: Dict[str, Any], solution: str) -> Tuple[bool, str]:
        """Check if expected files were created."""
        try:
            expected_files = validation.get("expected_files", [])
            result = subprocess.run(
                f"ls {' '.join(expected_files)} 2>/dev/null",
                shell=True,
                capture_output=True,
                text=True,
                timeout=10
            )

            if result.returncode == 0:
                return True, "✓ All expected files created"
            else:
                return False, "✗ Expected files not found"

        except Exception as e:
            return False, f"✗ Error: {str(e)}"

    @staticmethod
    def get_hint(lab: Dict[str, Any], hint_number: int = 0) -> str:
        """Get a hint for the lab."""
        hints = lab.get("hints", [])
        if 0 <= hint_number < len(hints):
            return hints[hint_number]
        return "No more hints available"

    @staticmethod
    def reveal_solution(lab: Dict[str, Any]) -> str:
        """Reveal the solution for the lab."""
        return lab.get("solution", "Solution not available")
