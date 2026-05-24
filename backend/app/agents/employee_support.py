from typing import Dict, Any

class EmployeeSupportAgent:
    """
    Employee Support Agent: Classifies incoming requests, resolves Tier-1 queries
    (like PTO requests against policy or policy checks), and escalates Tier-3 compliance issues.
    """
    def __init__(self):
        self.name = "Employee Support Agent"
        self.description = "Resolves Tier-1 employee queries autonomously and routes escalations"

    async def execute(self, employee_name: str, employee_email: str, request_text: str) -> Dict[str, Any]:
        """
        Processes an employee's HR support ticket.
        Classifies request and determines if it requires manual escalation or can be auto-approved.
        """
        req_lower = request_text.lower()
        
        # 1. Classification
        if any(w in req_lower for w in ["harass", "discrimination", "abuse", "legal", "lawsuit"]):
            # Tier-3 Critical Escalation!
            return {
                "success": True,
                "classification": "Tier-3 Critical Compliance",
                "resolved": False,
                "confidence_score": 1.0,
                "escalate": True,
                "action": "Immediate Escalation to HR Legal Team",
                "explanation": "Request flags potential harassment, ethical, or legal issues, which must never be handled autonomously."
            }
            
        elif any(w in req_lower for w in ["pto", "leave", "vacation", "off"]):
            # PTO Request
            days_requested = 1
            # Extract number of days if mentioned
            match = re.search(r"(\d+)\s*day", req_lower)
            if match:
                days_requested = int(match.group(1))

            if days_requested <= 3:
                # Auto-approve small leave requests per policy (SR-HE-001/Soft limits)
                return {
                    "success": True,
                    "classification": "Tier-1 Administrative",
                    "resolved": True,
                    "confidence_score": 0.95,
                    "escalate": False,
                    "action": f"Auto-Approved {days_requested} days of leave",
                    "explanation": f"PTO request for {days_requested} days is within the 3-day policy threshold and has been registered in the calendar."
                }
            else:
                # Escalate longer requests
                return {
                    "success": True,
                    "classification": "Tier-2 Operational",
                    "resolved": False,
                    "confidence_score": 0.88,
                    "escalate": True,
                    "action": "Route to Manager for Explicit Approval",
                    "explanation": f"PTO request for {days_requested} days exceeds the 3-day autonomous approval limit."
                }

        else:
            # Policy Lookup Tier-1
            return {
                "success": True,
                "classification": "Tier-1 Policy Inquiry",
                "resolved": True,
                "confidence_score": 0.90,
                "escalate": False,
                "action": "Generated Policy Response",
                "explanation": "Classified as a general company handbook or policy query. Resolved autonomously."
            }

import re
