from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from datetime import datetime, timezone
from app.core.database import Base

class AgentTask(Base):
    __tablename__ = "agent_tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String(255), index=True)      # e.g., "Sourcing SWE", "PTO Check Priya"
    assigned_agent = Column(String(100), index=True) # e.g., "Talent Scout", "Screening Agent"
    status = Column(String(50), default="Pending")    # Pending, Running, Completed, Escalated, Failed
    input_data = Column(Text, nullable=True)          # JSON-serialized input schema
    output_data = Column(Text, nullable=True)         # JSON-serialized output schema
    error_log = Column(Text, nullable=True)           # Log of errors encountered
    
    # Confidence metrics and controls
    confidence_score = Column(Float, default=1.0) # Decision confidence 0.0 - 1.0
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
