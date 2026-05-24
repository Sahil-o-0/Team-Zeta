from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from datetime import datetime, timezone
from app.core.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    role = Column(String(255))
    department = Column(String(100), index=True)
    salary = Column(Float, default=0.0)
    tenure_months = Column(Integer, default=0)
    
    # Behavioral intelligence signals for attrition models
    communication_score = Column(Float, default=1.0)  # Standard frequency factor (0.0 to 1.0)
    performance_rating = Column(Float, default=4.0)   # Scale 1.0 to 5.0
    
    # Predictive Analytics from Workforce Analytics Agent
    attrition_risk = Column(Float, default=0.0)       # 0.0 (low) to 1.0 (high)
    risk_factors = Column(Text, nullable=True)         # JSON-serialized reasons
    recommendation = Column(Text, nullable=True)       # HR action plan to mitigate churn
    
    # Graph structure
    manager_id = Column(Integer, nullable=True)        # Manager relation
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
