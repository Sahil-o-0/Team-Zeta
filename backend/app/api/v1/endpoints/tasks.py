from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.task import AgentTask
from app.schemas.task import AgentTaskInDB
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[AgentTaskInDB])
def read_agent_tasks(
    status: Optional[str] = None,
    agent: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Returns the real-time operational registry of all active and historical tasks.
    Enables tracking agent states, retries, and errors as requested by SR-MA-001.
    """
    query = db.query(AgentTask)
    if status:
        query = query.filter(AgentTask.status == status)
    if agent:
        query = query.filter(AgentTask.assigned_agent == agent)
        
    return query.order_by(AgentTask.created_at.desc()).all()

@router.get("/{task_id}", response_model=AgentTaskInDB)
def read_agent_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Retrieves full execution details and error logs for a specific task"""
    task = db.query(AgentTask).filter(AgentTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Agent task not found")
    return task
