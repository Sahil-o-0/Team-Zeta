from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.core.database import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeInDB, EmployeeCreate, EmployeeUpdate
from app.api.v1.endpoints.auth import get_current_user
from app.memory.memory import graph_memory

router = APIRouter()

@router.get("/", response_model=List[EmployeeInDB])
def read_employees(
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Returns active employees.
    Integrates performance logs and tenure factors for intelligence audits.
    """
    query = db.query(Employee)
    if department:
        query = query.filter(Employee.department == department)
    return query.all()

@router.post("/", response_model=EmployeeInDB)
def create_employee(
    employee_in: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Registers a new active employee profile"""
    emp = Employee(**employee_in.model_dump())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@router.get("/{employee_id}/relationship-graph")
def query_employee_hierarchy_graph(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Leverages our Associative Graph Memory simulator to return Manager relations,
    direct reports, and connection nodes (SR-MEM-006).
    """
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee record not found")
        
    node_key = f"employee_{employee_id}"
    neighbors = graph_memory.get_neighbors(node_key)
    
    reports = []
    manager = None
    
    for neighbor in neighbors:
        node = neighbor["node"]
        edge_prop = neighbor["edge_properties"]
        direction = neighbor["direction"]
        
        rel_info = {
            "id": node["id"],
            "name": node["properties"].get("name"),
            "role": node["properties"].get("role"),
            "relationship_details": edge_prop
        }
        
        if direction == "out":
            # manager -> employee edge implies this neighbor is managed by employee_id
            reports.append(rel_info)
        else:
            # employee -> manager edge implies employee_id is managed by this neighbor
            manager = rel_info

    return {
        "success": True,
        "employee_id": employee_id,
        "name": emp.name,
        "role": emp.role,
        "manager": manager,
        "direct_reports": reports,
        "nodes_visited_count": len(neighbors) + 1
    }

from app.agents.manager import ManagerAgent
manager_agent = ManagerAgent()

@router.post("/submit-request")
async def submit_employee_request(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Submits a dynamic employee request (PTO, support query) for compliance auditing.
    Runs autonomous Policy Agent checks and triggers Soft/Hard/Emergency escalations.
    """
    name = payload.get("employee_name")
    email = payload.get("email")
    request_text = payload.get("request_text")
    
    if not name or not email or not request_text:
        raise HTTPException(status_code=400, detail="Missing required parameters: employee_name, email, request_text")
        
    res = await manager_agent.handle_employee_request(db, name, email, request_text)
    if not res.get("success"):
        raise HTTPException(status_code=500, detail=res.get("error"))
    return res
