import docker
from typing import Dict, Any, List, Optional


class DockerManager:
    def __init__(self):
        try:
            self.client = docker.from_env()
        except Exception:
            self.client = None

    def is_available(self) -> bool:
        if self.client is None:
            return False
        try:
            self.client.ping()
            return True
        except Exception:
            return False

    def list_containers(self, all: bool = False) -> List[Dict[str, Any]]:
        if not self.is_available():
            return []
        try:
            containers = self.client.containers.list(all=all)
            return [
                {
                    "id": c.id[:12],
                    "name": c.name,
                    "image": c.image.tags[0] if c.image.tags else c.image.id[:12],
                    "status": c.status,
                    "state": c.attrs.get("State", {}).get("Status", "unknown"),
                    "ports": c.ports,
                    "created": c.attrs.get("Created"),
                    "started": c.attrs.get("State", {}).get("StartedAt")
                }
                for c in containers
            ]
        except Exception:
            return []

    def list_images(self) -> List[Dict[str, Any]]:
        if not self.is_available():
            return []
        try:
            images = self.client.images.list()
            return [
                {
                    "id": img.id[:12],
                    "tags": img.tags if img.tags else ["<none>:<none>"],
                    "size": img.attrs.get("Size", 0),
                    "created": img.attrs.get("Created"),
                    "repo_tags": img.repo_tags
                }
                for img in images
            ]
        except Exception:
            return []

    def list_networks(self) -> List[Dict[str, Any]]:
        if not self.is_available():
            return []
        try:
            networks = self.client.networks.list()
            return [
                {
                    "id": n.id[:12],
                    "name": n.name,
                    "driver": n.attrs.get("Driver", ""),
                    "scope": n.attrs.get("Scope", ""),
                    "containers": len(n.attrs.get("Containers", {}))
                }
                for n in networks
            ]
        except Exception:
            return []

    def list_volumes(self) -> List[Dict[str, Any]]:
        if not self.is_available():
            return []
        try:
            volumes = self.client.volumes.list()
            return [
                {
                    "name": v.name,
                    "driver": v.attrs.get("Driver", ""),
                    "mountpoint": v.attrs.get("Mountpoint", "")
                }
                for v in volumes
            ]
        except Exception:
            return []

    def get_container_logs(self, container_id: str, lines: int = 50) -> str:
        if not self.is_available():
            return ""
        try:
            container = self.client.containers.get(container_id)
            logs = container.logs(tail=lines, timestamps=False)
            return logs.decode("utf-8", errors="ignore")
        except Exception:
            return ""

    def get_container_stats(self, container_id: str) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            return None
        try:
            container = self.client.containers.get(container_id)
            stats = container.stats(stream=False)
            cpu_delta = stats["cpu_stats"]["cpu_usage"]["total_usage"] - stats["precpu_stats"]["cpu_usage"]["total_usage"]
            system_delta = stats["cpu_stats"]["system_cpu_usage"] - stats["precpu_stats"]["system_cpu_usage"]
            cpu_percent = (cpu_delta / system_delta) * 100.0 if system_delta > 0 else 0

            memory_stats = stats["memory_stats"]
            memory_usage = memory_stats.get("usage", 0)
            memory_limit = memory_stats.get("limit", 0)
            memory_percent = (memory_usage / memory_limit) * 100 if memory_limit > 0 else 0

            return {
                "container_id": container_id[:12],
                "cpu_percent": cpu_percent,
                "memory_usage": memory_usage,
                "memory_limit": memory_limit,
                "memory_percent": memory_percent
            }
        except Exception:
            return None
