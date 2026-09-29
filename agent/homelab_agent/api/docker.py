from fastapi import APIRouter
from homelab_agent.managers.docker import DockerManager

router = APIRouter(prefix="/api/v1/docker", tags=["docker"])

docker_manager = DockerManager()


@router.get("/available")
async def check_docker_available():
    return {"available": docker_manager.is_available()}


@router.get("/containers")
async def list_containers(all: bool = False):
    return {"containers": docker_manager.list_containers(all=all)}


@router.get("/images")
async def list_images():
    return {"images": docker_manager.list_images()}


@router.get("/networks")
async def list_networks():
    return {"networks": docker_manager.list_networks()}


@router.get("/volumes")
async def list_volumes():
    return {"volumes": docker_manager.list_volumes()}


@router.get("/containers/{container_id}/logs")
async def get_container_logs(container_id: str, lines: int = 50):
    logs = docker_manager.get_container_logs(container_id, lines=lines)
    return {"container_id": container_id, "logs": logs}


@router.get("/containers/{container_id}/stats")
async def get_container_stats(container_id: str):
    stats = docker_manager.get_container_stats(container_id)
    return {"stats": stats}
