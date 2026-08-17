"use client";

import { useState } from "react";
import {
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Mail,
  FileText
} from "lucide-react";
import { Lead, OutreachMessage, ComplianceReport } from "../types";
import { generateOutreach, runComplianceCheck, approveOutreach } from "../lib/api";

interface OutreachModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: (lead: Lead) => void;
}

export default function OutreachModal({ lead, isOpen, onClose, onLeadUpdated }: OutreachModalProps) {
  const [angle, setAngle] = useState("Pain Point & ROI");
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [approving, setApproving] = useState(false);
  const [outreachMessage, setOutreachMessage] = useState<OutreachMessage | null>(null);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);

  if (!isOpen || !lead) return null;

  const handleGenerateMessage = async () => {
    setGenerating(true);
    setComplianceReport(null);
    try {
      const msg = await generateOutreach(lead.id, angle);
      setOutreachMessage(msg);
    } catch (err) {
      alert("Failed to generate outreach message.");
    } finally {
      setGenerating(false);
    }
  };

  const handleRunCompliance = async () => {
    if (!outreachMessage) return;
    setChecking(true);
    try {
      const report = await runComplianceCheck(lead.id);
      setComplianceReport(report);
      setOutreachMessage((prev) =>
        prev
          ? {
              ...prev,
              compliance_score: report.compliance_score,
              compliance_status: report.compliance_status as any,
              compliance_notes: report.compliance_notes
            }
          : null
      );
    } catch (err) {
      alert("Failed to run compliance check.");
    } finally {
      setChecking(false);
    }
  };

  const handleApproveOutreach = async () => {
    if (!outreachMessage) return;
    setApproving(true);
    try {
      const res = await approveOutreach(outreachMessage.id);
      setOutreachMessage((prev) => (prev ? { ...prev, approved: true } : null));
      onLeadUpdated({
        ...lead,
        lead_status: res.lead_status as any
      });
      alert("Outreach Approved & Dispatched! Prospect advanced to 'Qualified' stage.");
    } catch (err) {
      alert("Failed to approve outreach.");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Personalised Outreach & Compliance Audit</h3>
              <p className="text-xs text-slate-400">Targeting: {lead.contact_name} ({lead.company_name})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Controls Bar */}
          <div className="glass-card p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Messaging Angle</label>
              <select
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              >
                <option value="Pain Point & ROI">Pain Point & ROI Focus</option>
                <option value="Executive Briefing">Executive Briefing Angle</option>
                <option value="Competitive Benchmark">Competitive Benchmark Angle</option>
              </select>
            </div>

            <button
              onClick={handleGenerateMessage}
              disabled={generating}
              className="mt-5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center space-x-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? "Generating..." : "Generate AI Email"}</span>
            </button>
          </div>

          {/* Generated Email Content */}
          {outreachMessage ? (
            <div className="space-y-4">
              <div className="glass-card p-4 space-y-3 border-cyan-500/30">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>Subject: {outreachMessage.subject}</span>
                  </div>
                  {outreachMessage.approved && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approved & Sent</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {outreachMessage.body}
                </div>
              </div>

              {/* Compliance Report Card */}
              {complianceReport ? (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  complianceReport.compliance_score >= 80
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                    : "bg-amber-950/30 border-amber-500/30 text-amber-300"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Compliance & Anti-Spam Audit</span>
                    </div>
                    <span className="text-sm font-extrabold font-mono">
                      {complianceReport.compliance_score}/100 Score
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{complianceReport.compliance_notes}</p>

                  <div className="flex items-center space-x-4 text-[11px] font-mono pt-1 border-t border-slate-800">
                    <span>CAN-SPAM Valid: <strong className="text-emerald-400">{complianceReport.can_spam_valid ? "YES" : "NO"}</strong></span>
                    <span>Spam Words: <strong className="text-slate-300">{complianceReport.spam_trigger_words.length} detected</strong></span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button
                    onClick={handleRunCompliance}
                    disabled={checking}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>{checking ? "Auditing..." : "Run Compliance Check"}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Select a messaging angle above and click <strong>Generate AI Email</strong> to draft personalized outreach.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>

          {outreachMessage && !outreachMessage.approved && (
            <button
              onClick={handleApproveOutreach}
              disabled={approving}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{approving ? "Approving..." : "Human Approval & Dispatch"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
