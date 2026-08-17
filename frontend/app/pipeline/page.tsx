"use client";

import { useEffect, useState } from "react";
import { Kanban, ArrowRight, ArrowLeft, DollarSign, Building2, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { getPipeline, movePipelineStage } from "../../lib/api";
import { PipelineStageGroup, Lead } from "../../types";

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<PipelineStageGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPipeline = async () => {
    try {
      const data = await getPipeline();
      setPipeline(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const handleMoveStage = async (leadId: number, newStage: string) => {
    try {
      await movePipelineStage(leadId, newStage);
      fetchPipeline();
    } catch (err) {
      alert("Failed to move deal stage.");
    }
  };

  const getStageHeaderColor = (stage: string) => {
    const map: Record<string, string> = {
      new: "border-slate-700 text-slate-300",
      qualified: "border-cyan-500/40 text-cyan-400",
      meeting: "border-purple-500/40 text-purple-400",
      opportunity: "border-blue-500/40 text-blue-400",
      won: "border-emerald-500/40 text-emerald-400",
      lost: "border-rose-500/40 text-rose-400"
    };
    return map[stage] || "border-slate-700 text-slate-300";
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Kanban className="w-7 h-7 text-cyan-400" />
            <span>CRM Pipeline Board</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual stage progression, deal valuation, and conversion velocity tracking.
          </p>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
        {pipeline.map((group) => (
          <div
            key={group.stage}
            className="glass-panel p-3.5 space-y-3 border-t-2 bg-slate-900/60"
            style={{
              borderTopColor:
                group.stage === "won"
                  ? "#10b981"
                  : group.stage === "qualified"
                  ? "#06b6d4"
                  : group.stage === "meeting"
                  ? "#8b5cf6"
                  : group.stage === "opportunity"
                  ? "#3b82f6"
                  : group.stage === "lost"
                  ? "#f43f5e"
                  : "#64748b"
            }}
          >
            {/* Stage Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {group.stage_name}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  ${(group.total_value / 1000).toFixed(0)}k total
                </p>
              </div>
              <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
                {group.total_leads}
              </span>
            </div>

            {/* Stage Cards */}
            <div className="space-y-3 min-h-[500px]">
              {group.leads.map((lead) => (
                <div
                  key={lead.id}
                  className="glass-card p-4 space-y-2 border-slate-800 hover:border-slate-700 shadow-md group relative"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {lead.company_name}
                    </h4>
                    {lead.lead_score > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {lead.lead_score}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">
                    {lead.contact_name} ({lead.industry})
                  </p>

                  <div className="flex items-center justify-between pt-1 font-mono text-xs">
                    <span className="text-emerald-400 font-bold">
                      ${lead.deal_value?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">{lead.company_size}</span>
                  </div>

                  {/* Stage Transition Controls */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <select
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                      value={lead.lead_status}
                      onChange={(e) => handleMoveStage(lead.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="qualified">Qualified</option>
                      <option value="meeting">Meeting</option>
                      <option value="opportunity">Opportunity</option>
                      <option value="won">Closed Won</option>
                      <option value="lost">Closed Lost</option>
                    </select>

                    <div className="flex items-center space-x-1">
                      {group.stage !== "won" && (
                        <button
                          onClick={() => {
                            const stages = ["new", "qualified", "meeting", "opportunity", "won"];
                            const idx = stages.indexOf(group.stage);
                            if (idx >= 0 && idx < stages.length - 1) {
                              handleMoveStage(lead.id, stages[idx + 1]);
                            }
                          }}
                          title="Advance stage"
                          className="p-1 hover:bg-slate-800 text-cyan-400 rounded"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {group.leads.length === 0 && (
                <div className="p-4 text-center text-[11px] text-slate-600 border border-dashed border-slate-800/80 rounded-xl">
                  No prospects in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
