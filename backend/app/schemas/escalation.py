from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EscalationBase(BaseModel):
    title: str
    type: str
    agent_name: str
    description: str
    recommendation: str
    status: Optional[str] = "Pending"
    confidence_score: Optional[float] = 0.7
    context_data: Optional[str] = None

class EscalationCreate(EscalationBase):
    pass

class EscalationResolve(BaseModel):
    status: str  # Approved, Dismissed
    notes: Optional[str] = None
    reviewer_name: Optional[str] = "Human Recruiter"

class EscalationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    reviewer_name: Optional[str] = None

class EscalationInDB(EscalationBase):
    id: int
    notes: Optional[str] = None
    reviewer_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
