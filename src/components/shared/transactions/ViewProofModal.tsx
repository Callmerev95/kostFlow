"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils" // Fix: Import cn
import Image from "next/image"   // Fix: Pakai Next Image untuk optimasi

interface ViewProofModalProps {
  proofUrl: string
  tenantName: string
  isMobile?: boolean
}

export function ViewProofModal({ proofUrl, tenantName, isMobile }: ViewProofModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={isMobile ? "lg" : "sm"}
          className={cn(
            "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 rounded-xl transition-all",
            isMobile ? "flex-1 h-12.5 text-sm font-bold gap-2" : "h-9 px-3"
          )}
        >
          <ImageIcon className={cn("h-4 w-4", !isMobile && "mr-2")} />
          {isMobile ? "Lihat Bukti" : "Bukti"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0A0A0A] border-white/10 rounded-[2.5rem] text-white p-0 overflow-hidden max-w-[95vw] sm:max-w-lg">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-black tracking-tighter">
            Bukti Transfer: <span className="text-[#D4AF37]">{tenantName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Fix: Tailwind aspect ratio canonical & Next.js Image Component */}
          <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden border border-white/5 bg-white/5">
            <Image
              src={proofUrl}
              alt={`Bukti transfer ${tenantName}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 95vw, 512px"
            />
          </div>

          <div className="mt-4 p-4 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/10">
            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest text-center">
              Pastikan nominal & nama pengirim sesuai
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}