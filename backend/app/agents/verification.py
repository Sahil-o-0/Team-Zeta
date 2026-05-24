from typing import Dict, Any

class VerificationAgent:
    """
    Verification Agent: Executes background, criminal, and employment verification checks
    via mock secure APIs (e.g. Checkr, HireRight). Calculates risk and flags discrepancies.
    """
    def __init__(self):
        self.name = "Verification Agent"
        self.description = "Executes employment reference and credentials validation securely"

    async def execute(self, candidate_name: str, verification_consent: bool, education_history: str = None) -> Dict[str, Any]:
        """
        Runs employment verification logic.
        Ensures strict compliance checks and returns detailed fraud risk analysis.
        """
        if not verification_consent:
            return {
                "success": False,
                "error": "Missing Candidate Verification Consent. All background checks must be explicitly consented.",
                "confidence_score": 1.0
            }

        # Mock check outcomes. By default, most checks succeed.
        # We flag a mock case for "John Davidson" who has a payroll discrepancy in payroll verification
        # and demo discrepancies for verification check alerts
        has_issue = candidate_name.lower() == "john davidson" or "fraud" in candidate_name.lower()
        
        fraud_risk_score = 0.85 if has_issue else 0.05
        status = "Needs Human Review" if has_issue else "Cleared"
        
        verification_details = []
        if has_issue:
            verification_details.append("Discrepancy detected: Declared employment duration at Google LLC does not match HRIS record by 18 months.")
        else:
            verification_details.append("Employment and criminal history check returned 100% clean record. Education credentials verified.")

        return {
            "success": True,
            "verification_status": status,
            "fraud_risk_score": fraud_risk_score,
            "flags": verification_details,
            "confidence_score": 0.95
        }
