from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AgentTaskBase(BaseModel):
    task_name: str
    assigned_agent: str
    status: Optional[str] = "Pending"
    input_data: Optional[str] = None
    output_data: Optional[str] = None
    confidence_score: Optional[float] = 1.0

class AgentTaskCreate(AgentTaskBase):
    pass

class AgentTaskUpdate(BaseModel):
    status: Optional[str] = None
    output_data: Optional[str] = None
    error_log: Optional[str] = None
    confidence_score: Optional[float] = None
    retry_count: Optional[int] = None

class AgentTaskInDB(AgentTaskBase):
    id: int
    error_log: Optional[str] = None
    retry_count: int
    max_retries: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
