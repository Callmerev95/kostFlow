import { TrendingUp, Home, Activity, AlertCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  stats: { occupied: number; total: number };
  income: { paid: number; pending: number };
  overdueCount: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  trend?: string;
  progress?: number;
  isWarning?: boolean;
  isCritical?: boolean;
}

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function StatsGrid({ stats, income, overdueCount }: StatsGridProps) {
  const occupancyRate = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Pendapatan Lunas"
        value={formatIDR(income.paid)}
        icon={<TrendingUp className="w-5 h-5 text-[#D4AF37]" />}
        description="Dana terkumpul bulan ini"
        trend="+12.5%"
      />
      <StatCard
        title="Okupansi Kamar"
        value={`${occupancyRate}%`}
        icon={<Home className="w-5 h-5 text-[#D4AF37]" />}
        description={`${stats.occupied}/${stats.total} Kamar Terisi`}
        progress={occupancyRate}
      />
      <StatCard
        title="Tagihan Pending"
        value={formatIDR(income.pending)}
        icon={<Activity className="w-5 h-5 text-[#D4AF37]" />}
        description="Menunggu pembayaran"
        isWarning={income.pending > 0}
      />
      <StatCard
        title="Jatuh Tempo"
        value={`${overdueCount} Orang`}
        icon={<AlertCircle className="w-5 h-5 text-red-500" />}
        description={overdueCount > 0 ? "Butuh tindakan segera" : "Semua tagihan lancar"}
        isCritical={overdueCount > 0}
      />
    </div>
  );
}

function StatCard({ title, value, icon, description, trend, progress, isWarning, isCritical }: StatCardProps) {
  return (
    <div className={cn(
      "relative p-6 rounded-[2rem] border transition-all duration-300 group overflow-hidden bg-white/3 border-white/5 hover:border-[#D4AF37]/30",
      isCritical && "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
    )}>
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4AF37]/5 blur-3xl rounded-full group-hover:bg-[#D4AF37]/10 transition-all" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80">{icon}</div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
            <ArrowUpRight size={12} /> {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-white mt-1 tracking-tight">{value}</h3>
        <p className={cn("text-[11px] mt-2 font-medium", isCritical ? "text-red-400" : isWarning ? "text-[#D4AF37]" : "text-white/30")}>
          {description}
        </p>
        {progress !== undefined && (
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden border border-white/5">
            <div className="bg-[#D4AF37] h-full rounded-full shadow-[0_0_10px_#D4AF37] transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}