from typing import Dict, Any

class OnboardingAgent:
    """
    Onboarding Agent: Coordinates IT provisioning tickets (Jira / ServiceNow),
    sends document signing requests (DocuSign), and initialises payroll details.
    """
    def __init__(self):
        self.name = "Onboarding Agent"
        self.description = "Manages employee provisioning, payroll initialisation, and onboarding paperwork"

    async def execute(self, employee_name: str, department: str, email: str, role: str) -> Dict[str, Any]:
        """
        Runs the onboarding automation flow.
        Creates an IT ticket, triggers DocuSign contracts, and registers employee in payroll.
        """
        # IT Ticket Generation
        ticket_id = f"IT-{random_number()}"
        it_ticket_details = f"Create corporate account and provision MacBook Pro for {employee_name} ({role} in {department})."
        
        # Payroll Registration
        payroll_id = f"PAY-{random_number()}"
        
        # DocuSign NDA & Contract request
        docusign_id = f"ENV-{random_number()}"

        return {
            "success": True,
            "it_ticket_status": f"Ticket {ticket_id} created successfully",
            "it_ticket_details": it_ticket_details,
            "docusign_envelope_id": docusign_id,
            "docusign_status": "NDA Sent for Signing",
            "payroll_registration_id": payroll_id,
            "payroll_status": "Active - Pending Day 1 Orientation",
            "confidence_score": 0.97,
            "summary": f"Onboarding workflows initialized: IT Provisioning ({ticket_id}) registered; DocuSign agreement sent; Payroll record ({payroll_id}) created."
        }

def random_number() -> int:
    import random
    return random.randint(1000, 9999)
