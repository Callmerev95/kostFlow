"use client"

import { useState, useRef } from "react"
import { UploadCloud, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { uploadPaymentProof } from "@/actions/transactions"
import { toast } from "sonner"
import Image from "next/image"

export function UploadProofModal({ transactionId }: { transactionId: string }) {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData(e.currentTarget)

    // Gunakan toast.promise sesuai standar kita
    const promise = uploadPaymentProof(transactionId, formData)

    toast.promise(promise, {
      loading: "Sedang mengunggah bukti...",
      success: (res) => {
        if (res.error) throw new Error(res.error)
        setOpen(false)
        return "Bukti pembayaran berhasil dikirim!"
      },
      error: (err) => err.message || "Gagal mengunggah bukti",
      finally: () => setIsUploading(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isUploading && setOpen(val)}>
      <DialogTrigger asChild>
        <Button className="w-full py-7 rounded-[1.5rem] bg-[#D4AF37] hover:bg-[#B8962E] text-black font-black text-base transition-all active:scale-[0.98] shadow-xl shadow-[#D4AF37]/10 flex gap-2">
          <UploadCloud size={20} /> Konfirmasi Pembayaran
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white sm:max-w-md focus:outline-none overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-3xl rounded-full" />

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-black tracking-tighter text-center">
            Upload <span className="text-[#D4AF37]">Bukti Bayar</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-6 pt-4 relative z-10">
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-white/10 rounded-[2rem] p-8 transition-all hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3 text-center"
          >
            {preview ? (
              <div className="relative w-full aspect-3/4 max-w-50 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="text-white" />
                </div>
              </div>
            ) : (
              <>
                <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#D4AF37] transition-all duration-500">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm tracking-tight">Klik untuk pilih gambar</p>
                  <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest font-black">PNG, JPG atau Screenshot</p>
                </div>
              </>
            )}

            <input
              type="file"
              name="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              required
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-white text-black font-black hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl"
              disabled={isUploading || !preview}
            >
              {isUploading ? (
                <span className="flex items-center gap-2 italic">
                  <Loader2 className="animate-spin h-4 w-4" /> Mengirim...
                </span>
              ) : (
                <span className="flex items-center gap-2 uppercase tracking-widest">
                  <CheckCircle2 size={18} /> Kirim Sekarang
                </span>
              )}
            </Button>
            <p className="text-center text-[9px] text-white/20 font-medium italic">
              *Owner akan segera memverifikasi pembayaran Anda setelah bukti diterima.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}