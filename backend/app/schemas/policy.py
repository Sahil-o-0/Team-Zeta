from pydantic import BaseModel
from datetime import datetime

class PolicyBase(BaseModel):
    title: str
    category: str
    policy_text: str

class PolicyCreate(PolicyBase):
    pass

class PolicyInDB(PolicyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
