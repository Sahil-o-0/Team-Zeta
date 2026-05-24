from typing import Dict, Any, List, TypedDict
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.task import AgentTask
from app.models.escalation import Escalation

# Import specialized agents
from app.agents.talent_scout import TalentScoutAgent
from app.agents.screening import ScreeningAgent
from app.agents.scheduling import SchedulingAgent
from app.agents.interview import InterviewAgent
from app.agents.verification import VerificationAgent
from app.agents.onboarding import OnboardingAgent
from app.agents.employee_support import EmployeeSupportAgent
from app.agents.policy import PolicyAgent
from app.agents.workforce_analytics import WorkforceAnalyticsAgent
from app.agents.browser_use import BrowserAgent

# Import LangGraph requirements
from langgraph.graph import StateGraph, END

# Define state schema for LangGraph workflow
class SourcingState(TypedDict):
    job_title: str
    requirements: List[str]
    candidates: List[Dict[str, Any]]
    screened_results: List[Dict[str, Any]]
    escalation_triggered: bool
    escalation_reason: str
    confidence_score: float
    error_msg: str

class ManagerAgent:
    """
    Manager Agent (Orchestrator): Core coordinator of ZETA's Workforce Network.
    Fully refactored to compile and execute stateful LangGraph workflows.
    """
    def __init__(self):
        self.name = "Manager Agent (Orchestrator)"
        self.scout_agent = TalentScoutAgent()
        self.screening_agent = ScreeningAgent()
        self.scheduling_agent = SchedulingAgent()
        self.interview_agent = InterviewAgent()
        self.verification_agent = VerificationAgent()
        self.onboarding_agent = OnboardingAgent()
        self.support_agent = EmployeeSupportAgent()
        self.policy_agent = PolicyAgent()
        self.analytics_agent = WorkforceAnalyticsAgent()
        self.browser_agent = BrowserAgent()
        
        # Build the compiled LangGraph StateGraph
        self.workflow = self._build_sourcing_graph()

    def _build_sourcing_graph(self) -> StateGraph:
        """
        Compiles the cyclical/conditional Sourcing & Screening LangGraph StateGraph.
        Includes candidate sourcing nodes, blind screening nodes, and conditional escalation routing.
        """
        workflow = StateGraph(SourcingState)

        # Node 1: Talent Sourcing
        async def talent_scout_node(state: SourcingState) -> Dict[str, Any]:
            print(f"[LangGraph Orchestrator] Running Sourcing Node for '{state['job_title']}'...")
            res = await self.scout_agent.execute(state["job_title"], state["requirements"])
            if not res["success"]:
                return {"error_msg": "Talent Scout failed to source candidates."}
                
            return {
                "candidates": res["candidates"],
                "confidence_score": res["confidence_score"]
            }

        # Node 2: Blind Screening & Ranking
        async def screening_node(state: SourcingState) -> Dict[str, Any]:
            print("[LangGraph Orchestrator] Running Blind Screening Node...")
            candidates = state["candidates"]
            screened = []
            escalate = False
            reason = ""
            
            for cand in candidates:
                resume_text = f"Resume file for {cand['name']}. Professional experiences focus on {cand['skills']}. Profile bio: {cand['name']} is a software systems developer."
                
                screen_res = await self.screening_agent.execute(
                    name=cand["name"],
                    resume_text=resume_text,
                    jd_requirements=state["requirements"]
                )
                
                confidence = screen_res["confidence_score"]
                if confidence < settings.CONFIDENCE_AUTONOMOUS_THRESHOLD:
                    escalate = True
                    reason = f"Candidate score for {cand['name']} requires human review threshold."

                screened.append({
                    "name": cand["name"],
                    "score": screen_res["score"],
                    "pros": screen_res["pros"],
                    "cons": screen_res["cons"],
                    "recommendation": screen_res["recommendation_reason"],
                    "outreach": cand["outreach_email"],
                    "confidence_score": confidence
                })
                
            return {
                "screened_results": screened,
                "escalation_triggered": escalate,
                "escalation_reason": reason
            }

        # Node 3: Escalation Trigger Node
        async def escalation_node(state: SourcingState) -> Dict[str, Any]:
            print("[LangGraph Orchestrator] Running Escalation Node...")
            # Marks state status
            return {"escalation_triggered": True}

        # Node 4: Complete Sourcing Pipeline Node
        async def complete_node(state: SourcingState) -> Dict[str, Any]:
            print("[LangGraph Orchestrator] Running Completion Node...")
            return state

        # Register nodes in LangGraph
        workflow.add_node("talent_scout", talent_scout_node)
        workflow.add_node("screening", screening_node)
        workflow.add_node("escalation", escalation_node)
        workflow.add_node("complete", complete_node)

        # Set edges & compile
        workflow.set_entry_point("talent_scout")
        workflow.add_edge("talent_scout", "screening")

        # Routing decision logic based on screening state
        def should_escalate(state: SourcingState) -> str:
            if state.get("error_msg"):
                return "escalation"
            if state.get("escalation_triggered"):
                return "escalation"
            return "complete"

        workflow.add_conditional_edges(
            "screening",
            should_escalate,
            {
                "escalation": "escalation",
                "complete": "complete"
            }
        )

        workflow.add_edge("escalation", END)
        workflow.add_edge("complete", END)

        return workflow.compile()

    async def orchestrate_sourcing_pipeline(self, db: Session, job_title: str, requirements: List[str]) -> Dict[str, Any]:
        """
        Runs the full autonomous sourcing pipeline utilizing our compiled LangGraph StateGraph.
        Saves progress metrics directly to SQL tasks and hooks pending soft escalations.
        """
        main_task = AgentTask(
            task_name=f"LangGraph Sourcing for {job_title}",
            assigned_agent="Manager Agent",
            status="Running",
            input_data=f"Job: {job_title}, Reqs: {requirements}",
            confidence_score=1.0
        )
        db.add(main_task)
        db.commit()
        db.refresh(main_task)

        try:
            # 1. Initialize LangGraph starting state
            initial_state: SourcingState = {
                "job_title": job_title,
                "requirements": requirements,
                "candidates": [],
                "screened_results": [],
                "escalation_triggered": False,
                "escalation_reason": "",
                "confidence_score": 1.0,
                "error_msg": ""
            }

            # 2. Execute compiled graph workflows
            final_state = await self.workflow.ainvoke(initial_state)

            if final_state.get("error_msg"):
                raise Exception(final_state["error_msg"])

            # 3. Synchronize outcomes back to database & handle escalations
            screened_results = final_state["screened_results"]
            
            for res in screened_results:
                if res["confidence_score"] < settings.CONFIDENCE_AUTONOMOUS_THRESHOLD:
                    escalation = Escalation(
                        title=f"UNUSUAL CANDIDATE - {res['name']} ({job_title})",
                        type="Soft",
                        agent_name="Screening Agent",
                        description=f"Candidate scored {res['score']}/100, which is below auto-shortlist target but shows technical promise.",
                        recommendation="Consider candidate for primary interview rounds.",
                        confidence_score=res["confidence_score"],
                        context_data=f"{{\"candidate_name\": \"{res['name']}\", \"score\": {res['score']}}}"
                    )
                    db.add(escalation)
            
            main_task.status = "Completed"
            main_task.output_data = f"Successfully sourced and screened {len(screened_results)} candidates via LangGraph."
            db.commit()

            return {
                "success": True,
                "task_id": main_task.id,
                "results": screened_results
            }

        except Exception as e:
            main_task.status = "Failed"
            main_task.error_log = str(e)
            db.commit()
            return {"success": False, "error": str(e)}

    async def handle_employee_request(self, db: Session, employee_name: str, email: str, request_text: str) -> Dict[str, Any]:
        """
        Coordinates leave requests and employee inquires.
        Runs policy compliance reviews via Policy Agent, auto-approving small PTOS and routing escalations for discrepancies.
        """
        task = AgentTask(
            task_name=f"HR Request: {employee_name}",
            assigned_agent="Manager Agent",
            status="Running",
            input_data=request_text,
            confidence_score=1.0
        )
        db.add(task)
        db.commit()

        try:
            support_result = await self.support_agent.execute(employee_name, email, request_text)
            
            # Policy Validation
            if "pto" in request_text.lower():
                policy_check = await self.policy_agent.execute(
                    action_type="pto_approval",
                    action_details={"days": 4 if "4 day" in request_text.lower() else 1, "employee_tenure": 12},
                    policy_database=[]
                )
                if not policy_check["is_compliant"]:
                    support_result["escalate"] = True
                    support_result["explanation"] += f" Compliance issue: {policy_check['explanation']}"

            if support_result["escalate"]:
                severity = "Hard" if "Tier-2" in support_result["classification"] else "Emergency"
                
                # Escalated to human control loop!
                escalation = Escalation(
                    title=f"PTO / COMPLIANCE REVIEW - {employee_name}",
                    type=severity,
                    agent_name="Employee Support Agent",
                    description=support_text_description(employee_name, request_text, support_result),
                    recommendation=support_result["action"],
                    confidence_score=support_result["confidence_score"],
                    context_data=f"{{\"employee_email\": \"{email}\"}}"
                )
                db.add(escalation)
                task.status = "Escalated"
                db.commit()
            else:
                task.status = "Completed"
                task.output_data = f"Resolved autonomously: {support_result['action']}"
                db.commit()

            return {
                "success": True,
                "resolved": support_result["resolved"],
                "action_taken": support_result["action"],
                "escalated": support_result["escalate"],
                "explanation": support_result["explanation"]
            }

        except Exception as e:
            task.status = "Failed"
            task.error_log = str(e)
            db.commit()
            return {"success": False, "error": str(e)}

def support_text_description(name: str, req: str, res: Dict[str, Any]) -> str:
    return f"Request from {name}: '{req}'. Classified as {res['classification']}. Details: {res['explanation']}"
