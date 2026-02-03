"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { uploadPaymentProof } from "@/actions/transactions"

export function UploadProofModal({ transactionId }: { transactionId: string }) {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData(e.currentTarget)
    const result = await uploadPaymentProof(transactionId, formData)

    setIsUploading(false)
    if (result.success) setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 text-blue-600">
          <Upload className="mr-1 h-3 w-3" /> Bukti
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Bukti Bayar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpload} className="space-y-4">
          <input type="file" name="file" accept="image/*" required />
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Mengupload..." : "Simpan Bukti"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}