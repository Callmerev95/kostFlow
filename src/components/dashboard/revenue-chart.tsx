"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const data = [
  { name: "Jan", total: 12000000 },
  { name: "Feb", total: 18000000 },
  { name: "Mar", total: 15000000 },
  { name: "Apr", total: 25000000 },
  { name: "May", total: 32000000 },
  { name: "Jun", total: 28000000 },
]

export function RevenueChart() {
  return (
    <div className="w-full h-full min-h-75 p-6 bg-white/2 border border-white/5 rounded-[2rem] group hover:border-[#D4AF37]/20 transition-all duration-500 overflow-hidden relative">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-lg font-black tracking-tight text-white">Analitik Pendapatan</h3>
          <p className="text-white/40 text-xs font-medium">Performa finansial 6 bulan terakhir</p>
        </div>
        <div className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
          <span className="text-[10px] font-bold text-[#D4AF37]">IDR / BULAN</span>
        </div>
      </div>

      <div className="h-62.5 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px"
              }}
              itemStyle={{ color: "#D4AF37", fontWeight: "bold" }}
              // FIX: Handle undefined value agar TS tidak error
              formatter={(value: number | undefined) => {
                if (typeof value === "undefined") return ["Rp0", "Total"];
                return [
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(value),
                  "Total"
                ];
              }}
            />

            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={55}
              domain={[0, 50000000]}
              tickFormatter={(value: number) => {
                if (value === 0) return "Rp0";
                return `Rp${value / 1000000}jt`;
              }}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#D4AF37"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#D4AF37]/5 blur-[100px] rounded-full opacity-50" />
    </div>
  )
}