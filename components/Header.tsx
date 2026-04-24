"use client";

import { useEffect, useState } from "react";
import PWASettings from "./PWASettings";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between gap-4 px-5 py-4 text-white shadow-lg bg-gradient-to-r from-emerald-500 via-orange-500 to-red-500">
      <div className="flex flex-none items-center text-sm opacity-90">
        <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right backdrop-blur-sm">
          <div>{formattedDate}</div>
          <div className="mt-1 font-semibold text-white">{formattedTime}</div>
        </div>
      </div>

      <div className="flex-1 min-w-0 flex justify-center">
        <div className="min-w-0 text-center">
          <div className="text-xl font-extrabold tracking-tight">
            רדיו רקע אמהרית
          </div>
          <div className="text-sm opacity-90">שידור חי ותוכניות מוקלטות</div>
        </div>
      </div>

      <div className="flex flex-none items-center justify-end">
        <PWASettings />
      </div>
    </header>
  );
}
