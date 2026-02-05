"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

// Data dummy sementara (nanti kita buatkan server action untuk narik data asli)
const data = [
  { name: "Jan", total: 4000000 },
  { name: "Feb", total: 3000000 },
  { name: "Mar", total: 5000000 },
  { name: "Apr", total: 4500000 },
  { name: "May", total: 6000000 },
  { name: "Jun", total: 5500000 },
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
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0A0A0A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px"
              }}
              itemStyle={{ color: "#D4AF37", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#D4AF37"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `Rp${value / 1000000}jt`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Decorative Glow Background */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#D4AF37]/5 blur-[100px] rounded-full opacity-50" />
    </div>
  )
}