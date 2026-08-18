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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_origin_regex=r"https?://.*",
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
                },
                {
                    "company_name": "HyperScale Data Inc",
                    "website": "https://hyperscaledata.ai",
                    "industry": "Data Infra & AI",
                    "location": "Seattle, WA",
                    "contact_name": "Alex Mercer",
                    "email": "alex.mercer@hyperscaledata.ai",
                    "company_size": "150-300",
                    "annual_revenue": "$15M-$30M",
                    "deal_value": 50000.0,
                    "lead_score": 91,
                    "lead_status": "qualified",
                    "qualification_reason": "Raised $20M Series B funding. Tech stack: Snowflake, Databricks, Salesforce.",
                    "ai_research_data": json.dumps({
                        "score": 91,
                        "buying_intent": "High",
                        "icp_fit_category": "Tier 1 Enterprise Target",
                        "tech_stack": ["Snowflake", "Databricks", "Salesforce"],
                        "key_pain_points": ["SDR team spending 12h/wk on manual research"],
                        "market_signals": ["Series B $20M closed", "Hiring RevOps leads"]
                    })
                },
                {
                    "company_name": "OmniChannel Retail AI",
                    "website": "https://omnichannelretail.io",
                    "industry": "E-Commerce Tech",
                    "location": "New York, NY",
                    "contact_name": "Rachel Zhang",
                    "email": "rachel@omnichannelretail.io",
                    "company_size": "200-400",
                    "annual_revenue": "$20M-$40M",
                    "deal_value": 40000.0,
                    "lead_score": 86,
                    "lead_status": "meeting",
                    "qualification_reason": "Integrated Shopify Plus API. Seeking AI email personalization boost.",
                    "ai_research_data": json.dumps({
                        "score": 86,
                        "buying_intent": "High",
                        "icp_fit_category": "Tier 1 Target",
                        "tech_stack": ["Klaviyo", "Shopify Plus", "AWS"],
                        "key_pain_points": ["Cold outbound open rates under 15%"],
                        "market_signals": ["Shopify enterprise integration live"]
                    })
                },
                {
                    "company_name": "BioPharma Analytics Group",
                    "website": "https://biopharmaanalytics.org",
                    "industry": "Biotech & Life Sciences",
                    "location": "Cambridge, MA",
                    "contact_name": "Dr. Jonathan Cross",
                    "email": "j.cross@biopharmaanalytics.org",
                    "company_size": "350-700",
                    "annual_revenue": "$40M-$80M",
                    "deal_value": 65000.0,
                    "lead_score": 84,
                    "lead_status": "new",
                    "qualification_reason": "Expanding clinical trials. High demand for compliance-audited outreach.",
                    "ai_research_data": json.dumps({
                        "score": 84,
                        "buying_intent": "Medium",
                        "icp_fit_category": "Tier 2 Enterprise",
                        "tech_stack": ["Veeva CRM", "Microsoft Cloud"],
                        "key_pain_points": ["Regulatory audit friction in sales communications"],
                        "market_signals": ["Expanding clinical trial operations"]
                    })
                },
                {
                    "company_name": "FinFlow Global",
                    "website": "https://finflowglobal.com",
                    "industry": "Banking Tech & Payments",
                    "location": "London, UK",
                    "contact_name": "Michael Thorne",
                    "email": "m.thorne@finflowglobal.com",
                    "company_size": "300-600",
                    "annual_revenue": "$30M-$60M",
                    "deal_value": 55000.0,
                    "lead_score": 89,
                    "lead_status": "opportunity",
                    "qualification_reason": "European market expansion announced. Requires GDPR compliance verification.",
                    "ai_research_data": json.dumps({
                        "score": 89,
                        "buying_intent": "High",
                        "icp_fit_category": "Tier 1 Global Target",
                        "tech_stack": ["Salesforce", "Stripe", "Segment"],
                        "key_pain_points": ["Cross-border GDPR compliance verification"],
                        "market_signals": ["Expanding EU operations"]
                    })
                },
                {
                    "company_name": "CyberShield Threat Labs",
                    "website": "https://cybershieldlabs.com",
                    "industry": "InfoSec & SecOps",
                    "location": "Denver, CO",
                    "contact_name": "Jessica Rivera",
                    "email": "j.rivera@cybershieldlabs.com",
                    "company_size": "80-160",
                    "annual_revenue": "$8M-$18M",
                    "deal_value": 38000.0,
                    "lead_score": 93,
                    "lead_status": "qualified",
                    "qualification_reason": "Hired 6 Enterprise AEs. Seeking AI personalization to boost meeting bookings.",
                    "ai_research_data": json.dumps({
                        "score": 93,
                        "buying_intent": "High",
                        "icp_fit_category": "Tier 1 High Value",
                        "tech_stack": ["HubSpot", "Cloudflare", "Kubernetes"],
                        "key_pain_points": ["Low custom personalization"],
                        "market_signals": ["Added 6 AE seats"]
                    })
                },
                {
                    "company_name": "Industrial Automation Dynamics",
                    "website": "https://iadynamics.com",
                    "industry": "Smart Manufacturing",
                    "location": "Detroit, MI",
                    "contact_name": "Thomas Wright",
                    "email": "t.wright@iadynamics.com",
                    "company_size": "120-250",
                    "annual_revenue": "$12M-$28M",
                    "deal_value": 32000.0,
                    "lead_score": 78,
                    "lead_status": "won",
                    "qualification_reason": "IoT plant rollout across North America. Deal successfully closed won.",
                    "ai_research_data": json.dumps({
                        "score": 78,
                        "buying_intent": "High",
                        "icp_fit_category": "Closed Won Account",
                        "tech_stack": ["SAP ERP", "Microsoft Dynamics"],
                        "key_pain_points": ["Fragmented partner communication workflows"],
                        "market_signals": ["Expanding smart factory rollout"]
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
