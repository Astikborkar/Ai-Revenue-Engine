import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models.models import Lead, LeadActivity, Deal, OutreachMessage
from app.routes import leads, outreach, pipeline, dashboard

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Revenue Engine API",
    description="AI-powered B2B prospecting, qualification, personalized outreach, compliance audit, CRM pipeline, and KPI analytics.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(leads.router)
app.include_router(outreach.router)
app.include_router(pipeline.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {
        "message": "AI Revenue Engine API is running",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

# Populate initial seed data if DB is brand new
def seed_initial_data():
    db = SessionLocal()
    try:
        if db.query(Lead).count() == 0:
            sample_leads = [
                {
                    "company_name": "Apex Enterprise Cloud",
                    "website": "https://apexcloud.io",
                    "industry": "Cloud SaaS & Infrastructure",
                    "location": "San Francisco, CA",
                    "contact_name": "Marcus Vance",
                    "email": "m.vance@apexcloud.io",
                    "company_size": "250-500",
                    "annual_revenue": "$25M-$50M",
                    "deal_value": 45000.0,
                    "lead_score": 92,
                    "lead_status": "qualified",
                    "qualification_reason": "High enterprise ICP match. Modern tech stack, recent $15M Series B funding, and expanding Sales Engineering team.",
                    "ai_research_data": json.dumps({
                        "score": 92,
                        "buying_intent": "High",
                        "icp_fit_category": "Tier 1 Enterprise Target",
                        "tech_stack": ["Salesforce CRM", "HubSpot", "AWS Cloud", "Segment"],
                        "key_pain_points": ["Manual lead distribution lag", "High SDR churn rate", "Unoptimized cold outreach conversion"],
                        "market_signals": ["Hired VP of Sales", "Expanded engineering department by 40%"]
                    })
                },
                {
                    "company_name": "Veritas Health Tech",
                    "website": "https://veritashealth.com",
                    "industry": "Healthcare & Digital Health",
                    "location": "Boston, MA",
                    "contact_name": "Elena Rostova",
                    "email": "elena@veritashealth.com",
                    "company_size": "500-1000",
                    "annual_revenue": "$50M-$100M",
                    "deal_value": 75000.0,
                    "lead_score": 88,
                    "lead_status": "meeting",
                    "qualification_reason": "Direct decision maker lead. Scaling telemedicine platform requiring automated HIPAA compliant outreach.",
                    "ai_research_data": json.dumps({
                        "score": 88,
                        "buying_intent": "High",
                        "icp_fit_category": "Tier 1 Enterprise Target",
                        "tech_stack": ["Epic Systems", "Azure Cloud", "Marketo"],
                        "key_pain_points": ["Strict compliance barriers", "Slow enterprise deal cycles"],
                        "market_signals": ["Launching hospital partner portal", "Q3 budget allocation for AI tools"]
                    })
                },
                {
                    "company_name": "Nexus Logistics Solutions",
                    "website": "https://nexuslogistics.net",
                    "industry": "Supply Chain & Logistics",
                    "location": "Chicago, IL",
                    "contact_name": "David Sterling",
                    "email": "d.sterling@nexuslogistics.net",
                    "company_size": "100-250",
                    "annual_revenue": "$10M-$25M",
                    "deal_value": 30000.0,
                    "lead_score": 76,
                    "lead_status": "new",
                    "qualification_reason": "Solid mid-market fit. Seeking automation to streamline carrier partner onboarding.",
                    "ai_research_data": json.dumps({
                        "score": 76,
                        "buying_intent": "Medium",
                        "icp_fit_category": "Tier 2 Mid-Market Target",
                        "tech_stack": ["HubSpot", "Google Cloud", "Zendesk"],
                        "key_pain_points": ["Fragmented vendor data", "Manual email response lag"],
                        "market_signals": ["Opened new distribution center in Midwest"]
                    })
                },
                {
                    "company_name": "QuantEdge Cyber Security",
                    "website": "https://quantedge.cyber",
                    "industry": "Cybersecurity & FinTech",
                    "location": "Austin, TX",
                    "contact_name": "Sophia Lin",
                    "email": "sophia.lin@quantedge.cyber",
                    "company_size": "50-100",
                    "annual_revenue": "$5M-$10M",
                    "deal_value": 35000.0,
                    "lead_score": 95,
                    "lead_status": "opportunity",
                    "qualification_reason": "Urgent buying intent. Replacing legacy outreach tooling with AI Revenue Infrastructure.",
                    "ai_research_data": json.dumps({
                        "score": 95,
                        "buying_intent": "High",
                        "icp_fit_category": "Tier 1 High Value",
                        "tech_stack": ["Salesforce", "Outreach.io", "Cloudflare", "Kubernetes"],
                        "key_pain_points": ["Outreach.io seat costs scaling too fast", "Low custom personalization"],
                        "market_signals": ["Achieved SOC2 Type II compliance", "Active RFP for AI sales software"]
                    })
                }
            ]

            for data in sample_leads:
                lead = Lead(**data)
                db.add(lead)
                db.commit()
                db.refresh(lead)

                # Deal
                deal = Deal(
                    lead_id=lead.id,
                    title=f"{lead.company_name} - Enterprise Deal",
                    value=lead.deal_value,
                    stage=lead.lead_status,
                    probability=60 if lead.lead_status == "opportunity" else (40 if lead.lead_status == "qualified" else 20)
                )
                db.add(deal)

                # Initial activity
                activity = LeadActivity(
                    lead_id=lead.id,
                    activity_type="created",
                    description=f"Prospect lead ingested for {lead.company_name} ({lead.contact_name})."
                )
                db.add(activity)

                # Create sample outreach message if qualified or higher
                if lead.lead_score >= 80:
                    outreach = OutreachMessage(
                        lead_id=lead.id,
                        message_type="initial",
                        subject=f"Accelerating {lead.company_name}'s revenue pipeline with AI automation",
                        body=f"Hi {lead.contact_name.split()[0]},\n\nNoticed {lead.company_name}'s recent expansion in {lead.industry}. We built an AI Revenue Engine that automates prospect qualification, firmographic research, and compliance-checked outreach.\n\nWould you be open to a 10-minute briefing this week?\n\nBest,\nRevenue Operations\n\nTo opt out, reply 'unsubscribe'.",
                        compliance_score=100,
                        compliance_status="passed",
                        compliance_notes="100% Compliant: CAN-SPAM verified, clear opt-out included, low spam word risk.",
                        approved=True
                    )
                    db.add(outreach)

            db.commit()
            print("[Backend Seed] Initial B2B prospect leads populated successfully.")
    except Exception as e:
        print(f"[Backend Seed] Error seeding database: {e}")
    finally:
        db.close()

seed_initial_data()
