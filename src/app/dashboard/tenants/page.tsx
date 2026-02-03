import { getTenants } from "@/actions/tenants"
import { createClient } from "@/lib/supabase-server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TenantActions } from "@/components/shared/TenantActions"
import { redirect } from "next/navigation"

/**
 * Halaman utama manajemen penghuni.
 * Menampilkan siapa saja penghuni aktif dan di kamar mana mereka tinggal.
 */
export default async function TenantsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect("/login")

  const tenants = await getTenants(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daftar Penghuni Aktif</h1>
        <p className="text-slate-500">Mengelola data penyewa yang sedang menempati kamar.</p>
      </div>

      <div className="bg-white border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Penghuni</TableHead>
              <TableHead>No. Kamar</TableHead>
              <TableHead>No. WhatsApp</TableHead>
              <TableHead>Mulai Sewa</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>Kamar {tenant.room.roomNumber}</TableCell>
                <TableCell>{tenant.phoneNumber}</TableCell>
                <TableCell>
                  {new Date(tenant.startDate).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <TenantActions
                    tenantId={tenant.id}
                    roomId={tenant.roomId}
                    tenantName={tenant.name}
                  />
                </TableCell>
              </TableRow>
            ))}
            {tenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  Belum ada penghuni aktif.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}