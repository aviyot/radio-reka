"use client";

import { useEffect, useState, useCallback } from "react";
import ShareButton from "./ShareButton";
import { usePWA } from "../hooks/usePWA";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isInstallable, isInstalled, installApp } = usePWA();

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
        {isInstallable && !isInstalled && (
          <button
            onClick={installApp}
            className="install-button"
            title="התקן אפליקציה"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            התקן
          </button>
        )}
        <ShareButton className="header-share-button" />
      </div>
    </header>
  );
}
