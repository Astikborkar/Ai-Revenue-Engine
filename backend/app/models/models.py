from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False, index=True)
    website = Column(String, nullable=False)
    industry = Column(String, nullable=False, index=True)
    location = Column(String, nullable=False)
    contact_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    company_size = Column(String, default="50-200")
    annual_revenue = Column(String, default="$10M-$50M")
    deal_value = Column(Float, default=25000.0)
    
    lead_score = Column(Integer, default=0) # 0 - 100
    lead_status = Column(String, default="new", index=True) # new, qualified, meeting, opportunity, won, lost
    qualification_reason = Column(Text, nullable=True)
    ai_research_data = Column(Text, nullable=True) # Stored JSON string
    
    created_at = Column(DateTime, default=datetime.utcnow)

    activities = relationship("LeadActivity", back_populates="lead", cascade="all, delete-orphan")
    outreach_messages = relationship("OutreachMessage", back_populates="lead", cascade="all, delete-orphan")
    deals = relationship("Deal", back_populates="lead", cascade="all, delete-orphan")

class LeadActivity(Base):
    __tablename__ = "lead_activities"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    activity_type = Column(String, nullable=False) # created, analyzed, outreach_generated, compliance_passed, approved, status_changed
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="activities")

class OutreachMessage(Base):
    __tablename__ = "outreach_messages"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    message_type = Column(String, default="initial") # initial, follow_up
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    compliance_score = Column(Integer, default=100) # 0 - 100
    compliance_status = Column(String, default="pending") # pending, passed, flagged
    compliance_notes = Column(Text, nullable=True)
    approved = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="outreach_messages")

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    title = Column(String, nullable=False)
    value = Column(Float, nullable=False, default=0.0)
    stage = Column(String, nullable=False, default="new") # new, qualified, meeting, opportunity, won, lost
    probability = Column(Integer, default=20) # percentage
    expected_close_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="deals")
