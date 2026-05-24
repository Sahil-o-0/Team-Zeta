import uvicorn
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

if __name__ == "__main__":
    print("Starting ZETA Autonomous Workforce Operating System Backend...")
    print("Swagger UI: http://127.0.0.1:8000/docs")
    print("ReDoc:      http://127.0.0.1:8000/redoc")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
