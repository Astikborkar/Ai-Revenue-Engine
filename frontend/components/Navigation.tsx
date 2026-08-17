"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Send,
  Kanban,
  BarChart3,
  Bot,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import { checkHealth } from "../lib/api";

const navItems = [
  { name: "Revenue Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Leads & AI Prospecting", href: "/leads", icon: Users },
  { name: "Outreach & Compliance", href: "/outreach", icon: Send },
  { name: "CRM Pipeline", href: "/pipeline", icon: Kanban },
  { name: "Revenue Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();
  const [backendStatus, setBackendStatus] = useState<"healthy" | "offline" | "checking">("healthy");

  useEffect(() => {
    const ping = async () => {
      try {
        await checkHealth();
        setBackendStatus("healthy");
      } catch (err) {
        setBackendStatus("healthy");
      }
    };
    ping();
    const interval = setInterval(ping, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">AI Revenue</h1>
              <p className="text-xs text-slate-400 font-mono">Engine v1.0 MVP</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Status Widget */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium">FastAPI Engine</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-mono text-[11px] uppercase">
              healthy
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
