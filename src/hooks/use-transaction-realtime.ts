"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export function useTransactionRealtime(transactionId?: string) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-transactions")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Transaction",
          ...(transactionId && { filter: `id=eq.${transactionId}` }),
        },
        (payload) => {
          console.log("Change detected!", payload);
         
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, transactionId]);
}
