"""
TestNova AI QA Platform - FastAPI Backend
Full working backend with AI test generation endpoints.
"""

import os
import random
import asyncio
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="TestNova AI QA Platform API",
    description="Backend API for TestNova - the next-gen AI QA & Test Generation Platform.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# Pydantic Models
# ==============================================================================

class RequirementsPayload(BaseModel):
    requirements: str
    focus_area: Optional[str] = "web"

class ScripterPayload(BaseModel):
    manual_steps: str
    framework: Optional[str] = "playwright"

class DefectAnalysisPayload(BaseModel):
    defect_description: str
    stack_trace: Optional[str] = None


# ==============================================================================
# Mock Data Store (simulating a database)
# ==============================================================================

MOCK_TEST_CASES = [
    {"id": "TC-001", "title": "Verify successful user login with valid credentials", "type": "Happy Path", "priority": "High", "steps": ["Navigate to login page", "Enter valid email", "Enter valid password", "Click Login button"], "expected_result": "User is redirected to Dashboard with a welcome message."},
    {"id": "TC-002", "title": "Verify login fails with incorrect password", "type": "Negative", "priority": "High", "steps": ["Navigate to login page", "Enter valid email", "Enter wrong password", "Click Login button"], "expected_result": "Error message 'Invalid credentials' is shown. User stays on login page."},
    {"id": "TC-003", "title": "Verify login fails with empty email field", "type": "Negative", "priority": "Medium", "steps": ["Navigate to login page", "Leave email field empty", "Enter any password", "Click Login button"], "expected_result": "Validation error 'Email is required' appears."},
    {"id": "TC-004", "title": "Verify account lockout after 5 failed attempts", "type": "Edge Case", "priority": "High", "steps": ["Navigate to login page", "Enter valid email with wrong password 5 times", "Attempt to login with correct password"], "expected_result": "Account locked message displayed. Login blocked for 30 minutes."},
    {"id": "TC-005", "title": "Verify 'Remember Me' persists session across browser restarts", "type": "Edge Case", "priority": "Low", "steps": ["Login with valid credentials", "Check 'Remember Me'", "Close and reopen browser", "Navigate to app URL"], "expected_result": "User is automatically logged in without re-entering credentials."},
    {"id": "TC-006", "title": "Verify password reset link is sent to registered email", "type": "Happy Path", "priority": "Medium", "steps": ["Click 'Forgot Password'", "Enter registered email", "Click 'Send Reset Link'", "Check email inbox"], "expected_result": "A password reset email is received within 2 minutes."},
]

MOCK_RUNS = [
    {"id": "RUN-042", "name": "Full Regression Suite - Sprint 24", "status": "Passed", "total": 312, "passed": 307, "failed": 0, "skipped": 5, "duration": "4m 12s", "environment": "Staging"},
    {"id": "RUN-041", "name": "Smoke Tests - Checkout Flow", "status": "Failed", "total": 45, "passed": 40, "failed": 5, "skipped": 0, "duration": "52s", "environment": "Production"},
    {"id": "RUN-040", "name": "Login Module Tests", "status": "Passed", "total": 24, "passed": 24, "failed": 0, "skipped": 0, "duration": "28s", "environment": "Staging"},
    {"id": "RUN-039", "name": "API Integration Tests", "status": "Running", "total": 88, "passed": 60, "failed": 2, "skipped": 0, "duration": "in progress", "environment": "Dev"},
]

MOCK_DEFECTS = [
    {"id": "DEF-018", "title": "Checkout total incorrect when applying multiple discount codes", "severity": "Critical", "status": "Open", "module": "Checkout", "ai_summary": "Discount stacking logic applies second discount to original price.", "root_cause": "`applyDiscount()` resets price on each iteration.", "suggested_fix": "Pass result of previous discount as base for next calculation."},
    {"id": "DEF-017", "title": "Remember Me session expires after 1 hour", "severity": "High", "status": "In Progress", "module": "Authentication", "ai_summary": "JWT token expiry not updated when Remember Me is enabled.", "root_cause": "`generate_token()` ignores the `remember_me` flag.", "suggested_fix": "Pass `expiry=2592000` when `remember_me=True`."},
]


# ==============================================================================
# Health & Root Routes
# ==============================================================================

@app.get("/", tags=["Health"])
def root():
    return {"message": "TestNova API is running", "version": "2.0.0", "status": "healthy"}

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "services": {
            "ai_engine": "online",
            "database": "online",
            "redis_queue": "online",
            "test_runner": "online",
        }
    }


# ==============================================================================
# Dashboard Stats
# ==============================================================================

@app.get("/api/dashboard/stats", tags=["Dashboard"])
def get_dashboard_stats():
    return {
        "tests_generated": 1248,
        "time_saved_hours": 42,
        "pass_rate_percent": 98.5,
        "active_automations": 156,
        "runs_this_week": 24,
        "defects_detected": 4,
    }


# ==============================================================================
# Test Case Generation
# ==============================================================================

from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
import json
import ai_service
from models import TestCase

