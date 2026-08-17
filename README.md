# AI Revenue Engine MVP

A portfolio-quality B2B sales automation and AI revenue engine built with **Next.js (TypeScript, Tailwind CSS)** on the frontend and **FastAPI (Python, SQLAlchemy, Pydantic, OpenAI)** on the backend.

---

## Architecture Overview

```
AI Revenue Engine
│
├── Dashboard (KPIs, Pipeline Value, Conversion Rates, Revenue Trends)
├── Leads & AI Prospecting (Lead management, AI firmographic research, ICP score 0–100)
├── Outreach & Compliance (AI cold email generation, CAN-SPAM audit, Human operator approval)
├── CRM Pipeline (Kanban board: New -> Qualified -> Meeting -> Opportunity -> Won/Lost)
└── Analytics (Funnel conversion breakdown, Outreach channel response rates)
```

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, Axios
- **Backend**: FastAPI, SQLAlchemy (SQLite/PostgreSQL compatible), Pydantic v2, Uvicorn, OpenAI API Integration (with intelligent heuristic fallback engine)

---

## API Endpoints

- `GET /health` - Service health check
- `POST /api/leads` - Create B2B prospect lead
- `GET /api/leads` - List all leads
- `GET /api/leads/{id}` - Get lead details with activities and outreach
- `POST /api/leads/{id}/analyze` - Execute AI research & compute ICP score (0-100)
- `POST /api/leads/{id}/generate-outreach` - Draft personalized cold email
- `POST /api/leads/{id}/compliance-check` - Audit message for CAN-SPAM compliance & spam trigger words
- `POST /api/leads/{id}/follow-up` - Draft multi-touch follow-up sequence
- `PATCH /api/leads/{id}/status` - Move lead stage
- `POST /api/outreach/{id}/approve` - Approve outreach & advance pipeline stage
- `GET /api/pipeline` - Get Kanban stage groups
- `GET /api/dashboard` - Aggregated revenue & KPI metrics

---

## Quick Start Instructions

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```
Backend will start on `http://127.0.0.1:8000` with Swagger UI at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`.

---

## Target Nathaniel Demo Flow

1. Open `http://localhost:3000` to view the **Revenue Dashboard** & live metrics.
2. Navigate to **Leads & AI Prospecting** (`/leads`) and click **Add B2B Lead** (or fill demo prospect).
3. Click **Analyze with AI** to view firmographic research, tech stack detection, and ICP score.
4. Click **Outreach** to generate a personalized cold email tailored to target pain points.
5. Click **Run Compliance Check** to verify CAN-SPAM compliance and anti-spam audit score.
6. Click **Human Approval & Dispatch** to approve message and advance prospect to **Qualified**.
7. Navigate to **CRM Pipeline** (`/pipeline`) and drag/advance the deal to **Meeting** or **Closed Won**.
8. View **Revenue Analytics** (`/analytics`) to inspect the conversion funnel and channel stats.
