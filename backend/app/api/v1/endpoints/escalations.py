from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.escalation import Escalation
from app.schemas.escalation import EscalationInDB, EscalationResolve
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[EscalationInDB])
def read_escalations(
    status: Optional[str] = "Pending",
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Returns the current operational queue of pending human review escalations.
    Allows HR operators to view context, confidence, severity levels, and recommendation details.
    """
    query = db.query(Escalation)
    if status:
        query = query.filter(Escalation.status == status)
    return query.order_by(Escalation.created_at.desc()).all()

@router.post("/{escalation_id}/resolve", response_model=EscalationInDB)
def resolve_escalation(
    escalation_id: int,
    resolution: EscalationResolve,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Approves or Dismisses an active escalation, saving user notes and reviewer details.
    Guarantees full auditable state changes in accordance with SR-HE-004.
    """
    escalation = db.query(Escalation).filter(Escalation.id == escalation_id).first()
    if not escalation:
        raise HTTPException(status_code=404, detail="Escalation not found")
        
    if escalation.status != "Pending":
        raise HTTPException(status_code=400, detail="Escalation has already been resolved")
        
    escalation.status = resolution.status
    escalation.notes = resolution.notes
    escalation.reviewer_name = resolution.reviewer_name or current_user
    
    db.commit()
    db.refresh(escalation)
    return escalation
