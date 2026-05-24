from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.policy import Policy
from app.schemas.policy import PolicyInDB, PolicyCreate
from app.api.v1.endpoints.auth import get_current_user
from app.memory.memory import vector_memory

router = APIRouter()

@router.get("/", response_model=List[PolicyInDB])
def read_policies(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Returns the company's internal compliance policies and handbooks"""
    query = db.query(Policy)
    if category:
        query = query.filter(Policy.category == category)
    return query.all()

@router.post("/", response_model=PolicyInDB)
def create_policy(
    policy_in: PolicyCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Registers a new corporate compliance handbook policy"""
    policy = Policy(**policy_in.model_dump())
    db.add(policy)
    db.commit()
    db.refresh(policy)
    
    # Sync immediately with our vector search index
    vector_memory.add_document(
        doc_id=f"policy_{policy.id}",
        text=f"{policy.title} {policy.category} {policy.policy_text}",
        category="policy",
        metadata={"id": policy.id, "title": policy.title}
    )
    
    return policy

@router.get("/semantic-query")
def search_policies_semantically(
    query: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Runs a real-time semantic vector query across internal organizational policy files.
    Returns matched sections with confidence indexes using episodic memories (SR-MEM-005).
    """
    matches = vector_memory.search(query, category="policy", limit=3)
    results = []
    
    for match in matches:
        policy_id = match["metadata"].get("id")
        policy = db.query(Policy).filter(Policy.id == policy_id).first()
        if policy:
            results.append({
                "policy_id": policy.id,
                "title": policy.title,
                "category": policy.category,
                "matching_text_snippet": match["text"][:300] + "...",
                "relevance_rank": "High"
            })
            
    return results
