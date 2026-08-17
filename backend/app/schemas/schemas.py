from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class LeadBase(BaseModel):
    company_name: str
    website: str
    industry: str
    location: str
    contact_name: str
    email: str
    company_size: Optional[str] = "50-200"
    annual_revenue: Optional[str] = "$10M-$50M"
    deal_value: Optional[float] = 25000.0

class LeadCreate(LeadBase):
    pass

class LeadStatusUpdate(BaseModel):
    status: str

class LeadActivityResponse(BaseModel):
    id: int
    lead_id: int
    activity_type: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class OutreachMessageResponse(BaseModel):
    id: int
    lead_id: int
    message_type: str
    subject: str
    body: str
    compliance_score: int
    compliance_status: str
    compliance_notes: Optional[str]
    approved: bool
    sent_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class LeadResponse(LeadBase):
    id: int
    lead_score: int
    lead_status: str
    qualification_reason: Optional[str]
    ai_research_data: Optional[str]
    created_at: datetime
    activities: List[LeadActivityResponse] = []
    outreach_messages: List[OutreachMessageResponse] = []

    class Config:
        from_attributes = True

class AnalyzeLeadResponse(BaseModel):
    lead_id: int
    lead_score: int
    qualification_reason: str
    ai_research_data: Dict[str, Any]

class OutreachGenerateRequest(BaseModel):
    angle: Optional[str] = "Pain Point & ROI"

class ComplianceCheckResponse(BaseModel):
    message_id: int
    compliance_score: int
    compliance_status: str
    compliance_notes: str
    can_spam_valid: bool
    spam_trigger_words: List[str]

class OutreachApproveResponse(BaseModel):
    message_id: int
    approved: bool
    lead_status: str
    message: str

class FollowUpRequest(BaseModel):
    step: Optional[int] = 1

class PipelineStageGroup(BaseModel):
    stage: str
    stage_name: str
    total_leads: int
    total_value: float
    leads: List[LeadResponse]

class DashboardMetrics(BaseModel):
    total_leads: int
    active_pipeline_value: float
    average_icp_score: float
    conversion_rate: float
    meetings_booked: int
    response_rate: float
    recent_activities: List[LeadActivityResponse]
    stage_distribution: List[Dict[str, Any]]
    monthly_revenue_trend: List[Dict[str, Any]]
