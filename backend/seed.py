import sys
import os
import json
from datetime import datetime, timedelta, timezone

# Add parent directory to sys.path to allow imports from app
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.candidate import Candidate
from app.models.employee import Employee
from app.models.task import AgentTask
from app.models.escalation import Escalation
from app.models.policy import Policy
from app.models.interview import Interview
from app.memory.memory import OrganizationalMemory

def seed_database():
    print("[Clean] Cleaning database and recreating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("[Seed] Seeding corporate Policies...")
        # 1. Policies
        p1 = Policy(
            title="PTO & Leave Management Policy 2026",
            category="Leave",
            policy_text="""
# CORPORATE PTO LEAVE POLICY (VERSION 4.2)
All regular employees accrue standard paid time off (PTO) monthly.
- Standard limit for autonomous agent approval: Requests <= 3 consecutive business days are automatically approved if there are no team calendar blocks.
- Requests > 3 business days require hard escalation and manager-level explicit approval.
- Employees under 3 months tenure are limited to single-day emergency leave approvals; multi-day requires manager override review.
            """
        )
        p2 = Policy(
            title="Ethical Sourcing & Outreaches Guidelines",
            category="Compliance",
            policy_text="""
# ETHICAL CANDIDATE ENGAGEMENT AND SOURCING
ZETA Workforce Agents must operate within compliant legal sourcing channels.
- External Sourcing channels: Sourcing must respect the rate-limits and robots.txt protocols of primary platforms.
- Sourcing from contracted Agency A is strictly paused pending contract dispute updates.
- All outbound outreach emails must contain active opt-out / unsubscribe options.
            """
        )
        db.add_all([p1, p2])
        db.commit()

        print("[Seed] Seeding Employee database & hierarchies...")
        # 2. Employees
        # Manager Node
        mgr = Employee(
            name="Robert Vance",
            email="robert.vance@zeta.ai",
            role="Director of Engineering",
            department="Engineering",
            salary=185000.0,
            tenure_months=36,
            communication_score=0.95,
            performance_rating=4.7,
            attrition_risk=0.08,
            risk_factors=json.dumps(["None"]),
            recommendation="Standard leadership career growth tracks."
        )
        db.add(mgr)
        db.commit()
        db.refresh(mgr)

        # Reports
        e1 = Employee(
            name="John Davidson",
            email="john.davidson@zeta.ai",
            role="Senior Systems Engineer",
            department="Engineering",
            salary=145000.0,
            tenure_months=12,
            communication_score=0.48, # Dropped communication signals
            performance_rating=4.9,   # High performer, but salary is below mark
            attrition_risk=0.74,      # High Risk attrition calculated by agent
            risk_factors=json.dumps([
                "Anonymous communication frequency has dropped by over 40% vs historic baseline.",
                "Top performer whose salary is below the department market 75th percentile.",
                "Approaching 1-year compensation/grant vesting cliff."
            ]),
            recommendation="Initiate retention review. Suggest compensation market adjustment or equity grant in Sprint 2.",
            manager_id=mgr.id
        )
        e2 = Employee(
            name="Alice Cooper",
            email="alice.cooper@zeta.ai",
            role="Frontend Architect",
            department="Engineering",
            salary=155000.0,
            tenure_months=24,
            communication_score=0.92,
            performance_rating=4.5,
            attrition_risk=0.12,
            risk_factors=json.dumps(["Stable growth patterns"]),
            recommendation="Maintain standard progression tracking.",
            manager_id=mgr.id
        )
        e3 = Employee(
            name="Marcus Brody",
            email="marcus.brody@zeta.ai",
            role="Sales Specialist",
            department="Sales",
            salary=90000.0,
            tenure_months=1, # New hire
            communication_score=0.98,
            performance_rating=4.0,
            attrition_risk=0.05,
            risk_factors=json.dumps(["New hire baseline"]),
            recommendation="Initiate standard Day-30 orientation feedback session."
        )
        db.add_all([e1, e2, e3])
        db.commit()

        print("[Seed] Seeding Candidates pipeline...")
        # 3. Candidates
        c1 = Candidate(
            name="Priya Mehta",
            email="priya.mehta@devstudio.org",
            phone="+1-650-555-0188",
            source="LinkedIn",
            skills="python, react, docker, system design, microservices",
            score=94,
            status="Shortlisted",
            pros=json.dumps([
                "Demonstrates exceptional alignment with core technical requirements.",
                "Strong systems thinking background with experience in distributed environments.",
                "Proven leadership capabilities and technical architecture ownership."
            ]),
            cons=json.dumps(["No critical qualification gaps identified."]),
            recommendation_reason="Highly recommended for senior engineering role. Matched 5/5 core parameters.",
            outreach_sent=True,
            outreach_response="Interested in ZETA. Available for dynamic schedule slots."
        )
        c2 = Candidate(
            name="Jordan Miller",
            email="jordan.miller@cloudcorp.net",
            phone="+1-206-555-0144",
            source="LinkedIn",
            skills="typescript, next.js, kubernetes, AWS, fastapi",
            score=81,
            status="Interview",
            pros=json.dumps(["Strong React/Node knowledge", "Has configured AWS pipelines"]),
            cons=json.dumps(["Leaner distributed systems experience"]),
            recommendation_reason="Strong technical match. Moving candidate to live interview loop.",
            outreach_sent=True
        )
        c3 = Candidate(
            name="Maya Patel",
            email="maya.patel@acme.io",
            phone="+1-312-555-0299",
            source="GitHub",
            skills="python, postgresql, next.js, distributed systems",
            score=67, # Below threshold, soft escalation
            status="Screening",
            pros=json.dumps(["Strong open source contributor", "Excellent distributed systems answers"]),
            cons=json.dumps(["Overall career tenure is shorter than ideal"]),
            recommendation_reason="Resume score is 67/100 (below auto threshold), but candidate exhibits exceptional systems capabilities.",
            outreach_sent=False
        )
        db.add_all([c1, c2, c3])
        db.commit()

        print("[Seed] Seeding active agent Tasks registry...")
        # 4. Agent Tasks
        t1 = AgentTask(
            task_name="Screening resume: Priya Mehta",
            assigned_agent="Screening Agent",
            status="Completed",
            input_data="Candidate: Priya Mehta",
            output_data="Score: 94, Recommendation: Shortlist",
            confidence_score=0.95
        )
        t2 = AgentTask(
            task_name="Search job boards: Senior Systems Engineer",
            assigned_agent="Talent Scout",
            status="Completed",
            input_data="Requirements: python, systems",
            output_data="Found 4 matching candidates.",
            confidence_score=0.98
        )
        t3 = AgentTask(
            task_name="Live Interview transcript summary: Jordan Miller",
            assigned_agent="Interview Agent",
            status="Running",
            input_data="Jordan Miller Live Stream",
            confidence_score=0.90
        )
        t4 = AgentTask(
            task_name="Legacy Portal account registration: Marcus Brody",
            assigned_agent="Browser Agent",
            status="Completed",
            input_data="Marcus Brody profile details",
            output_data="Playwright script automated legacy portal entry successfully.",
            confidence_score=0.94
        )
        db.add_all([t1, t2, t3, t4])
        db.commit()

        print("[Seed] Seeding pending human review Escalations...")
        # 5. Escalations
        esc1 = Escalation(
            title="PAYROLL MISMATCH - John Davidson",
            type="Hard",
            agent_name="Employee Support Agent",
            description="Detected payroll discrepancy: March pay slip register indicates a $420 difference vs signed employment contract record.",
            recommendation="Escalate to human payroll coordinator for manual audit of the legacy timesheet portal.",
            status="Pending",
            confidence_score=0.91,
            context_data=json.dumps({"employee_id": 2, "discrepancy": 420.0})
        )
        esc2 = Escalation(
            title="UNUSUAL CANDIDATE - Maya Patel (SWE-2)",
            type="Soft",
            agent_name="Screening Agent",
            description="Candidate score is 67/100, which falls below the autonomous shortlist threshold (80). However, the profile contains high-fidelity system design signals.",
            recommendation="Consider candidate for initial phone-screen rounds.",
            status="Pending",
            confidence_score=0.63,
            context_data=json.dumps({"candidate_id": 3, "score": 67})
        )
        db.add_all([esc1, esc2])
        db.commit()

        print("[Seed] Seeding Interviews schedule...")
        # 6. Interviews
        int1 = Interview(
            candidate_id=2,
            candidate_name="Jordan Miller",
            interviewer_name="Robert Vance",
            scheduled_time=datetime.now(timezone.utc) + timedelta(hours=2),
            status="Scheduled",
            meeting_link="https://zoom.zeta.ai/zeta-jordan-miller",
            recommendation_score=0.0
        )
        db.add(int1)
        db.commit()

        print("[Memory] Triggering Memory synchronization facade...")
        # Sync database to vector and graph memory stores
        OrganizationalMemory.sync_all_memory(db)
        print("[Memory] Memory index successfully synced.")

        print("[Success] Database seeded successfully!")

    except Exception as e:
        print(f"[Error] Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
