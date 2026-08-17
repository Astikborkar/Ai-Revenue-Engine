import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.models import Lead, LeadActivity, OutreachMessage, Deal
from app.schemas.schemas import (
    LeadCreate, LeadResponse, LeadStatusUpdate,
    AnalyzeLeadResponse, OutreachGenerateRequest,
    OutreachMessageResponse, ComplianceCheckResponse, FollowUpRequest
)
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/leads", tags=["Leads"])

@router.post("", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(lead_in: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(
        company_name=lead_in.company_name,
        website=lead_in.website,
        industry=lead_in.industry,
        location=lead_in.location,
        contact_name=lead_in.contact_name,
        email=lead_in.email,
        company_size=lead_in.company_size or "50-200",
        annual_revenue=lead_in.annual_revenue or "$10M-$50M",
        deal_value=lead_in.deal_value or 25000.0,
        lead_score=0,
        lead_status="new",
        qualification_reason="Lead created. Pending AI analysis."
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)

    # Create associated deal record
    deal = Deal(
        lead_id=lead.id,
        title=f"{lead.company_name} - Enterprise Deal",
        value=lead.deal_value,
        stage="new",
        probability=20
    )
    db.add(deal)

    # Activity log
    activity = LeadActivity(
        lead_id=lead.id,
        activity_type="created",
        description=f"Lead added for {lead.company_name} ({lead.contact_name})."
    )
    db.add(activity)
    db.commit()
    db.refresh(lead)
    return lead

@router.get("", response_model=List[LeadResponse])
def get_leads(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Lead)
    if status_filter:
        query = query.filter(Lead.lead_status == status_filter)
    leads = query.order_by(Lead.created_at.desc()).all()
    return leads

@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead

@router.post("/{lead_id}/analyze", response_model=AnalyzeLeadResponse)
def analyze_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    analysis = AIService.analyze_lead(lead)
    lead.lead_score = analysis["score"]
    lead.qualification_reason = analysis["qualification_reason"]
    lead.ai_research_data = json.dumps(analysis["research_data"])
    
    # Auto transition to qualified if high score
    if lead.lead_score >= 70 and lead.lead_status == "new":
        lead.lead_status = "qualified"
        deal = db.query(Deal).filter(Deal.lead_id == lead.id).first()
        if deal:
            deal.stage = "qualified"
            deal.probability = 40

    activity = LeadActivity(
        lead_id=lead.id,
        activity_type="analyzed",
        description=f"AI Research completed. ICP Score: {lead.lead_score}/100. Category: {analysis['research_data'].get('icp_fit_category', 'Qualified')}."
    )
    db.add(activity)
    db.commit()

    return AnalyzeLeadResponse(
        lead_id=lead.id,
        lead_score=lead.lead_score,
        qualification_reason=lead.qualification_reason,
        ai_research_data=analysis["research_data"]
    )

@router.post("/{lead_id}/generate-outreach", response_model=OutreachMessageResponse)
def generate_outreach(lead_id: int, req: OutreachGenerateRequest, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    generated = AIService.generate_outreach(lead, angle=req.angle or "Pain Point & ROI")
    compliance = AIService.check_compliance(generated["subject"], generated["body"])

    msg = OutreachMessage(
        lead_id=lead.id,
        message_type="initial",
        subject=generated["subject"],
        body=generated["body"],
        compliance_score=compliance["compliance_score"],
        compliance_status=compliance["compliance_status"],
        compliance_notes=compliance["compliance_notes"],
        approved=False
    )
    db.add(msg)
    
    activity = LeadActivity(
        lead_id=lead.id,
        activity_type="outreach_generated",
        description=f"AI generated personalized cold email: '{generated['subject']}'."
    )
    db.add(activity)
    db.commit()
    db.refresh(msg)
    return msg

@router.post("/{lead_id}/compliance-check", response_model=ComplianceCheckResponse)
def compliance_check(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    msg = db.query(OutreachMessage).filter(OutreachMessage.lead_id == lead.id).order_by(OutreachMessage.created_at.desc()).first()
    if not msg:
        raise HTTPException(status_code=400, detail="No outreach message found to audit. Generate an outreach message first.")

    check = AIService.check_compliance(msg.subject, msg.body)
    msg.compliance_score = check["compliance_score"]
    msg.compliance_status = check["compliance_status"]
    msg.compliance_notes = check["compliance_notes"]

    activity = LeadActivity(
        lead_id=lead.id,
        activity_type="compliance_passed",
        description=f"Compliance Audit completed. Score: {check['compliance_score']}/100. Status: {check['compliance_status'].upper()}."
    )
    db.add(activity)
    db.commit()

    return ComplianceCheckResponse(
        message_id=msg.id,
        compliance_score=check["compliance_score"],
        compliance_status=check["compliance_status"],
        compliance_notes=check["compliance_notes"],
        can_spam_valid=check["can_spam_valid"],
        spam_trigger_words=check["spam_trigger_words"]
    )

@router.post("/{lead_id}/follow-up", response_model=OutreachMessageResponse)
def generate_followup(lead_id: int, req: FollowUpRequest, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    generated = AIService.generate_followup(lead, step=req.step or 1)
    compliance = AIService.check_compliance(generated["subject"], generated["body"])

    msg = OutreachMessage(
        lead_id=lead.id,
        message_type=f"follow_up_step_{req.step or 1}",
        subject=generated["subject"],
        body=generated["body"],
        compliance_score=compliance["compliance_score"],
        compliance_status=compliance["compliance_status"],
        compliance_notes=compliance["compliance_notes"],
        approved=False
    )
    db.add(msg)
    activity = LeadActivity(
        lead_id=lead.id,
        activity_type="follow_up_generated",
        description=f"Follow-up message (Step {req.step or 1}) generated for {lead.contact_name}."
    )
    db.add(activity)
    db.commit()
    db.refresh(msg)
    return msg

@router.patch("/{lead_id}/status", response_model=LeadResponse)
def update_lead_status(lead_id: int, status_update: LeadStatusUpdate, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    old_status = lead.lead_status
    new_status = status_update.status
    lead.lead_status = new_status

    # Sync Deal stage
    deal = db.query(Deal).filter(Deal.lead_id == lead.id).first()
    if deal:
        deal.stage = new_status
        prob_map = {"new": 20, "qualified": 40, "meeting": 60, "opportunity": 80, "won": 100, "lost": 0}
        deal.probability = prob_map.get(new_status, 20)

    activity = LeadActivity(
        lead_id=lead.id,
        activity_type="status_changed",
        description=f"Pipeline status updated from '{old_status}' to '{new_status}'."
    )
    db.add(activity)
    db.commit()
    db.refresh(lead)
    return lead
