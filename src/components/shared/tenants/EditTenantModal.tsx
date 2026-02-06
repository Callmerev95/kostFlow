"use client"

import { useState } from "react"
import { updateTenant } from "@/actions/tenants"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save, User, Phone, Edit3 } from "lucide-react"

interface EditTenantModalProps {
  tenant: {
    id: string
    name: string
    phoneNumber: string
  }
  customTrigger?: React.ReactNode
}

export function EditTenantModal({ tenant, customTrigger }: EditTenantModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: tenant.name,
    phoneNumber: tenant.phoneNumber,
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Sesuai standar: Always provide general comments in the code
    // Mengirim data update ke Server Action
    const promise = updateTenant(tenant.id, formData)

    toast.promise(promise, {
      loading: "Memperbarui data...",
      success: (res) => {
        if (res?.error) throw new Error(res.error)
        setIsOpen(false)
        return "Data penyewa berhasil diperbarui!"
      },
      error: (err) => err.message || "Terjadi kesalahan",
      finally: () => setIsLoading(false)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white/20 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all border border-transparent hover:border-[#D4AF37]/20"
          >
            <Edit3 size={16} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white overflow-hidden max-w-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full" />

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            Edit <span className="text-[#D4AF37]">Penyewa</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-6 pt-4 relative z-10">
          <div className="space-y-2">

            <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 flex items-center gap-2">
              <User color="#D4AF37" size={12} /> Nama Lengkap
            </Label>

            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-[#D4AF37]/50 focus:ring-0 transition-all font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 flex items-center gap-2">
              <Phone color="#D4AF37" size={12} /> Nomor WhatsApp
            </Label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-[#D4AF37]/50 focus:ring-0 transition-all font-medium"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D4AF37] hover:bg-[#F9E498]/90 text-black font-black rounded-2xl h-12 transition-all mt-4 flex gap-2 shadow-[0_10px_20px_rgba(212,175,55,0.1)] active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={18} />}
            SIMPAN PERUBAHAN
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}