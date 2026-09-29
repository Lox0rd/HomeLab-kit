import psutil
import socket
from datetime import datetime
from typing import Dict, Any
import subprocess


class SystemManager:
    @staticmethod
    def get_cpu_percent(interval: float = 1.0) -> float:
        return psutil.cpu_percent(interval=interval)

    @staticmethod
    def get_memory_info() -> Dict[str, Any]:
        mem = psutil.virtual_memory()
        return {
            "total": mem.total,
            "used": mem.used,
            "available": mem.available,
            "percent": mem.percent,
            "free": mem.free
        }

    @staticmethod
    def get_disk_info(path: str = "/") -> Dict[str, Any]:
        disk = psutil.disk_usage(path)
        return {
            "total": disk.total,
            "used": disk.used,
            "free": disk.free,
            "percent": disk.percent
        }

    @staticmethod
    def get_network_info() -> Dict[str, Any]:
        net = psutil.net_if_stats()
        interfaces = {}
        for iface, stats in net.items():
            if stats.isup:
                try:
                    addrs = psutil.net_if_addrs()[iface]
                    ip_addrs = [addr.address for addr in addrs if addr.family == socket.AF_INET]
                    interfaces[iface] = {
                        "up": True,
                        "speed": stats.speed,
                        "mtu": stats.mtu,
                        "ip_addresses": ip_addrs
                    }
                except KeyError:
                    interfaces[iface] = {
                        "up": True,
                        "speed": stats.speed,
                        "mtu": stats.mtu,
                        "ip_addresses": []
                    }
        return interfaces

    @staticmethod
    def get_mac_address(iface: str) -> str:
        try:
            addrs = psutil.net_if_addrs().get(iface, [])
            for addr in addrs:
                if addr.family == socket.AF_LINK:
                    return addr.address
        except Exception:
            pass
        return "N/A"

    @staticmethod
    def get_uptime() -> float:
        import time
        return time.time() - psutil.boot_time()

    @staticmethod
    def get_hostname() -> str:
        return socket.gethostname()

    @staticmethod
    def get_load_average() -> list:
        return list(psutil.getloadavg())

    @staticmethod
    def get_process_count() -> int:
        return len(psutil.pids())

    @staticmethod
    def get_system_info() -> Dict[str, Any]:
        return {
            "hostname": SystemManager.get_hostname(),
            "cpu_count": psutil.cpu_count(logical=False),
            "cpu_count_logical": psutil.cpu_count(logical=True),
            "cpu_freq": psutil.cpu_freq().current if psutil.cpu_freq() else 0,
            "boot_time": datetime.fromtimestamp(psutil.boot_time()).isoformat(),
            "uptime_seconds": SystemManager.get_uptime()
        }

    @staticmethod
    def collect_metrics() -> Dict[str, Any]:
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "cpu_percent": SystemManager.get_cpu_percent(),
            "memory": SystemManager.get_memory_info(),
            "disk": SystemManager.get_disk_info(),
            "network": SystemManager.get_network_info(),
            "system_info": SystemManager.get_system_info()
        }
