"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkOutTenant } from "@/actions/tenants"
import { useState } from "react"

interface TenantActionsProps {
  tenantId: string
  roomId: string
  tenantName: string
}

/**
 * Komponen aksi untuk penghuni.
 * Menangani proses Check-out dengan konfirmasi.
 */
export function TenantActions({ tenantId, roomId, tenantName }: TenantActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckOut = async () => {
    if (confirm(`Apakah Anda yakin ingin melakukan Check-out untuk ${tenantName}? Kamar akan otomatis tersedia kembali.`)) {
      setIsLoading(true)
      const result = await checkOutTenant(tenantId, roomId)
      setIsLoading(false)

      if (result?.error) {
        alert(result.error)
      }
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleCheckOut}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut size={14} />
      {isLoading ? "Memproses..." : "Check-out"}
    </Button>
  )
}