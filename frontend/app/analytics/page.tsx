"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Zap, Target, ArrowRight, ShieldCheck, Mail } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { getAnalytics } from "../../lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<{ funnel: any[]; channel_performance: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            <span>Revenue & Conversion Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive into prospect conversion funnel, email response rates, and revenue channel performance.
          </p>
        </div>
      </div>

      {/* Funnel Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="glass-panel p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              End-to-End Prospect Conversion Funnel
            </h3>
            <p className="text-xs text-slate-400">Conversion percentage through each AI pipeline milestone</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.funnel || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="stage" stroke="#94a3b8" fontSize={11} width={160} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(val: any) => [`${val}% Conversion`, "Rate"]}
                />
                <Bar dataKey="conversion" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Performance Chart */}
        <div className="glass-panel p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Outreach Channel Performance Metrics
            </h3>
            <p className="text-xs text-slate-400">Open rates, reply rates, and meeting booking rates</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.channel_performance || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="channel" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                  formatter={(val: any) => [`${val}%`, "Metric"]}
                />
                <Bar dataKey="open_rate" fill="#3b82f6" name="Open Rate %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reply_rate" fill="#06b6d4" name="Reply Rate %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meeting_rate" fill="#10b981" name="Meeting Rate %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 space-y-2 border-cyan-500/20">
          <div className="text-xs font-bold uppercase text-cyan-400">AI Personalization Lift</div>
          <div className="text-3xl font-extrabold text-white">+3.4x</div>
          <p className="text-xs text-slate-400">
            Outreach messages generated with AI firmographic research achieve 3.4x higher response rates compared to standard templates.
          </p>
        </div>

        <div className="glass-card p-5 space-y-2 border-emerald-500/20">
          <div className="text-xs font-bold uppercase text-emerald-400">Compliance Audit Pass Rate</div>
          <div className="text-3xl font-extrabold text-white">98.2%</div>
          <p className="text-xs text-slate-400">
            Automated CAN-SPAM verification ensures zero domain reputational damage and optimal inbox placement.
          </p>
        </div>

        <div className="glass-card p-5 space-y-2 border-purple-500/20">
          <div className="text-xs font-bold uppercase text-purple-400">Average Sales Cycle Velocity</div>
          <div className="text-3xl font-extrabold text-white">14.2 Days</div>
          <p className="text-xs text-slate-400">
            Average time from initial prospect creation to qualified meeting booking.
          </p>
        </div>
      </div>
    </div>
  );
}
