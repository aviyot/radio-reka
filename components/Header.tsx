"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePWA } from "../hooks/usePWA";

const PWASettings = dynamic(() => import("./PWASettings"), { ssr: false });
const ShareButton = dynamic(() => import("./ShareButton"), { ssr: false });

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isInstalled } = usePWA();

  // עדכון השעה כל דקה
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // פורמט התאריך והיום
  const formatDate = useCallback(() => {
    const date = currentTime;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }, [currentTime]);

  const getDayName = useCallback(() => {
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return days[currentTime.getDay()];
  }, [currentTime]);

  return (
    <header className="header">
      <span>רדיו רקע אמהרית</span>
      <span className="date-group">
        <span className="day-name">{getDayName()}</span>
        <span className="date">{formatDate()}</span>
      </span>
      <div className="header-buttons">
        <PWASettings />
      </div>
    </header>
  );
}
