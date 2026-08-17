from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.models import Lead, OutreachMessage, LeadActivity, Deal
from app.schemas.schemas import OutreachApproveResponse

router = APIRouter(prefix="/api/outreach", tags=["Outreach"])

@router.post("/{message_id}/approve", response_model=OutreachApproveResponse)
def approve_outreach(message_id: int, db: Session = Depends(get_db)):
    msg = db.query(OutreachMessage).filter(OutreachMessage.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Outreach message not found")

    msg.approved = True
    msg.sent_at = datetime.utcnow()

    lead = db.query(Lead).filter(Lead.id == msg.lead_id).first()
    if lead:
        if lead.lead_status == "new":
            lead.lead_status = "qualified"
            deal = db.query(Deal).filter(Deal.lead_id == lead.id).first()
            if deal:
                deal.stage = "qualified"
                deal.probability = 40

        activity = LeadActivity(
            lead_id=lead.id,
            activity_type="approved",
            description=f"Outreach message '{msg.subject}' approved by Human Operator and dispatched."
        )
        db.add(activity)

    db.commit()

    return OutreachApproveResponse(
        message_id=msg.id,
        approved=True,
        lead_status=lead.lead_status if lead else "qualified",
        message="Outreach approved and scheduled for execution."
    )
