"use client";

import { useState } from "react";
import {
  X,
  Building2,
  Globe,
  Mail,
  MapPin,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  Clock,
  Send
} from "lucide-react";
import { Lead, ResearchData } from "../types";
import { analyzeLead, generateOutreach, updateLeadStatus } from "../lib/api";

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: (lead: Lead) => void;
  onOpenOutreachModal?: (lead: Lead) => void;
}

export default function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onLeadUpdated,
  onOpenOutreachModal
}: LeadDetailModalProps) {
  const [analyzing, setAnalyzing] = useState(false);

  if (!isOpen || !lead) return null;

  let research: ResearchData | null = null;
  if (lead.ai_research_data) {
    try {
      research = JSON.parse(lead.ai_research_data);
    } catch (e) {
      research = null;
    }
  }

  const handleRunAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await analyzeLead(lead.id);
      onLeadUpdated({
        ...lead,
        lead_score: res.lead_score,
        qualification_reason: res.qualification_reason,
        ai_research_data: JSON.stringify(res.ai_research_data),
        lead_status: res.lead_score >= 70 ? "qualified" : lead.lead_status
      });
    } catch (err) {
      alert("Error analyzing lead.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updated = await updateLeadStatus(lead.id, newStatus);
      onLeadUpdated(updated);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 70) return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    if (score >= 50) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-slate-400 border-slate-700 bg-slate-800";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xl">
              {lead.company_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white">{lead.company_name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {lead.industry}
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <a href={lead.website} target="_blank" rel="noreferrer" className="hover:underline text-cyan-400">
                    {lead.website}
                  </a>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{lead.location}</span>
                </span>
                <span>Size: {lead.company_size}</span>
                <span>Rev: {lead.annual_revenue}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Score Banner */}
          <div className="glass-panel p-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-3 rounded-xl border text-center font-bold ${scoreColor(lead.lead_score)}`}>
                <div className="text-2xl font-black">{lead.lead_score}</div>
                <div className="text-[10px] uppercase tracking-wider font-mono">ICP Score</div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Qualification Insights</h4>
                <p className="mt-1 text-sm text-slate-200 font-medium leading-relaxed">
                  {lead.qualification_reason || "Click 'Analyze with AI' to generate deep ICP research and intent scoring."}
                </p>
              </div>
            </div>

            <button
              onClick={handleRunAIAnalysis}
              disabled={analyzing}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-cyan-500/20 flex items-center space-x-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? "Analyzing Prospect..." : "Analyze with AI"}</span>
            </button>
          </div>

          {/* Detailed Research Data */}
          {research ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Tech Stack & Intent */}
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase text-cyan-400">
                  <Cpu className="w-4 h-4" />
                  <span>Detected Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {research.tech_stack?.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-bold uppercase text-slate-400">Buying Intent: </span>
                  <span className="text-xs font-bold text-emerald-400">{research.buying_intent || "High"}</span>
                </div>
              </div>

              {/* Pain Points */}
              <div className="glass-card p-4 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Key Target Pain Points</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {research.key_pain_points?.map((pp, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{pp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {/* Contact Person Card */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
                {lead.contact_name.slice(0, 1)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{lead.contact_name}</h4>
                <p className="text-xs text-slate-400 flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>{lead.email}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Target Deal Value</span>
              <div className="text-base font-bold text-emerald-400">${lead.deal_value.toLocaleString()}</div>
            </div>
          </div>

          {/* Pipeline Stage Controls */}
          <div className="glass-card p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Stage</h4>
            <div className="flex items-center space-x-2">
              {["new", "qualified", "meeting", "opportunity", "won", "lost"].map((stg) => (
                <button
                  key={stg}
                  onClick={() => handleStatusChange(stg)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    lead.lead_status === stg
                      ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {stg}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Activity History ({lead.activities?.length || 0})</span>
            </h4>
            <div className="space-y-2">
              {lead.activities?.map((act) => (
                <div key={act.id} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs flex items-start justify-between">
                  <div>
                    <span className="font-bold text-cyan-400 uppercase font-mono tracking-wider mr-2">
                      [{act.activity_type}]
                    </span>
                    <span className="text-slate-200">{act.description}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
          >
            Close
          </button>

          {onOpenOutreachModal && (
            <button
              onClick={() => {
                onClose();
                onOpenOutreachModal(lead);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Generate Outreach & Compliance</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
