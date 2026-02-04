"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateSettings } from "@/actions/user"

interface SettingsFormProps {
  userId: string
  initialData: {
    name: string
    kostName: string
    bankName: string | null
    accountNumber: string | null
    accountName: string | null
  }
}

export function SettingsForm({ userId, initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)


  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await updateSettings(userId, formData)
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Pengaturan berhasil disimpan!")
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="bankName">Nama Bank / E-Wallet</Label>
        <Input id="bankName" name="bankName" placeholder="Contoh: BCA, Mandiri, DANA" defaultValue={initialData.bankName || ""} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="accountNumber">Nomor Rekening / HP</Label>
        <Input id="accountNumber" name="accountNumber" placeholder="Contoh: 123456789" defaultValue={initialData.accountNumber || ""} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="accountName">Atas Nama (A/N)</Label>
        <Input id="accountName" name="accountName" placeholder="Contoh: Franky Thy" defaultValue={initialData.accountName || ""} required />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  )
}