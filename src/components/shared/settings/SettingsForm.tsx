"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateSettings } from "@/actions/user"
import { Building2, Smartphone, QrCode, Save } from "lucide-react"

interface SettingsFormProps {
  userId: string
  initialData: {
    name: string
    kostName: string
    bankName: string | null
    accountNumber: string | null
    accountName: string | null
    ewalletName: string | null
    ewalletNumber: string | null
    qrisImage: string | null
  }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    // Sesuai konsep: Gunakan toast.promise untuk feedback standar industri
    const promise = updateSettings(formData)

    toast.promise(promise, {
      loading: "Menyimpan perubahan...",
      success: (res) => {
        if (res?.error) throw new Error(res.error)
        return "Pengaturan berhasil diperbarui!"
      },
      error: (err) => err.message || "Gagal menyimpan pengaturan",
      finally: () => setLoading(false)
    })
  }

  const inputStyles = "bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all py-6"
  const labelStyles = "text-white/40 text-[10px] uppercase tracking-widest font-black ml-1"

  return (
    <form action={handleSubmit} className="space-y-8">
      {/* 🏦 Bagian Bank */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 size={14} className="text-[#D4AF37]" />
          <h3 className="font-bold text-white text-sm tracking-tight">Rekening Utama</h3>
        </div>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankName" className={labelStyles}>Nama Bank</Label>
            <Input id="bankName" name="bankName" placeholder="BCA / Mandiri / BNI" defaultValue={initialData.bankName || ""} className={inputStyles} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className={labelStyles}>Nomor Rekening</Label>
              <Input id="accountNumber" name="accountNumber" placeholder="12345678" defaultValue={initialData.accountNumber || ""} className={inputStyles} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName" className={labelStyles}>Atas Nama (A/N)</Label>
              <Input id="accountName" name="accountName" placeholder="Nama Pemilik" defaultValue={initialData.accountName || ""} className={inputStyles} required />
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Bagian E-Wallet */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone size={14} className="text-[#D4AF37]" />
          <h3 className="font-bold text-white text-sm tracking-tight">E-Wallet</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ewalletName" className={labelStyles}>Provider</Label>
            <Input id="ewalletName" name="ewalletName" defaultValue={initialData.ewalletName || ""} placeholder="DANA / OVO / GoPay" className={inputStyles} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ewalletNumber" className={labelStyles}>Nomor HP</Label>
            <Input id="ewalletNumber" name="ewalletNumber" defaultValue={initialData.ewalletNumber || ""} placeholder="0812..." className={inputStyles} required />
          </div>
        </div>
      </div>

      {/* 🖼️ Bagian QRIS */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <QrCode size={14} className="text-[#D4AF37]" />
          <h3 className="font-bold text-white text-sm tracking-tight">QRIS Payment</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="qrisImage" className={labelStyles}>URL QRIS Image</Label>
          <Input id="qrisImage" name="qrisImage" defaultValue={initialData.qrisImage || ""} placeholder="https://cloud.com/my-qris.jpg" className={inputStyles} />
          <p className="text-[9px] text-white/20 italic pl-1">
            *Pastikan link gambar dapat diakses secara publik.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-7 rounded-[1.5rem] bg-[#D4AF37] hover:bg-[#B8962E] text-black font-black text-base transition-all active:scale-[0.98] shadow-xl shadow-[#D4AF37]/10"
      >
        {loading ? "Menyinkronkan..." : (
          <span className="flex items-center gap-2">
            <Save size={18} /> Simpan Perubahan
          </span>
        )}
      </Button>
    </form>
  )
}