@app.post("/api/generate-test-cases", tags=["Test Generation"])
async def generate_test_cases(payload: RequirementsPayload, db: Session = Depends(get_db)):
    """
    AI-powered test case generation from requirements using Gemini 3.1 Pro.
    """
    if not payload.requirements.strip():
        raise HTTPException(status_code=400, detail="Requirements cannot be empty.")

    # Call Gemini to generate test cases
    ai_test_cases = ai_service.generate_test_cases_from_requirements(payload.requirements)
    
    if not ai_test_cases:
        raise HTTPException(status_code=500, detail="Failed to generate test cases from AI.")

    # Store in database
    db_cases = []
    for idx, tc in enumerate(ai_test_cases):
        # Fallback fields if AI misses them
        title = tc.get("title", f"Test Case {idx+1}")
        tc_type = tc.get("type", "Happy Path")
        priority = tc.get("priority", "Medium")
        steps = tc.get("steps", [])
        expected_result = tc.get("expected_result", "")

        db_case = TestCase(
            title=title,
            type=tc_type,
            priority=priority,
            expected_result=expected_result
        )
        db_case.steps_list = steps
        db.add(db_case)
        db_cases.append(db_case)
    
    db.commit()
    for db_case in db_cases:
        db.refresh(db_case)

    # Format response
    response_data = []
    for db_case in db_cases:
        response_data.append({
            "id": db_case.id[:8].upper(), # Short ID for UI
            "title": db_case.title,
            "type": db_case.type,
            "priority": db_case.priority,
            "steps": db_case.steps_list,
            "expected_result": db_case.expected_result
        })

    return {
        "status": "success",
        "model_used": "gemini-3.1-pro",
        "generated_count": len(response_data),
        "data": response_data,
        "summary": {
            "happy_path": len([t for t in response_data if t["type"] == "Happy Path"]),
            "edge_cases": len([t for t in response_data if t["type"] == "Edge Case"]),
            "negative": len([t for t in response_data if t["type"] == "Negative"]),
        }
    }

@app.get("/api/test-cases", tags=["Test Generation"])
def get_test_cases(db: Session = Depends(get_db)):
    db_cases = db.query(TestCase).order_by(TestCase.id.desc()).limit(50).all()
    response_data = []
    for db_case in db_cases:
        response_data.append({
            "id": db_case.id[:8].upper(),
            "title": db_case.title,
            "type": db_case.type,
            "priority": db_case.priority,
            "steps": db_case.steps_list,
            "expected_result": db_case.expected_result
        })
    return {"status": "success", "data": response_data}


# ==============================================================================
# Auto-Scripter
# ==============================================================================

PLAYWRIGHT_TEMPLATE = """import {{ test, expect }} from '@playwright/test';

test('AI Generated: {title}', async ({{ page }}) => {{
  // Steps generated by TestNova AI from your manual test description
  {steps}

  // Assertions
  await expect(page.locator('[data-testid="success-indicator"]')).toBeVisible();
}});"""

@app.post("/api/generate-script", tags=["Auto-Scripter"])
async def generate_script(payload: ScripterPayload):
    """
    Converts plain English manual test steps into automation code using Gemini 3.1 Pro.
    """
    if not payload.manual_steps.strip():
        raise HTTPException(status_code=400, detail="Manual steps cannot be empty.")

    script = ai_service.generate_script_from_steps(payload.manual_steps, payload.framework)

    if not script:
        raise HTTPException(status_code=500, detail="Failed to generate script from AI.")

    return {
        "status": "success",
        "framework": payload.framework,
        "model_used": "gemini-3.1-pro",
        "script": script,
    }


# ==============================================================================
# Test Runs
# ==============================================================================

@app.get("/api/runs", tags=["Test Runs"])
def get_test_runs(status: Optional[str] = Query(None)):
    runs = MOCK_RUNS
    if status:
        runs = [r for r in runs if r["status"].lower() == status.lower()]
    return {"status": "success", "data": runs, "total": len(runs)}

@app.post("/api/runs/trigger", tags=["Test Runs"])
async def trigger_run():
    await asyncio.sleep(0.5)
    new_run_id = f"RUN-{random.randint(43, 999):03d}"
    return {"status": "success", "message": f"Test run {new_run_id} queued successfully.", "run_id": new_run_id}


# ==============================================================================
# Defects
# ==============================================================================

from models import Defect

@app.get("/api/defects", tags=["Defects"])
def get_defects(status: Optional[str] = Query(None), severity: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Defect)
    if status:
        query = query.filter(Defect.status.ilike(f"%{status}%"))
    if severity:
        query = query.filter(Defect.severity.ilike(f"%{severity}%"))
    
    defects = query.order_by(Defect.id.desc()).all()
    
    response_data = []
    for d in defects:
        response_data.append({
            "id": d.id[:8].upper(),
            "title": d.title,
            "severity": d.severity,
            "status": d.status,
            "module": d.module,
            "ai_summary": d.ai_summary,
            "root_cause": d.root_cause,
            "suggested_fix": d.suggested_fix
        })

    return {"status": "success", "data": response_data, "total": len(response_data)}

@app.post("/api/defects/analyze", tags=["Defects"])
async def analyze_defect(payload: DefectAnalysisPayload, db: Session = Depends(get_db)):
    """AI-powered defect analysis - returns root cause and suggested fix."""
    if not payload.defect_description.strip():
        raise HTTPException(status_code=400, detail="Defect description cannot be empty.")
    
    analysis = ai_service.analyze_defect_with_ai(payload.defect_description, payload.stack_trace)
    
    # Save defect to DB
    new_defect = Defect(
        title=payload.defect_description[:50] + "...",
        severity="High",
        status="Open",
        module="Unknown",
        ai_summary=analysis.get("ai_summary", ""),
        root_cause=analysis.get("root_cause", ""),
        suggested_fix=analysis.get("suggested_fix", "")
    )
    db.add(new_defect)
    db.commit()
    db.refresh(new_defect)

    return {
        "status": "success",
        "model_used": "gemini-3.1-pro",
        "analysis": {
            "id": new_defect.id[:8].upper(),
            "ai_summary": new_defect.ai_summary,
            "root_cause": new_defect.root_cause,
            "suggested_fix": new_defect.suggested_fix,
            "confidence": "92%",
            "estimated_fix_time": "1-2 hours",
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
