import { getRooms } from "@/actions/rooms";
import { AddRoomForm } from "@/components/shared/rooms/AddRoomForm";
import { RoomActions } from "@/components/shared/rooms/RoomActions";
import { CheckInForm } from "@/components/shared/rooms/CheckInForm";
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
    <div className="flex flex-col h-full min-h-0 space-y-8 animate-in fade-in duration-700 overflow-hidden">
      {/* Page Header - Tetap Statis */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
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

      {/* 🖥️ Desktop View: Scrollable Table Container */}
      <div className="hidden md:flex flex-col bg-white/2 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl flex-1 min-h-0">
        {/* Static Header */}
        <div className="bg-white/5 border-b border-white/5 shrink-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white/40 font-bold py-5 pl-8 uppercase tracking-widest text-[10px] w-[30%]">Unit</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[25%]">Sewa / Bulan</TableHead>
                <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] w-[20%]">Status</TableHead>
                <TableHead className="text-right text-white/40 font-bold pr-8 uppercase tracking-widest text-[10px] w-[25%]">Kontrol</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable Body Desktop (Dibatasi max-h agar hanya tampil ~6 baris) */}
        <div className="overflow-y-auto flex-1 custom-scrollbar max-h-120">
          <Table>
            <TableBody>
              {rooms.map((room) => {
                const isAvailable = room.status === "AVAILABLE";
                return (
                  <TableRow key={room.id} className={cn("border-white/5 transition-all group relative", isAvailable ? "hover:bg-[#D4AF37]/5" : "hover:bg-white/1")}>
                    <TableCell className="py-5 pl-8 relative w-[30%]">
                      {isAvailable && <CheckInForm room={room} />}
                      <div className="flex items-center gap-3 relative z-0 pointer-events-none">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border transition-transform duration-300", isAvailable ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 group-hover:scale-110" : "bg-white/5 text-white/20 border-white/10")}>
                          <Home size={18} />
                        </div>
                        <span className={cn("font-black text-base tracking-tight italic", isAvailable ? "text-white" : "text-white/20")}>{room.roomNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn("font-bold relative z-0 pointer-events-none w-[25%]", isAvailable ? "text-white/80" : "text-white/20")}>
                      Rp {room.price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="relative z-0 pointer-events-none w-[20%]">
                      <Badge className={isAvailable ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "bg-red-500/10 text-red-500 border-red-500/20"}>
                        {isAvailable ? "Tersedia" : "Terisi"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 relative z-20 w-[25%]">
                      <div className="flex justify-end items-center">
                        <RoomActions room={room} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 📱 Mobile View: Area Scroll Terpisah */}
      <div className="md:hidden flex-1 min-h-0 overflow-y-auto pb-32 space-y-4 custom-scrollbar">
        {rooms.map((room) => {
          const isAvailable = room.status === "AVAILABLE";
          return (
            <div key={room.id} className={cn("relative bg-white/2 border rounded-[2rem] p-6 backdrop-blur-sm overflow-hidden transition-all", isAvailable ? "border-white/10" : "border-white/5 opacity-60")}>
              {isAvailable && <CheckInForm room={room} />}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border", isAvailable ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20" : "bg-white/5 text-white/20 border-white/10")}>
                    <Home size={22} />
                  </div>
                  <div>
                    <h3 className={cn("font-black text-lg leading-none mb-1", isAvailable ? "text-white" : "text-white/40")}>Unit {room.roomNumber}</h3>
                    <Badge className={cn("text-[9px] uppercase tracking-tighter px-2 py-0", isAvailable ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}>{isAvailable ? "Tersedia" : "Terisi"}</Badge>
                  </div>
                </div>
                <div className="relative z-20">
                  <RoomActions room={room} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-white/20 uppercase tracking-widest text-[9px] font-bold pl-1">Harga Sewa</p>
                <p className={cn("font-black text-xl tracking-tight", isAvailable ? "text-[#D4AF37]" : "text-white/20")}>Rp {room.price.toLocaleString("id-ID")}<span className="text-[10px] text-white/40 font-medium ml-1 tracking-normal">/ bulan</span></p>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {rooms.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-white/20">
            <Info size={32} className="opacity-20 mb-4" />
            <p className="font-bold tracking-[0.3em] uppercase text-[10px]">Belum ada unit tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}