<div align="center">

  <h1>🌌 TestNova</h1>
  
  <p>
    <b>The Next-Generation AI-Powered Quality Assurance Platform</b>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini" />
  </p>

</div>

---

## ⚡ Overview

**TestNova** is an enterprise-grade, AI-driven Quality Assurance platform designed to revolutionize how engineering teams test software. By deeply integrating Google's Gemini LLM, TestNova automates everything from requirement analysis and test case generation to execution tracking and intelligent defect root-cause analysis.

With a stunning, glassmorphism-inspired UI featuring seamless **Light and Dark Modes**, it's built to impress both QA Engineers and Management.

---

## 🚀 Core Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| 📊 **Executive Dashboard** | Real-time statistics, test velocity tracking, and high-level health overviews. | ✅ |
| 🧠 **AI Test Generation** | Instantly generate comprehensive test cases by pasting User Stories or Jira tickets. | ✅ |
| 💻 **Auto-Scripter** | Convert natural language into ready-to-run automation scripts (Playwright/Cypress). | ✅ |
| 🎯 **Execution Runs** | Track test executions with real-time progress bars, environments, and durations. | ✅ |
| 🐛 **AI Defect Analysis** | Automated root-cause analysis and code-level suggested fixes for failed tests. | ✅ |
| 🌗 **Dynamic Theming** | Fully responsive Light & Dark modes built with deep CSS variables. | ✅ |

---

## 🏗️ Architecture & Tech Stack

TestNova operates on a decoupled architecture for maximum scalability and performance.

### **Frontend (Client)**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Custom CSS Glassmorphism Engine + Framer Motion (Animations)
- **Icons:** Lucide React

### **Backend (Server & AI)**
- **Framework:** FastAPI (Python 3.x)
- **ORM:** SQLAlchemy (Async compatible)
- **Database:** SQLite (Zero-config local setup, production-ready via PostgreSQL easily)
- **AI Engine:** Google Gemini AI API (`google-genai`)

---

## 🛠️ Getting Started (Local Development)

Follow these steps to get TestNova running on your local machine instantly.

### 1. Backend Setup

The backend utilizes SQLite for effortless local setup. No Docker required!

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Create your .env file and add your Gemini API Key
cp .env.example .env

# 4. Seed the database with sample realistic data
python seed_db.py

# 5. Start the FastAPI server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
> The API will be available at `http://localhost:8000`. You can view the automatic Swagger docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```
> The application will be available at `http://localhost:3000`.

---

## 🎨 UI Showcase

*(Add your beautiful screenshots here!)*

- **Dashboard:** `<img src="path/to/dashboard.png" width="800">`
- **AI Scripter:** `<img src="path/to/scripter.png" width="800">`
- **Defects:** `<img src="path/to/defects.png" width="800">`

---

<div align="center">
  <p>Built with ❤️ for Modern QA Teams.</p>
</div>
