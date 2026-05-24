from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    source: Optional[str] = "LinkedIn"
    resume_url: Optional[str] = None
    resume_text: Optional[str] = None
    skills: Optional[str] = None
    status: Optional[str] = "Sourced"

class CandidateCreate(CandidateBase):
    pass

class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    score: Optional[int] = None
    skills: Optional[str] = None
    pros: Optional[str] = None
    cons: Optional[str] = None
    recommendation_reason: Optional[str] = None
    outreach_sent: Optional[bool] = None
    outreach_response: Optional[str] = None

class CandidateInDB(CandidateBase):
    id: int
    score: int
    pros: Optional[str] = None
    cons: Optional[str] = None
    recommendation_reason: Optional[str] = None
    outreach_sent: bool
    outreach_response: Optional[str] = None
    masked_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
