"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Sparkles,
  Search,
  Globe,
  Mail,
  MapPin,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getLeads, analyzeLead } from "../../lib/api";
import { Lead } from "../../types";
import CreateLeadModal from "../../components/CreateLeadModal";
import LeadDetailModal from "../../components/LeadDetailModal";
import OutreachModal from "../../components/OutreachModal";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);

  const fetchLeads = async () => {
    try {
      const data = await getLeads(filter === "all" ? undefined : filter);
      setLeads(data);
    } catch (err) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const handleAnalyzeLead = async (leadId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await analyzeLead(leadId);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? {
                ...l,
                lead_score: res.lead_score,
                qualification_reason: res.qualification_reason,
                ai_research_data: JSON.stringify(res.ai_research_data),
                lead_status: res.lead_score >= 70 ? "qualified" : l.lead_status
              }
            : l
        )
      );
    } catch (err) {
      alert("Failed to analyze lead.");
    }
  };

  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.company_name.toLowerCase().includes(q) ||
      l.contact_name.toLowerCase().includes(q) ||
      l.industry.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
    );
  });

  const getScoreBadge = (score: number) => {
    if (score >= 85)
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (score >= 70)
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    if (score >= 50)
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-slate-800 text-slate-400 border-slate-700";
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      new: "bg-slate-800 text-slate-300 border-slate-700",
      qualified: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      meeting: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      opportunity: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      lost: "bg-rose-500/10 text-rose-400 border-rose-500/30"
    };
    return map[status] || map["new"];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Users className="w-7 h-7 text-cyan-400" />
            <span>Leads & AI Prospecting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage target accounts, trigger AI firmographic research, and compute ICP scores.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add B2B Lead</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5">
          {["all", "new", "qualified", "meeting", "opportunity", "won", "lost"].map((stg) => (
            <button
              key={stg}
              onClick={() => setFilter(stg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                filter === stg
                  ? "bg-cyan-500 text-slate-950 font-black"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {stg}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search company, contact, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-panel overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Company & Contact</th>
                <th className="px-4 py-3.5">Industry & Size</th>
                <th className="px-4 py-3.5">ICP Score</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Deal Value</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsDetailOpen(true);
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  {/* Company & Contact */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400">
                        {lead.company_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{lead.company_name}</div>
                        <div className="text-slate-400 text-[11px] flex items-center space-x-2 mt-0.5">
                          <span>{lead.contact_name}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-mono">{lead.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className="px-4 py-4">
                    <div className="text-slate-200 font-semibold">{lead.industry}</div>
                    <div className="text-slate-500 text-[11px] font-mono">{lead.company_size} emp | {lead.annual_revenue}</div>
                  </td>

                  {/* ICP Score */}
                  <td className="px-4 py-4">
                    {lead.lead_score > 0 ? (
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border font-mono ${getScoreBadge(lead.lead_score)}`}>
                        {lead.lead_score}/100
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-mono">Not analyzed</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase border ${getStatusBadge(lead.lead_status)}`}>
                      {lead.lead_status}
                    </span>
                  </td>

                  {/* Deal Value */}
                  <td className="px-4 py-4 font-mono text-emerald-400 font-bold">
                    ${lead.deal_value?.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={(e) => handleAnalyzeLead(lead.id, e)}
                      className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                        setIsOutreachOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Outreach</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No prospect leads match your filter. Click "Add B2B Lead" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateLeadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onLeadCreated={(newLead) => {
          fetchLeads();
        }}
      />

      <LeadDetailModal
        lead={selectedLead}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onLeadUpdated={(updated) => {
          setSelectedLead(updated);
          fetchLeads();
        }}
        onOpenOutreachModal={(lead) => {
          setSelectedLead(lead);
          setIsOutreachOpen(true);
        }}
      />

      <OutreachModal
        lead={selectedLead}
        isOpen={isOutreachOpen}
        onClose={() => setIsOutreachOpen(false)}
        onLeadUpdated={(updated) => {
          setSelectedLead(updated);
          fetchLeads();
        }}
      />
    </div>
  );
}
