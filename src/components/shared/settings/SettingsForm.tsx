"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateSettings } from "@/actions/user"
import { Building2, Smartphone, QrCode, Save, UploadCloud, Info } from "lucide-react"
import Image from "next/image"

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
  const [preview, setPreview] = useState<string | null>(initialData.qrisImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)

    // Kirim URL lama sebagai fallback jika user tidak ganti file
    if (initialData.qrisImage) {
      formData.append("currentQrisUrl", initialData.qrisImage)
    }

    const promise = updateSettings(formData)

    toast.promise(promise, {
      loading: "Menyinkronkan data...",
      success: (res) => {
        if (res?.error) throw new Error(res.error)
        return "Pengaturan berhasil diperbarui!"
      },
      error: (err) => err.message || "Gagal menyimpan pengaturan",
      finally: () => setLoading(false)
    })
  }

  const inputStyles = "bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl focus:border-[#D4AF37]/50 focus:ring-[#D4AF37]/20 transition-all py-6"
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

      {/* 🖼️ Bagian QRIS (Direct Upload) */}
      <div className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 mb-2">
          <QrCode size={14} className="text-[#D4AF37]" />
          <h3 className="font-bold text-white text-sm tracking-tight">QRIS Payment</h3>
        </div>

        <div className="space-y-4">
          <Label className={labelStyles}>Upload Barcode QRIS</Label>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-white/10 rounded-[2rem] p-8 transition-all hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 text-center"
          >
            {preview ? (
              <div className="relative w-full aspect-square max-w-45 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src={preview} alt="QRIS Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <UploadCloud className="text-white h-8 w-8" />
                </div>
              </div>
            ) : (
              <>
                <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all duration-500">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Pilih Screenshot QRIS</p>
                  <p className="text-white/20 text-[10px] mt-1 uppercase tracking-tighter font-bold">PNG atau JPG up to 2MB</p>
                </div>
              </>
            )}

            <input
              type="file"
              name="qrisFile"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 items-start">
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-400/80 leading-relaxed italic">
              Gunakan fitur <strong>&quot;Simpan QR&quot;</strong> di aplikasi M-Bank/E-Wallet Anda atau foto stiker QRIS fisik Anda secara tegak lurus.
            </p>
          </div>
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