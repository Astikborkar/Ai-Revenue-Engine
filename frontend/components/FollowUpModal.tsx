"use client";

import { useState } from "react";
import { X, RefreshCw, Send, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { Lead, OutreachMessage } from "../types";
import { generateFollowUp } from "../lib/api";

interface FollowUpModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FollowUpModal({ lead, isOpen, onClose }: FollowUpModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [followupMsg, setFollowupMsg] = useState<OutreachMessage | null>(null);

  if (!isOpen || !lead) return null;

  const handleGenerateFollowup = async () => {
    setLoading(true);
    try {
      const msg = await generateFollowUp(lead.id, step);
      setFollowupMsg(msg);
    } catch (err) {
      alert("Failed to generate follow-up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Follow-Up Sequence Generator</h3>
              <p className="text-xs text-slate-400">Prospect: {lead.contact_name} ({lead.company_name})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between glass-card p-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Sequence Step:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setStep(1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  step === 1 ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                Touch 2 (Value Add)
              </button>
              <button
                onClick={() => setStep(2)}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  step === 2 ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                Touch 3 (Breakup Note)
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerateFollowup}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? "Drafting Follow-up..." : `Generate Touch ${step + 1} Email`}</span>
          </button>

          {followupMsg && (
            <div className="glass-card p-4 space-y-2 border-purple-500/30">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 pb-2 border-b border-slate-800">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>Subject: {followupMsg.subject}</span>
              </div>
              <div className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {followupMsg.body}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
