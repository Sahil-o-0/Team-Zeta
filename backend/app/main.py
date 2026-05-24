from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.memory.memory import OrganizationalMemory

# Import API routers
from app.api.v1.endpoints import auth, tasks, candidates, escalations, analytics, policies, employees

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Autonomous Workforce Operating System Layer supporting Multi-Agent Operations, Persistent Memory, and Human Decision controls.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Setup CORS middleware for frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup lifecycle hook to synchonize database records with memory indices
@app.on_event("startup")
def startup_event():
    print("[Memory] Initializing ZETA Persistent Organizational Memory Layer...")
    db = SessionLocal()
    try:
        OrganizationalMemory.sync_all_memory(db)
        print("[Memory] Memory indices successfully synchronized.")
    finally:
        db.close()

# Mount API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(tasks.router, prefix=f"{settings.API_V1_STR}/tasks", tags=["Agent Operations Queue"])
app.include_router(candidates.router, prefix=f"{settings.API_V1_STR}/candidates", tags=["Autonomous Recruiting Copilot"])
app.include_router(escalations.router, prefix=f"{settings.API_V1_STR}/escalations", tags=["Human Escalation Queue"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Workforce Analytics & ROI"])
app.include_router(policies.router, prefix=f"{settings.API_V1_STR}/policies", tags=["Compliance Handbooks"])
app.include_router(employees.router, prefix=f"{settings.API_V1_STR}/employees", tags=["Active Employee Operations"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
