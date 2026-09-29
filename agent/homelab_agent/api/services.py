from fastapi import APIRouter
from homelab_agent.managers.service import ServiceManager

router = APIRouter(prefix="/api/v1/services", tags=["services"])


@router.get("/")
async def list_services():
    return {"services": ServiceManager.list_services()}


@router.get("/{service_name}")
async def get_service_status(service_name: str):
    return ServiceManager.get_status(service_name)


@router.post("/{service_name}/start")
async def start_service(service_name: str):
    success = ServiceManager.start(service_name)
    return {"service": service_name, "action": "start", "success": success}


@router.post("/{service_name}/stop")
async def stop_service(service_name: str):
    success = ServiceManager.stop(service_name)
    return {"service": service_name, "action": "stop", "success": success}


@router.post("/{service_name}/restart")
async def restart_service(service_name: str):
    success = ServiceManager.restart(service_name)
    return {"service": service_name, "action": "restart", "success": success}


@router.post("/{service_name}/enable")
async def enable_service(service_name: str):
    success = ServiceManager.enable(service_name)
    return {"service": service_name, "action": "enable", "success": success}


@router.post("/{service_name}/disable")
async def disable_service(service_name: str):
    success = ServiceManager.disable(service_name)
    return {"service": service_name, "action": "disable", "success": success}
