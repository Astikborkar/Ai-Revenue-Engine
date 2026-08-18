"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  CalendarCheck,
  Zap,
  Plus,
  ArrowRight,
  Sparkles,
  Activity
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import MetricCard from "../components/MetricCard";
import CreateLeadModal from "../components/CreateLeadModal";
import { getDashboardMetrics } from "../lib/api";
import { DashboardMetrics, Lead } from "../types";
import Link from "next/link";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchMetrics = async () => {
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              AI Infrastructure MVP
            </span>
            <span className="text-xs text-slate-400 font-mono">Nathaniel Portfolio Demo</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            AI Revenue Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated prospecting, ICP lead scoring, compliance-checked outreach, and pipeline velocity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prospect Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard
          title="Active Pipeline"
          value={metrics ? `$${(metrics.active_pipeline_value / 1000).toFixed(0)}k` : "$0k"}
          subtitle="Qualified & Opportunity value"
          change="+18.4%"
          color="emerald"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Prospects"
          value={metrics?.total_leads ?? 0}
          subtitle="Sourced B2B leads"
          change="+12"
          color="cyan"
          icon={Users}
        />
        <MetricCard
          title="Avg ICP Score"
          value={metrics ? `${metrics.average_icp_score}/100` : "84.5"}
          subtitle="AI firmographic fit"
          change="Tier 1 High"
          color="purple"
          icon={Target}
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics ? `${metrics.conversion_rate}%` : "0%"}
          subtitle="Lead to Qualified"
          change="+5.2%"
          color="amber"
          icon={TrendingUp}
        />
        <MetricCard
          title="Meetings Booked"
          value={metrics?.meetings_booked ?? 0}
          subtitle="Active pipeline meetings"
          change="+4 this week"
          color="blue"
          icon={CalendarCheck}
        />
        <MetricCard
          title="Response Rate"
          value={metrics ? `${metrics.response_rate}%` : "34.2%"}
          subtitle="Cold outreach response"
          change="3.4x industry avg"
          color="emerald"
          icon={Zap}
        />
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="glass-panel p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pipeline Value & Revenue Velocity Trend
              </h3>
              <p className="text-xs text-slate-400">Monthly breakdown of pipeline vs closed won revenue</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 text-cyan-400 border border-slate-700">
              Q1-Q2 2026
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics?.monthly_revenue_trend || []}>
                <defs>
                  <linearGradient id="colorPipeline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Amount"]}
                />
                <Area type="monotone" dataKey="pipeline" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPipeline)" name="Active Pipeline" />
                <Area type="monotone" dataKey="won" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" name="Closed Won Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Stage Distribution Bar Chart */}
        <div className="glass-panel p-6 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pipeline Stage Breakdown
            </h3>
            <p className="text-xs text-slate-400">Total deal value by stage</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.stage_distribution || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis type="category" dataKey="label" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Value"]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Stream & Quick Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="glass-panel p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time System Activity Feed</span>
            </div>
            <Link href="/leads" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
              <span>View All Leads</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {metrics?.recent_activities?.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {act.activity_type}
                  </span>
                  <span className="text-slate-200 font-medium">{act.description}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Quick Start Card */}
        <div className="glass-card p-6 flex flex-col justify-between border-cyan-500/30 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Nathaniel Demo Walkthrough</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step through the full AI workflow: Add a prospect, run AI firmographic scoring, draft personalized outreach, execute compliance check, and advance to CRM pipeline.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <Link
              href="/leads"
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <span>Start Prospecting Flow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pipeline"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center"
            >
              <span>View CRM Pipeline Board</span>
            </Link>
          </div>
        </div>
      </div>

      <CreateLeadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onLeadCreated={(newLead) => {
          fetchMetrics();
        }}
      />
    </div>
  );
}
