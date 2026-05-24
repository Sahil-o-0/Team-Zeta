from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.candidate import Candidate
from app.schemas.candidate import CandidateInDB, CandidateCreate, CandidateUpdate
from app.api.v1.endpoints.auth import get_current_user
from app.agents.manager import ManagerAgent

router = APIRouter()
manager = ManagerAgent()

@router.get("/", response_model=List[CandidateInDB])
def read_candidates(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Returns the candidate pool filtered by current pipeline stage.
    Provides complete structured records and ratings for the Kanban board.
    """
    query = db.query(Candidate)
    if status:
        query = query.filter(Candidate.status == status)
    return query.order_by(Candidate.score.desc()).all()

@router.post("/", response_model=CandidateInDB)
def create_candidate(
    candidate_in: CandidateCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Manually registers a new candidate profile in the pipeline"""
    db_candidate = Candidate(**candidate_in.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

@router.post("/trigger-sourcing")
async def trigger_autonomous_sourcing(
    job_title: str,
    requirements: List[str],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Triggers the Manager Agent's autonomous sourcing and screening pipeline (BF-101/F-101).
    Fires off as an async background task and logs status to the task registry.
    """
    async def run_pipeline():
        # Get separate database session inside the async task thread
        from app.core.database import SessionLocal
        inner_db = SessionLocal()
        try:
            await manager.orchestrate_sourcing_pipeline(inner_db, job_title, requirements)
        finally:
            inner_db.close()
            
    background_tasks.add_task(run_pipeline)
    return {"message": f"Autonomous Sourcing and Screening pipeline started for '{job_title}'"}

@router.get("/{candidate_id}", response_model=CandidateInDB)
def read_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Returns candidate profile details, bias masked name, and pros/cons"""
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return cand
