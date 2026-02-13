"use client";

import { useEffect } from "react";
import { flushOfflineMutations } from "@/lib/offlineSync";

export function PwaBootstrap() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
    }

    const flush = async () => {
      await flushOfflineMutations();
    };

    void flush();

    window.addEventListener("online", flush);
    const interval = window.setInterval(flush, 30_000);

    return () => {
      window.removeEventListener("online", flush);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}