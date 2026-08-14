import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-3.1-pro")

def generate_test_cases_from_requirements(requirements: str):
    prompt = f"""
    You are an expert QA Engineer. Analyze the following requirements and generate a set of comprehensive test cases.
    Ensure you include a mix of Happy Path, Edge Case, and Negative test cases.

    Requirements:
    {requirements}

    Return the result strictly as a JSON array of objects with the following schema:
    [
        {{
            "title": "Short descriptive title",
            "type": "Happy Path" | "Edge Case" | "Negative",
            "priority": "High" | "Medium" | "Low",
            "steps": ["Step 1", "Step 2", ...],
            "expected_result": "Description of expected outcome"
        }}
    ]

    Ensure the response is valid JSON and contains NO markdown formatting outside the JSON array.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        # Strip potential markdown formatting from response (e.g., ```json ... ```)
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        test_cases = json.loads(text)
        return test_cases
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return []

def generate_script_from_steps(steps: str, framework: str):
    prompt = f"""
    You are an expert SDET. Write a functional automated test script using the {framework} framework based on these manual steps:

    Manual Steps:
    {steps}

    Return ONLY the raw code for the script, with no markdown formatting or explanations.
    """
    try:
        response = model.generate_content(prompt)
        text = response.text
        if text.startswith(f"```{framework}"):
            text = text[len(framework)+3:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()
    except Exception as e:
        print(f"AI Scripting Error: {e}")
        return ""

def analyze_defect_with_ai(description: str, stack_trace: str = None):
    prompt = f"""
    You are an expert QA and Developer. Analyze this defect report and provide a root cause and a suggested fix.

    Defect Description: {description}
    Stack Trace / Logs: {stack_trace or 'None provided'}

    Return ONLY a JSON object with the following schema:
    {{
        "ai_summary": "Brief summary of the issue",
        "root_cause": "Likely root cause",
        "suggested_fix": "How to fix it"
    }}
    """
    try:
        response = model.generate_content(prompt)
        text = response.text
        if text.startswith("```json"): text = text[7:]
        if text.endswith("```"): text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"AI Defect Analysis Error: {e}")
        return {{
            "ai_summary": "Error analyzing defect.",
            "root_cause": "Unknown",
            "suggested_fix": "Unknown"
        }}
