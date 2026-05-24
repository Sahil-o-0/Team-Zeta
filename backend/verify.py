import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def run_verification():
    print("--------------------------------------------------")
    print("[Tests] Running ZETA Backend Verification Tests...")
    print("--------------------------------------------------")

    # Test 1: Root endpoint
    try:
        root_res = requests.get("http://127.0.0.1:8000/")
        print(f"[Success] Root Endpoint Check: {root_res.status_code} - {root_res.json()}")
    except Exception as e:
        print(f"[Error] Root Endpoint Check failed: {e}")
        return

    # Test 2: Auth token exchange
    try:
        auth_payload = {"username": "admin@zeta.ai", "password": "password123"}
        auth_res = requests.post(f"{BASE_URL}/auth/token", data=auth_payload)
        token_data = auth_res.json()
        print(f"[Success] Auth Token Check: {auth_res.status_code}")
        token = token_data.get("access_token")
        if not token:
            print("[Error] Access token not found in response!")
            return
    except Exception as e:
        print(f"[Error] Auth Check failed: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # Test 3: Read seeded Candidates
    cand_res = requests.get(f"{BASE_URL}/candidates/", headers=headers)
    print(f"[Success] Candidates Read: {cand_res.status_code} - {len(cand_res.json())} candidates found.")
    for cand in cand_res.json():
        print(f"  - {cand['name']} (Score: {cand['score']}, Status: {cand['status']})")

    # Test 4: Read seeded Escalations
    esc_res = requests.get(f"{BASE_URL}/escalations/", headers=headers)
    print(f"[Success] Escalations Read: {esc_res.status_code} - {len(esc_res.json())} pending escalations found.")
    for esc in esc_res.json():
        print(f"  - {esc['title']} ({esc['type']} severity, confidence: {esc['confidence_score']})")

    # Test 5: Read ROI analytics
    roi_res = requests.get(f"{BASE_URL}/analytics/roi", headers=headers)
    print(f"[Success] Analytics ROI Check: {roi_res.status_code}")
    print(f"  - Dynamic ROI Metrics: {json.dumps(roi_res.json().get('roi', {}), indent=2)}")

    # Test 6: Attrition Heatmap
    heat_res = requests.get(f"{BASE_URL}/analytics/attrition-heatmap", headers=headers)
    print(f"[Success] Attrition Heatmap Check: {heat_res.status_code}")
    for dept in heat_res.json():
        print(f"  - {dept['department']}: headcount={dept['headcount']}, high_risk={dept['high_risk_count']}, avg_risk={dept['average_attrition_risk']}")

    print("--------------------------------------------------")
    print("[Success] ZETA Backend Verification completed successfully!")
    print("--------------------------------------------------")

if __name__ == "__main__":
    run_verification()
