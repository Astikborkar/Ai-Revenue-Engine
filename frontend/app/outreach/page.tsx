"use client";

import { useEffect, useState } from "react";
import { Send, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Mail, UserCheck } from "lucide-react";
import { getLeads, approveOutreach } from "../../lib/api";
import { Lead } from "../../types";
import OutreachModal from "../../components/OutreachModal";
import FollowUpModal from "../../components/FollowUpModal";

export default function OutreachPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);
  const [isFollowupOpen, setIsFollowupOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Send className="w-7 h-7 text-cyan-400" />
            <span>Outreach & Compliance Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AI personalized email generation, CAN-SPAM anti-spam compliance audits, and human operator approval.
          </p>
        </div>
      </div>

      {/* Grid of Leads with Outreach status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leads.map((lead) => {
          const messages = lead.outreach_messages || [];
          const latestMessage = messages[messages.length - 1];

          return (
            <div key={lead.id} className="glass-panel p-6 space-y-4 flex flex-col justify-between border-slate-800 hover:border-slate-700 transition-all">
              <div>
                {/* Prospect Info Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">{lead.company_name}</h3>
                    <p className="text-xs text-slate-400">
                      Contact: <strong className="text-slate-200">{lead.contact_name}</strong> ({lead.email})
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                    ICP Score: {lead.lead_score}/100
                  </span>
                </div>

                {/* Message preview or prompt */}
                {latestMessage ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        <span className="truncate max-w-xs">{latestMessage.subject}</span>
                      </span>
                      {latestMessage.approved ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Pending Approval
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono line-clamp-3">
                      {latestMessage.body}
                    </div>

                    {/* Compliance status badge */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span className="text-slate-400">Compliance Audit:</span>
                        <span className="font-bold text-emerald-400">{latestMessage.compliance_score}/100</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Status: {latestMessage.compliance_status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500 space-y-2">
                    <p>No outreach message drafted yet.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsFollowupOpen(true);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Follow-Up</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsOutreachOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{latestMessage ? "Review Outreach" : "Draft AI Outreach"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <OutreachModal
        lead={selectedLead}
        isOpen={isOutreachOpen}
        onClose={() => setIsOutreachOpen(false)}
        onLeadUpdated={(updated) => {
          setSelectedLead(updated);
          fetchLeads();
        }}
      />

      <FollowUpModal
        lead={selectedLead}
        isOpen={isFollowupOpen}
        onClose={() => setIsFollowupOpen(false)}
      />
    </div>
  );
}
