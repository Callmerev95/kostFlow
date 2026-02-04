import { createClient } from "@/lib/supabase-server" // Sesuaikan path utils lo
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingsForm } from "@/components/shared/SettingsForm"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      name: true,
      kostName: true,
      bankName: true,
      accountNumber: true,
      accountName: true,
    }
  })

  if (!user) return null

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pembayaran</CardTitle>
          <CardDescription>Data ini akan muncul di invoice penyewa.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm initialData={user} userId={authUser.id} />
        </CardContent>
      </Card>
    </div>
  )
}