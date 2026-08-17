import axios from 'axios';
import { Lead, CreateLeadPayload, PipelineStageGroup, DashboardMetrics, OutreachMessage, ComplianceReport } from '../types';

const defaultUrl = process.env.NODE_ENV === 'production'
  ? 'https://ai-revenue-backend-tlys.onrender.com'
  : 'http://localhost:8000';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || defaultUrl;
let API_BASE_URL = rawUrl.trim();

if (API_BASE_URL && !API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
  API_BASE_URL = `https://${API_BASE_URL}`;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

export const getLeads = async (statusFilter?: string): Promise<Lead[]> => {
  const res = await api.get('/api/leads', {
    params: statusFilter ? { status_filter: statusFilter } : {}
  });
  return res.data;
};

export const getLead = async (id: number): Promise<Lead> => {
  const res = await api.get(`/api/leads/${id}`);
  return res.data;
};

export const createLead = async (payload: CreateLeadPayload): Promise<Lead> => {
  const res = await api.post('/api/leads', payload);
  return res.data;
};

export const analyzeLead = async (id: number) => {
  const res = await api.post(`/api/leads/${id}/analyze`);
  return res.data;
};

export const generateOutreach = async (id: number, angle: string = 'Pain Point & ROI'): Promise<OutreachMessage> => {
  const res = await api.post(`/api/leads/${id}/generate-outreach`, { angle });
  return res.data;
};

export const runComplianceCheck = async (id: number): Promise<ComplianceReport> => {
  const res = await api.post(`/api/leads/${id}/compliance-check`);
  return res.data;
};

export const generateFollowUp = async (id: number, step: number = 1): Promise<OutreachMessage> => {
  const res = await api.post(`/api/leads/${id}/follow-up`, { step });
  return res.data;
};

export const updateLeadStatus = async (id: number, status: string): Promise<Lead> => {
  const res = await api.patch(`/api/leads/${id}/status`, { status });
  return res.data;
};

export const approveOutreach = async (messageId: number) => {
  const res = await api.post(`/api/outreach/${messageId}/approve`);
  return res.data;
};

export const getPipeline = async (): Promise<PipelineStageGroup[]> => {
  const res = await api.get('/api/pipeline');
  return res.data;
};

export const movePipelineStage = async (id: number, status: string): Promise<Lead> => {
  const res = await api.patch(`/api/pipeline/${id}/move`, { status });
  return res.data;
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const res = await api.get('/api/dashboard');
  return res.data;
};

export const getAnalytics = async () => {
  const res = await api.get('/api/dashboard/analytics');
  return res.data;
};
