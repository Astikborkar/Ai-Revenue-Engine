import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: "cyan" | "emerald" | "purple" | "amber" | "blue";
}

export default function MetricCard({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  color = "cyan"
}: MetricCardProps) {
  const colorMap = {
    cyan: "from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-400",
    emerald: "from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    purple: "from-purple-500/10 to-indigo-500/10 border-purple-500/30 text-purple-400",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-500/30 text-amber-400",
    blue: "from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-400"
  };

  return (
    <div className="glass-card p-5 relative overflow-hidden flex flex-col justify-between space-y-3 group hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-slate-900/90 border ${colorMap[color]} shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 pt-1">
        <div className="text-2xl font-extrabold text-white tracking-tight leading-none">
          {value}
        </div>
        {change && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap shrink-0 ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 truncate pt-1">{subtitle}</p>}
    </div>
  );
}
