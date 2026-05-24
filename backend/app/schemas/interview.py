from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InterviewBase(BaseModel):
    candidate_id: int
    candidate_name: str
    interviewer_name: str
    scheduled_time: datetime
    status: Optional[str] = "Scheduled"
    meeting_link: Optional[str] = None

class InterviewCreate(InterviewBase):
    pass

class InterviewUpdate(BaseModel):
    status: Optional[str] = None
    transcript: Optional[str] = None
    skills_extracted: Optional[str] = None
    summary: Optional[str] = None
    recommendation_score: Optional[float] = None
    meeting_link: Optional[str] = None
    scheduled_time: Optional[datetime] = None

class InterviewInDB(InterviewBase):
    id: int
    transcript: Optional[str] = None
    skills_extracted: Optional[str] = None
    summary: Optional[str] = None
    recommendation_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
