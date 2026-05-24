from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.core.database import get_db
from app.models.employee import Employee
from app.models.task import AgentTask
from app.api.v1.endpoints.auth import get_current_user
from app.agents.workforce_analytics import WorkforceAnalyticsAgent

router = APIRouter()
analytics_agent = WorkforceAnalyticsAgent()

@router.get("/roi")
def read_agent_operational_roi(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Calculates dynamic financial savings, time metrics, and auto-automation ratios
    for ZETA workforce agents vs traditional staffing.
    """
    total_tasks = db.query(AgentTask).count()
    completed_tasks = db.query(AgentTask).filter(AgentTask.status == "Completed").count()
    failed_tasks = db.query(AgentTask).filter(AgentTask.status == "Failed").count()
    
    # Calculate automation ratio
    auto_ratio = (completed_tasks / max(total_tasks, 1)) * 100
    
    # Dynamic calculations using our analytics agent
    roi_metrics = analytics_agent.compute_agent_roi(completed_tasks)
    
    return {
        "success": True,
        "total_tasks_run": total_tasks,
        "completed_tasks": completed_tasks,
        "failed_tasks": failed_tasks,
        "autonomous_success_ratio": f"{auto_ratio:.1f}%",
        "roi": roi_metrics
    }

@router.get("/attrition-heatmap")
def read_attrition_risk_heatmap(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    """
    Exposes an organizational attrition overview.
    Aggregates risk score summaries grouped by department (SR-WA-001).
    """
    employees = db.query(Employee).all()
    
    heatmap = {}
    for emp in employees:
        dept = emp.department
        if dept not in heatmap:
            heatmap[dept] = {
                "department": dept,
                "headcount": 0,
                "high_risk_count": 0,
                "medium_risk_count": 0,
                "average_attrition_risk": 0.0,
                "total_risk_sum": 0.0
            }
            
        dept_data = heatmap[dept]
        dept_data["headcount"] += 1
        dept_data["total_risk_sum"] += emp.attrition_risk
        
        if emp.attrition_risk >= 0.70:
            dept_data["high_risk_count"] += 1
        elif emp.attrition_risk >= 0.40:
            dept_data["medium_risk_count"] += 1
            
    # Calculate average
    results = []
    for dept, data in heatmap.items():
        data["average_attrition_risk"] = float(f"{(data['total_risk_sum'] / max(data['headcount'], 1)):.2f}")
        del data["total_risk_sum"]
        results.append(data)
        
    return results
