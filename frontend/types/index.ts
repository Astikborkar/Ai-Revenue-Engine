export interface LeadActivity {
  id: number;
  lead_id: number;
  activity_type: string;
  description: string;
  created_at: string;
}

export interface OutreachMessage {
  id: number;
  lead_id: number;
  message_type: string;
  subject: string;
  body: string;
  compliance_score: number;
  compliance_status: 'pending' | 'passed' | 'flagged';
  compliance_notes?: string;
  approved: boolean;
  sent_at?: string;
  created_at: string;
}

export interface ResearchData {
  score?: number;
  qualification_reason?: string;
  tech_stack?: string[];
  key_pain_points?: string[];
  market_signals?: string[];
  buying_intent?: 'High' | 'Medium' | 'Low';
  icp_fit_category?: string;
}

export interface Lead {
  id: number;
  company_name: string;
  website: string;
  industry: string;
  location: string;
  contact_name: string;
  email: string;
  company_size: string;
  annual_revenue: string;
  deal_value: number;
  lead_score: number;
  lead_status: 'new' | 'qualified' | 'meeting' | 'opportunity' | 'won' | 'lost';
  qualification_reason?: string;
  ai_research_data?: string; // stringified JSON
  created_at: string;
  activities?: LeadActivity[];
  outreach_messages?: OutreachMessage[];
}

export interface CreateLeadPayload {
  company_name: string;
  website: string;
  industry: string;
  location: string;
  contact_name: string;
  email: string;
  company_size?: string;
  annual_revenue?: string;
  deal_value?: number;
}

export interface PipelineStageGroup {
  stage: string;
  stage_name: string;
  total_leads: number;
  total_value: number;
  leads: Lead[];
}

export interface DashboardMetrics {
  total_leads: number;
  active_pipeline_value: number;
  average_icp_score: number;
  conversion_rate: number;
  meetings_booked: number;
  response_rate: number;
  recent_activities: LeadActivity[];
  stage_distribution: {
    stage: string;
    label: string;
    count: number;
    value: number;
  }[];
  monthly_revenue_trend: {
    month: string;
    pipeline: number;
    won: number;
  }[];
}

export interface ComplianceReport {
  message_id: number;
  compliance_score: number;
  compliance_status: string;
  compliance_notes: string;
  can_spam_valid: boolean;
  spam_trigger_words: string[];
}
