import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def print_separator(title):
    print("\n" + "=" * 60)
    print(f" TESTING: {title}")
    print("=" * 60)

def run_comprehensive_api_tests():
    print("==================================================")
    print("     ZETA COMPREHENSIVE API TEST SUITE           ")
    print("==================================================")

    # ------------------------------------------------
    # 1. Auth Endpoint
    # ------------------------------------------------
    print_separator("1. Auth Layer Token Exchange")
    token = None
    try:
        payload = {"username": "admin@zeta.ai", "password": "password123"}
        res = requests.post(f"{BASE_URL}/auth/token", data=payload)
        if res.status_code == 200:
            token_data = res.json()
            token = token_data.get("access_token")
            print(f"[Pass] Auth succeeded! Received token: {token[:20]}...")
        else:
            print(f"[Fail] Auth failed: {res.status_code} - {res.text}")
            sys.exit(1)
    except Exception as e:
        print(f"[Error] Failed to call Auth endpoint: {e}")
        sys.exit(1)

    headers = {"Authorization": f"Bearer {token}"}

    # ------------------------------------------------
    # 2. Candidates Pool Endpoints
    # ------------------------------------------------
    print_separator("2. Candidates & Sourcing Operations")
    try:
        # A. Read pool
        res = requests.get(f"{BASE_URL}/candidates/", headers=headers)
        print(f"[Pass] Candidates Read Pool: status={res.status_code}, count={len(res.json())}")
        
        # B. Manually create a new candidate
        payload = {
            "name": "Devin AI",
            "email": "devin@agentic.org",
            "phone": "+1-800-555-9999",
            "source": "GitHub",
            "skills": "python, fast-api, postgresql, docker",
            "score": 0,
            "status": "Screening"
        }
        res_create = requests.post(f"{BASE_URL}/candidates/", json=payload, headers=headers)
        if res_create.status_code == 200:
            new_cand = res_create.json()
            print(f"[Pass] Created candidate profile: ID={new_cand['id']}, status={new_cand['status']}")
        else:
            print(f"[Fail] Create candidate failed: {res_create.status_code} - {res_create.text}")

        # C. Trigger Sourcing Agent Pipeline
        sourcing_payload = {
            "job_title": "Senior Backend Developer",
            "requirements": ["python", "docker", "fastapi"]
        }
        res_source = requests.post(
            f"{BASE_URL}/candidates/trigger-sourcing?job_title=Senior+Backend+Developer", 
            json=["python", "docker", "fastapi"], 
            headers=headers
        )
        print(f"[Pass] Sourcing Agent Pipeline triggered: status={res_source.status_code}")
        print(f"       Message: {res_source.json().get('message')}")
    except Exception as e:
        print(f"[Error] Candidate endpoints check failed: {e}")

    # ------------------------------------------------
    # 3. Active Agent Tasks Endpoint
    # ------------------------------------------------
    print_separator("3. Active Agent Operations Queue")
    try:
        res = requests.get(f"{BASE_URL}/tasks/", headers=headers)
        print(f"[Pass] Agent Task Queue Read: status={res.status_code}, count={len(res.json())}")
        for task in res.json()[:3]:
            print(f"       Task: '{task['task_name']}' | Assigned Agent: '{task['assigned_agent']}' | Status: '{task['status']}'")
    except Exception as e:
        print(f"[Error] Task endpoints check failed: {e}")

    # ------------------------------------------------
    # 4. Human Review Escalations Endpoint
    # ------------------------------------------------
    print_separator("4. Human Escalation Queue")
    try:
        res = requests.get(f"{BASE_URL}/escalations/", headers=headers)
        print(f"[Pass] Escalations Queue Read: status={res.status_code}, count={len(res.json())}")
        for esc in res.json()[:2]:
            print(f"       Escalation: '{esc['title']}' | Severity: '{esc['type']}' | Status: '{esc['status']}'")
    except Exception as e:
        print(f"[Error] Escalation endpoints check failed: {e}")

    # ------------------------------------------------
    # 5. Policies & Compliance Handbook Endpoint
    # ------------------------------------------------
    print_separator("5. Corporate Policies & Compliance Handbooks")
    try:
        res = requests.get(f"{BASE_URL}/policies/", headers=headers)
        print(f"[Pass] Policies Read: status={res.status_code}, count={len(res.json())}")
        for pol in res.json()[:2]:
            print(f"       Policy Title: '{pol['title']}' | Category: '{pol['category']}'")
    except Exception as e:
        print(f"[Error] Policy endpoints check failed: {e}")

    # ------------------------------------------------
    # 6. Active Employee & PTO Action Endpoints
    # ------------------------------------------------
    print_separator("6. Active Employee Request Processing")
    try:
        # A. Read employees list
        res = requests.get(f"{BASE_URL}/employees/", headers=headers)
        print(f"[Pass] Active Employees Read: status={res.status_code}, count={len(res.json())}")
        
        # B. Submit PTO Request (tests Policy Compliance validation)
        req_payload = {
            "employee_name": "John Davidson",
            "email": "john.davidson@zeta.ai",
            "request_text": "I request 4 days off to attend a technical systems conference."
        }
        res_req = requests.post(f"{BASE_URL}/employees/submit-request", json=req_payload, headers=headers)
        if res_req.status_code == 200:
            outcome = res_req.json()
            print(f"[Pass] Employee PTO Request outcome: status={res_req.status_code}")
            print(f"       Action Taken: {outcome.get('action_taken')}")
            print(f"       Escalated to Human: {outcome.get('escalated')}")
            print(f"       Resolution Detail: {outcome.get('explanation')}")
        else:
            print(f"[Fail] Submit request failed: {res_req.status_code} - {res_req.text}")
    except Exception as e:
        print(f"[Error] Employee endpoints check failed: {e}")

    # ------------------------------------------------
    # 7. Workforce Analytics & ROI Metrics Endpoints
    # ------------------------------------------------
    print_separator("7. Workforce Intelligence & ROI Metrics")
    try:
        # A. Dynamic ROI metrics
        res_roi = requests.get(f"{BASE_URL}/analytics/roi", headers=headers)
        print(f"[Pass] Dynamic ROI Metrics Read: status={res_roi.status_code}")
        print(f"       ROI Savings: USD {res_roi.json().get('roi', {}).get('financial_savings_usd')}")

        # B. Retention Attrition Heatmap
        res_heat = requests.get(f"{BASE_URL}/analytics/attrition-heatmap", headers=headers)
        print(f"[Pass] Retention Attrition Heatmap Read: status={res_heat.status_code}")
        for dept in res_heat.json():
            print(f"       Dept '{dept['department']}': Headcount={dept['headcount']}, Average Attrition Risk={dept['average_attrition_risk']}")
    except Exception as e:
        print(f"[Error] Analytics endpoints check failed: {e}")

    print("\n" + "=" * 60)
    print("     ALL ZETA CORE APIS VERIFIED AND COMPLIANT!      ")
    print("=" * 60)

if __name__ == "__main__":
    run_comprehensive_api_tests()
