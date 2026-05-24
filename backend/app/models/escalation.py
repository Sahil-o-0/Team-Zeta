from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Escalation(Base):
    __tablename__ = "escalations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    type = Column(String(100))                     # Soft, Hard, Emergency
    agent_name = Column(String(100), index=True)   # Screening Agent, Onboarding Agent, etc.
    description = Column(Text)
    recommendation = Column(Text)
    status = Column(String(50), default="Pending")  # Pending, Approved, Dismissed
    confidence_score = Column(Float, default=0.7)
    
    # Detailed metadata mapping for contextual tabs
    context_data = Column(Text, nullable=True)     # JSON string of keys (e.g., {"candidate_id": 3})
    
    # Review outcomes
    notes = Column(Text, nullable=True)            # User feedback or reason for overriding
    reviewer_name = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
