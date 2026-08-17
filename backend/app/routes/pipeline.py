from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Lead, Deal, LeadActivity
from app.schemas.schemas import PipelineStageGroup, LeadResponse, LeadStatusUpdate

router = APIRouter(prefix="/api/pipeline", tags=["Pipeline"])

STAGE_NAMES = {
    "new": "New Leads",
    "qualified": "AI Qualified",
    "meeting": "Meeting Booked",
    "opportunity": "Opportunity",
    "won": "Closed Won",
    "lost": "Closed Lost"
}

@router.get("", response_model=List[PipelineStageGroup])
def get_pipeline_stages(db: Session = Depends(get_db)):
    stages = ["new", "qualified", "meeting", "opportunity", "won", "lost"]
    all_leads = db.query(Lead).order_by(Lead.created_at.desc()).all()

    result = []
    for stage in stages:
        stage_leads = [lead for lead in all_leads if lead.lead_status == stage]
        total_val = sum(lead.deal_value or 0.0 for lead in stage_leads)
        
        result.append(PipelineStageGroup(
            stage=stage,
            stage_name=STAGE_NAMES.get(stage, stage.title()),
            total_leads=len(stage_leads),
            total_value=total_val,
            leads=[LeadResponse.from_orm(l) for l in stage_leads]
        ))

    return result

@router.patch("/{lead_id}/move", response_model=LeadResponse)
def move_lead_stage(lead_id: int, status_update: LeadStatusUpdate, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    old_stage = lead.lead_status
    new_stage = status_update.status
    lead.lead_status = new_stage

    deal = db.query(Deal).filter(Deal.lead_id == lead.id).first()
    if deal:
        deal.stage = new_stage
        prob_map = {"new": 20, "qualified": 40, "meeting": 60, "opportunity": 80, "won": 100, "lost": 0}
        deal.probability = prob_map.get(new_stage, 20)

    activity = LeadActivity(
        lead_id=lead.id,
        activity_type="status_changed",
        description=f"Moved lead to pipeline stage: '{STAGE_NAMES.get(new_stage, new_stage)}'."
    )
    db.add(activity)
    db.commit()
    db.refresh(lead)

    return lead
