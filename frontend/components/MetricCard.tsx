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
    cyan: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-400",
    emerald: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
    purple: "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-400",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
    blue: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400"
  };

  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg bg-slate-900 border border-slate-800 ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
