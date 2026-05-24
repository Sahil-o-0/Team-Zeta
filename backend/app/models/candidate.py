from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(50), nullable=True)
    source = Column(String(100), default="LinkedIn")  # LinkedIn, GitHub, Job Board, etc.
    resume_url = Column(String(500), nullable=True)
    resume_text = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)  # Comma-separated list or JSON array
    score = Column(Integer, default=0)    # Numerical rating (0-100) from Screening Agent
    status = Column(String(100), default="Sourced")  # Sourced, Screening, Shortlisted, Interview, Offer, Rejected
    
    # Screening output fields
    pros = Column(Text, nullable=True)  # JSON-serialized list of pros
    cons = Column(Text, nullable=True)  # JSON-serialized list of cons
    recommendation_reason = Column(Text, nullable=True)
    
    # Outreach status
    outreach_sent = Column(Boolean, default=False)
    outreach_response = Column(Text, nullable=True)  # Sentiment / Reply content
    
    # Bias mitigation masking
    masked_name = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
