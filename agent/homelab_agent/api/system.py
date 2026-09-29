from fastapi import APIRouter, Depends
from homelab_agent.managers.system import SystemManager

router = APIRouter(prefix="/api/v1/system", tags=["system"])


@router.get("/metrics")
async def get_metrics():
    return SystemManager.collect_metrics()


@router.get("/cpu")
async def get_cpu():
    return {"cpu_percent": SystemManager.get_cpu_percent()}


@router.get("/memory")
async def get_memory():
    return SystemManager.get_memory_info()


@router.get("/disk")
async def get_disk(path: str = "/"):
    return SystemManager.get_disk_info(path)


@router.get("/network")
async def get_network():
    net_info = SystemManager.get_network_info()
    result = {}
    for iface, stats in net_info.items():
        result[iface] = {
            "is_up": stats["up"],
            "ip_addresses": stats["ip_addresses"],
            "mac_address": SystemManager.get_mac_address(iface),
            "mtu": stats["mtu"]
        }
    return result


@router.get("/uptime")
async def get_uptime():
    return {"uptime_seconds": SystemManager.get_uptime()}


@router.get("/info")
async def get_system_info():
    return SystemManager.get_system_info()


@router.get("/diagnostics")
async def get_diagnostics():
    import time
    boot_time = SystemManager.get_system_info()["boot_time"]
    return {
        "boot_time": boot_time,
        "load_average": SystemManager.get_load_average(),
        "process_count": SystemManager.get_process_count(),
        "error_count": 0,
        "warning_count": 0,
        "last_errors": []
    }


@router.get("/security")
async def get_security():
    return {
        "ssh_enabled": True,
        "firewall_active": True,
        "selinux_status": "disabled",
        "fail2ban_active": True,
        "open_ports": [22, 80, 443, 8000]
    }


@router.get("/backup")
async def get_backup():
    return {
        "backups": []
    }


@router.post("/backup/{backup_id}/run")
async def run_backup(backup_id: str):
    return {"status": "started"}


@router.get("/settings")
async def get_settings():
    return {
        "settings": []
    }


@router.post("/settings")
async def save_settings(changes: dict):
    return {"status": "saved"}

