"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Receipt,
  Settings,
  LogOut
} from "lucide-react"
import { signOut } from "@/actions/auth"
import { cn } from "@/lib/utils"
import { KostFlowLogo } from "@/components/logo"
import { toast } from "sonner"

// Definisikan Interface untuk Props agar Type-Safe (No Any!)
interface SidebarProps {
  userName: string
  kostName: string
}

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: DoorOpen, label: "Kamar", href: "/dashboard/rooms" },
  { icon: Users, label: "Penghuni", href: "/dashboard/tenants" },
  { icon: Receipt, label: "Tagihan", href: "/dashboard/transactions" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/settings" },
]

export function Sidebar({ userName, kostName }: SidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Berhasil keluar dari sistem")
    } catch {
      toast.error("Gagal keluar dari sistem")
    }
  }

  return (
    <aside className="w-72 bg-[#0A0A0A] border-r border-white/5 min-h-screen p-6 flex flex-col transition-all duration-300">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-[#D4AF37] p-2 rounded-xl shadow-lg shadow-[#D4AF37]/10">
          <KostFlowLogo className="h-6 w-6 text-black" />
        </div>
        <span className="text-xl font-black tracking-tighter text-white">
          Kost<span className="text-[#D4AF37]">Flow</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "bg-white/5 text-[#D4AF37] shadow-inner"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-[#D4AF37]" : "group-hover:text-[#D4AF37]"
                )} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer Area: Dynamic User Profile & Logout */}
      <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
        <div className="px-4 py-4 rounded-2xl bg-white/5 border border-white/5 group transition-all duration-300 hover:border-[#D4AF37]/30">
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1 truncate">
              {kostName}
            </p>
            <p className="text-sm font-bold text-white truncate">
              {userName}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all duration-200 font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Keluar Sistem</span>
        </button>
      </div>
    </aside>
  )
}