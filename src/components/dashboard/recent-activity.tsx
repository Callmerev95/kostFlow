import {
  UserPlus,
  ArrowUpRight,
  CreditCard,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";

// Interface untuk aktivitas (Zero Any!)
interface ActivityItem {
  id: string;
  type: 'TENANT' | 'PAYMENT' | 'ROOM';
  title: string;
  description: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "PAYMENT",
    title: "Pembayaran Diterima",
    description: "Revangga - Kamar 102",
    time: "2 jam yang lalu",
  },
  {
    id: "2",
    type: "TENANT",
    title: "Penghuni Baru",
    description: "Budi Santoso telah check-in",
    time: "5 jam yang lalu",
  },
  {
    id: "3",
    type: "PAYMENT",
    title: "Pembayaran Diterima",
    description: "Siti Aminah - Kamar 205",
    time: "Yesterday",
  },
  {
    id: "4",
    type: "ROOM",
    title: "Kamar Tersedia",
    description: "Kamar 301 telah dikosongkan",
    time: "2 days ago",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white/2 border border-white/5 rounded-[2rem] p-6 h-full flex flex-col group hover:border-[#D4AF37]/20 transition-all duration-500 overflow-hidden relative">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-lg font-black tracking-tight text-white">Aktivitas Terbaru</h3>
          <p className="text-white/40 text-xs font-medium">Log sistem 48 jam terakhir</p>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-[#D4AF37]">
          <ArrowUpRight size={20} />
        </button>
      </div>

      <div className="space-y-6 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {activities.map((item) => (
          <div key={item.id} className="flex gap-4 group/item">
            {/* Icon Circle */}
            <div className={cn(
              "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 transition-all duration-300 group-hover/item:border-[#D4AF37]/30",
              item.type === 'PAYMENT' ? "bg-green-500/10 text-green-500" :
                item.type === 'TENANT' ? "bg-[#D4AF37]/10 text-[#D4AF37]" :
                  "bg-blue-500/10 text-blue-500"
            )}>
              {item.type === 'PAYMENT' && <CreditCard size={18} />}
              {item.type === 'TENANT' && <UserPlus size={18} />}
              {item.type === 'ROOM' && <Key size={18} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white/90 truncate group-hover/item:text-[#D4AF37] transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-white/30 truncate mt-0.5 font-medium">
                {item.description}
              </p>
              <p className="text-[10px] text-white/20 mt-1 font-bold uppercase tracking-tighter">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full opacity-50" />
    </div>
  );
}