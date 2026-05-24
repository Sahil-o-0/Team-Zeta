from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.candidate import Candidate
from app.schemas.candidate import CandidateInDB, CandidateCreate, CandidateUpdate
from app.api.v1.endpoints.auth import get_current_user
from app.agents.manager import ManagerAgent

router = APIRouter()
manager = ManagerAgent()

@router.get("/", response_model=List[CandidateInDB])
def read_candidates(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Returns the candidate pool filtered by current pipeline stage.
    Provides complete structured records and ratings for the Kanban board.
    """
    query = db.query(Candidate)
    if status:
        query = query.filter(Candidate.status == status)
    return query.order_by(Candidate.score.desc()).all()

@router.post("/", response_model=CandidateInDB)
def create_candidate(
    candidate_in: CandidateCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Manually registers a new candidate profile in the pipeline"""
    db_candidate = Candidate(**candidate_in.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

@router.post("/trigger-sourcing")
async def trigger_autonomous_sourcing(
    job_title: str,
    requirements: List[str],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """
    Triggers the Manager Agent's autonomous sourcing and screening pipeline (BF-101/F-101).
    Fires off as an async background task and logs status to the task registry.
    """
    async def run_pipeline():
        # Get separate database session inside the async task thread
        from app.core.database import SessionLocal
        inner_db = SessionLocal()
        try:
            await manager.orchestrate_sourcing_pipeline(inner_db, job_title, requirements)
        finally:
            inner_db.close()
            
    background_tasks.add_task(run_pipeline)
    return {"message": f"Autonomous Sourcing and Screening pipeline started for '{job_title}'"}

@router.get("/{candidate_id}", response_model=CandidateInDB)
def read_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Returns candidate profile details, bias masked name, and pros/cons"""
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return cand

from fastapi import UploadFile, File
from app.models.task import AgentTask

from fastapi import Form

@router.post("/upload-resume")
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    jd_requirements: str = Form("python, systems, sql"),
    db: Session = Depends(get_db)
):
    """Accepts uploaded resume file and triggers autonomous screening task pipeline"""
    contents = await file.read()
    
    # Parse PDF text if file is a PDF
    if file.filename.lower().endswith(".pdf"):
        import io
        from pypdf import PdfReader
        try:
            pdf_file = io.BytesIO(contents)
            reader = PdfReader(pdf_file)
            text_list = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_list.append(page_text)
            text = "\n".join(text_list)
        except Exception as pdf_err:
            print(f"[Error] Failed to parse PDF with pypdf: {pdf_err}")
            text = contents.decode("utf-8", errors="ignore")
    else:
        text = contents.decode("utf-8", errors="ignore")
    
    filename = file.filename
    cand_name = filename.split(".")[0].replace("_", " ").title()
    
    # Parse custom requirements passed from the tester form
    reqs = [r.strip().lower() for r in jd_requirements.split(",") if r.strip()]
    if not reqs:
        reqs = ["python", "systems", "sql"]
    
    from datetime import datetime
    unique_email = f"{cand_name.lower().replace(' ', '')}_{int(datetime.now().timestamp())}@example.com"
    
    db_candidate = Candidate(
        name=cand_name,
        email=unique_email,
        masked_name=f"Masked-{cand_name[:4]}",
        status="Sourced",
        score=75,
        skills=", ".join(reqs).title(),
        recommendation_reason=f"Resume uploaded via Candidate Engine. Screening against: {', '.join(reqs)}"
    )
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    
    async def screen_candidate_task():
        from app.core.database import SessionLocal
        inner_db = SessionLocal()
        try:
            task = AgentTask(
                task_name=f"Screening resume: {cand_name}",
                assigned_agent="Screening Agent",
                status="Running",
                input_data=f"Candidate: {cand_name}. Criteria: {', '.join(reqs)}",
                confidence_score=0.9
            )
            inner_db.add(task)
            inner_db.commit()
            inner_db.refresh(task)
            
            from app.agents.screening import ScreeningAgent
            screening_agent = ScreeningAgent()
            screen_res = await screening_agent.execute(
                name=cand_name,
                resume_text=text,
                jd_requirements=reqs
            )
            
            cand = inner_db.query(Candidate).filter(Candidate.id == db_candidate.id).first()
            if cand:
                cand.score = screen_res["score"]
                cand.recommendation_reason = screen_res["recommendation_reason"]
                cand.status = "Screening"
                inner_db.commit()
                
            task_rec = inner_db.query(AgentTask).filter(AgentTask.id == task.id).first()
            if task_rec:
                task_rec.status = "Completed"
                task_rec.output_data = f"Score: {screen_res['score']}. Recommendation: {screen_res['recommendation_reason']}"
                inner_db.commit()
        except Exception as e:
            print(f"[Error] Resume task screening failed: {e}")
        finally:
            inner_db.close()
            
    background_tasks.add_task(screen_candidate_task)
    return {"message": "Upload success", "candidate_id": db_candidate.id, "name": cand_name}
