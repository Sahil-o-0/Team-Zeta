from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, index=True)
    candidate_name = Column(String(255), index=True)
    interviewer_name = Column(String(255))
    scheduled_time = Column(DateTime)
    status = Column(String(100), default="Scheduled")  # Scheduled, Live, Completed, Rescheduled, No-Show
    
    # Meeting integration
    meeting_link = Column(String(500), nullable=True)
    
    # Post-interview evaluation
    transcript = Column(Text, nullable=True)
    skills_extracted = Column(Text, nullable=True)     # JSON array or text
    summary = Column(Text, nullable=True)              # Structured feedback from Interview Agent
    recommendation_score = Column(Float, default=0.0)  # Hire score 0 to 100
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
