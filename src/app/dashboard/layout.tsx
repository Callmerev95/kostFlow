import { Sidebar } from "@/components/layouts/Sidebar"

/**
 * Layout khusus untuk area dashboard.
 * Memisahkan area navigasi (sidebar) dengan area konten utama.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8">

        {children}
      </main>
    </div>
  )
}