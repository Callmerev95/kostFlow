import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase-server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { TransactionActions } from "@/components/shared/TransactionActions"

/**
 * Halaman Laporan Keuangan.
 * Menampilkan histori transaksi dan menyediakan aksi konfirmasi pembayaran.
 */
export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect("/login")

  const transactions = await prisma.transaction.findMany({
    where: {
      tenant: { room: { userId: user.id } }
    },
    include: {
      tenant: {
        include: { room: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
        <p className="text-slate-500 text-sm">Pantau tagihan dan konfirmasi pembayaran penghuni.</p>
      </div>

      <div className="bg-white border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bulan/Tahun</TableHead>
              <TableHead>Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.month}/{t.year}</TableCell>
                <TableCell>{t.tenant.name}</TableCell>
                <TableCell>Kamar {t.tenant.room.roomNumber}</TableCell>
                <TableCell>Rp {t.amount.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <Badge
                    variant={t.status === "PAID" ? "default" : "secondary"}
                    className={t.status === "PAID" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                  >
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {/* Di sini variabel 't' sudah tersedia dari .map() */}
                  <TransactionActions id={t.id} status={t.status} />
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                  Belum ada data transaksi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}