"use client";

import { useState } from "react";
import { usePWA } from "../hooks/usePWA";

type AppInfo = {
  version?: string;
};

export default function PWASettings() {
  const [isOpen, setIsOpen] = useState(false);
  const { isInstalled, getAppInfo } = usePWA();

  const handleGetAppInfo = async () => {
    const info = (await getAppInfo()) as AppInfo;
    console.log("App info:", info);
    alert(`גרסה: ${info?.version || "לא זמין"}`);
  };

  if (!isInstalled) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pwa-settings-toggle"
        title="הגדרות PWA"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="pwa-settings-modal">
          <div className="pwa-settings-content">
            <div className="pwa-settings-header">
              <h3>הגדרות האפליקציה</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="pwa-settings-close"
              >
                ×
              </button>
            </div>

            <div className="pwa-settings-body">
              <div className="pwa-setting-item">
                <label>מידע על האפליקציה</label>
                <div className="pwa-setting-control">
                  <button onClick={handleGetAppInfo} className="pwa-info-btn">
                    הצג מידע
                  </button>
                </div>
              </div>

              <div className="pwa-setting-item">
                <label>מצב התקנה</label>
                <div className="pwa-setting-control">
                  <span className="pwa-status enabled">מותקן</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
