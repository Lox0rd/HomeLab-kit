from fastapi import APIRouter, Header
from pydantic import BaseModel
from homelab_agent.managers.lab import LabManager

router = APIRouter(prefix="/api/v1/labs", tags=["labs"])
lab_manager = LabManager()


class SubmitSolutionRequest(BaseModel):
    solution: str


@router.get("/")
async def list_labs(accept_language: str = Header(default="en")):
    lang = "ru" if "ru" in accept_language.lower() else "en"
    labs = lab_manager.list_labs()
    return {
        "labs": [
            {
                "id": lab["id"],
                "title": lab.get(f"title_{'ru' if lang == 'ru' else 'en'}", lab["title"]),
                "difficulty": lab.get("difficulty"),
                "estimated_time": lab.get("estimated_time"),
                "description": lab.get(f"description_{lang}", lab.get("description", ""))
            }
            for lab in labs
        ],
        "total": len(labs)
    }


@router.get("/{lab_id}")
async def get_lab(lab_id: str, accept_language: str = Header(default="en")):
    lang = "ru" if "ru" in accept_language.lower() else "en"
    lab = lab_manager.get_lab(lab_id)
    if not lab:
        return {"error": "Lab not found"}, 404

    title_key = f"title_{lang}" if f"title_{lang}" in lab else "title"
    description_key = f"description_{lang}" if f"description_{lang}" in lab else "description"
    task_key = f"task_{lang}" if f"task_{lang}" in lab else "task"
    hints_key = f"hints_{lang}" if f"hints_{lang}" in lab else "hints"

    return {
        "id": lab["id"],
        "title": lab.get(title_key, lab.get("title", "")),
        "difficulty": lab.get("difficulty"),
        "estimated_time": lab.get("estimated_time"),
        "description": lab.get(description_key, lab.get("description", "")),
        "task": lab.get(task_key, lab.get("task", "")),
        "hints": lab.get(hints_key, lab.get("hints", [])),
        "validation": lab.get("validation", {})
    }


@router.post("/{lab_id}/submit")
async def submit_solution(lab_id: str, request: SubmitSolutionRequest):
    lab = lab_manager.get_lab(lab_id)
    if not lab:
        return {"error": "Lab not found", "passed": False}, 404

    is_valid, feedback = lab_manager.validate_solution(lab_id, request.solution)
    return {
        "lab_id": lab_id,
        "passed": is_valid,
        "feedback": feedback
    }


@router.get("/{lab_id}/hint/{hint_number}")
async def get_hint(lab_id: str, hint_number: int = 0, accept_language: str = Header(default="en")):
    lang = "ru" if "ru" in accept_language.lower() else "en"
    hint = lab_manager.get_hint(lab_id, hint_number, lang)
    return {
        "lab_id": lab_id,
        "hint_number": hint_number,
        "hint": hint
    }


@router.get("/{lab_id}/solution")
async def reveal_solution(lab_id: str):
    solution = lab_manager.reveal_solution(lab_id)
    return {
        "lab_id": lab_id,
        "solution": solution
    }

