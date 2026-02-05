import { getRooms } from "@/actions/rooms";
import { AddRoomForm } from "@/components/shared/AddRoomForm";
import { RoomActions } from "@/components/shared/RoomActions";
import { CheckInForm } from "@/components/shared/CheckInForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Home, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function RoomsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const rooms = await getRooms(user.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Manajemen <span className="text-[#D4AF37]">Kamar</span>
          </h1>
          <p className="text-white/40 text-sm font-medium mt-1 italic">
            Total unit: {rooms.length} kamar terdaftar.
          </p>
        </div>
        <AddRoomForm userId={user.id} />
      </div>

      {/* Modern Glassmorphism Table */}
      <div className="bg-white/2 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <Table>
          <TableHeader className="bg-white/2 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-white/40 font-bold py-5 pl-8 uppercase tracking-widest text-[10px]">Unit</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Sewa / Bulan</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-right text-white/40 font-bold pr-8 uppercase tracking-widest text-[10px]">Kontrol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => {
              const isAvailable = room.status === "AVAILABLE";

              return (
                <TableRow
                  key={room.id}
                  className={cn(
                    "border-white/5 transition-all group relative",
                    isAvailable ? "hover:bg-[#D4AF37]/5" : "hover:bg-white/1"
                  )}
                >
                  {/* Kolom 1: Unit (Kita titipkan sensor klik global di sini) */}
                  <TableCell className="py-5 pl-8 relative">
                    {isAvailable && <CheckInForm room={room} />}

                    <div className="flex items-center gap-3 relative z-0 pointer-events-none">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center border transition-transform duration-300",
                        isAvailable
                          ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 group-hover:scale-110"
                          : "bg-white/5 text-white/20 border-white/10"
                      )}>
                        <Home size={18} />
                      </div>
                      <span className={cn(
                        "font-black text-base tracking-tight italic",
                        isAvailable ? "text-white" : "text-white/20"
                      )}>
                        {room.roomNumber}
                      </span>
                    </div>
                  </TableCell>

                  {/* Kolom 2: Harga */}
                  <TableCell className={cn("font-bold relative z-0 pointer-events-none", isAvailable ? "text-white/80" : "text-white/20")}>
                    Rp {room.price.toLocaleString("id-ID")}
                  </TableCell>

                  {/* Kolom 3: Status */}
                  <TableCell className="relative z-0 pointer-events-none">
                    <Badge
                      className={isAvailable
                        ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {isAvailable ? "Tersedia" : "Terisi"}
                    </Badge>
                  </TableCell>

                  {/* Kolom 4: Aksi (z-20 agar klik Menu tidak memicu Check-in) */}
                  <TableCell className="text-right pr-8 relative z-20">
                    <div className="flex justify-end items-center">
                      <RoomActions room={room} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Empty State */}
        {rooms.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-white/20">
            <div className="p-4 rounded-full bg-white/2 mb-4 border border-white/5">
              <Info size={32} className="opacity-20" />
            </div>
            <p className="font-bold tracking-[0.3em] uppercase text-[10px]">
              Belum ada unit tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}