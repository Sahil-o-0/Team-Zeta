from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    department: str
    salary: float
    tenure_months: int
    communication_score: Optional[float] = 1.0
    performance_rating: Optional[float] = 4.0
    manager_id: Optional[int] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    department: Optional[str] = None
    salary: Optional[float] = None
    tenure_months: Optional[int] = None
    communication_score: Optional[float] = None
    performance_rating: Optional[float] = None
    attrition_risk: Optional[float] = None
    risk_factors: Optional[str] = None
    recommendation: Optional[str] = None
    manager_id: Optional[int] = None

class EmployeeInDB(EmployeeBase):
    id: int
    attrition_risk: float
    risk_factors: Optional[str] = None
    recommendation: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
