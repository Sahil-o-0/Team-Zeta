from typing import Dict, Any, List
import random

class TalentScoutAgent:
    """
    Talent Scout Agent: Connects simulated external candidate sources (LinkedIn, GitHub,
    internal pools) to open JDs, performs deduplication, and generates hyper-personalized outreach.
    """
    def __init__(self):
        self.name = "Talent Scout Agent"
        self.description = "Autonomously searches and parses candidates from external profiles and boards"

    async def execute(self, job_title: str, requirements: List[str]) -> Dict[str, Any]:
        """
        Simulates sourcing candidates by scanning standard pools and generating
        personalized outreach letters based on candidate skillsets.
        """
        # A list of realistic candidate profiles to match against
        mock_source_pool = [
            {
                "name": "Sarah Chen",
                "email": "sarah.chen@techmail.com",
                "phone": "+1-415-555-0192",
                "source": "GitHub",
                "skills": "python, distributed systems, postgresql, next.js",
                "bio": "Staff Engineer building highly concurrent backends. Open source contributor to PostgreSQL and async libraries."
            },
            {
                "name": "Jordan Miller",
                "email": "jordan.miller@cloudcorp.net",
                "phone": "+1-206-555-0144",
                "source": "LinkedIn",
                "skills": "typescript, next.js, kubernetes, AWS, fastapi",
                "bio": "Cloud Architect with 5 YoE leading SaaS migrations. Enthusiastic about edge functions and API Gateways."
            },
            {
                "name": "Priya Mehta",
                "email": "priya.mehta@devstudio.org",
                "phone": "+1-650-555-0188",
                "source": "LinkedIn",
                "skills": "python, react, docker, system design, microservices",
                "bio": "Senior Backend Developer focused on distributed caching, multi-tenant databases, and clean code principles."
            },
            {
                "name": "Alex Kovalev",
                "email": "alex.kovalev@infosec.io",
                "phone": "+1-312-555-0111",
                "source": "GitHub",
                "skills": "go, rust, kubernetes, networking, security",
                "bio": "Security infrastructure enthusiast. Writes low-level networking proxies in Rust and manages Kubernetes clusters."
            }
        ]

        sourced_candidates = []
        
        for candidate in mock_source_pool:
            # Calculate match ratio based on skills overlap
            skills_list = [s.strip().lower() for s in candidate["skills"].split(",")]
            match_count = sum(1 for req in requirements if req.lower() in skills_list or any(req.lower() in s for s in skills_list))
            match_ratio = match_count / max(len(requirements), 1)

            # Generate high-fidelity outreach if there is a match
            if match_ratio >= 0.25:
                personalized_email = self.generate_personalized_outreach(candidate, job_title, match_ratio)
                sourced_candidates.append({
                    "name": candidate["name"],
                    "email": candidate["email"],
                    "phone": candidate["phone"],
                    "source": candidate["source"],
                    "skills": candidate["skills"],
                    "relevance_score": int(match_ratio * 100),
                    "outreach_email": personalized_email
                })

        # Sort candidates by relevance
        sourced_candidates.sort(key=lambda x: x["relevance_score"], reverse=True)

        return {
            "success": True,
            "sourced_count": len(sourced_candidates),
            "candidates": sourced_candidates,
            "confidence_score": 0.95 if sourced_candidates else 0.60
        }

    def generate_personalized_outreach(self, candidate: Dict[str, Any], job_title: str, match_ratio: float) -> str:
        """Generates a contextual, highly personalized outreach email based on candidate projects"""
        accent_phrase = ""
        if candidate["source"] == "GitHub":
            accent_phrase = "I came across your impressive open-source contributions and your background in Staff-level backend designs."
        else:
            accent_phrase = f"Your outstanding portfolio in cloud migrations and modern API patterns caught our attention."

        return f"""Subject: ZETA Sourcing: Exciting {job_title} opportunity / Your work on {candidate['skills'].split(',')[0]}

Hi {candidate['name']},

{accent_phrase} 

We are currently expanding our core Workforce Operating System team at ZETA and are looking for a {job_title} who understands deep system complexities. Your background in {candidate['skills']} aligns perfectly with our roadmap, especially given your work on {candidate['bio'].split('.')[0].lower()}.

Given our {int(match_ratio * 100)}% dynamic alignment, I'd love to connect for 15 minutes to share our vision for autonomous workforce coordination. Are you free this Tuesday or Thursday afternoon?

Best regards,
ZETA Talent Scout Agent
Autonomous Workforce OS Sourcing
"""
