"use client";

import { useState } from "react";
import { usePWA } from "../hooks/usePWA";

type AppInfo = {
  version?: string;
};

export default function PWASettings() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isInstalled,
    getAppInfo,
    checkForUpdates,
    autoUpdateEnabled,
    toggleAutoUpdate,
  } = usePWA();

  console.log("PWASettings rendered, isInstalled:", isInstalled);

  const handleGetAppInfo = async () => {
    const info = (await getAppInfo()) as AppInfo;
    console.log("App info:", info);
    alert(`גרסה: ${info?.version || "לא זמין"}`);
  };

  // Temporarily show always for debugging
  // if (!isInstalled && process.env.NODE_ENV === "production") {
  //   return null;
  // }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pwa-settings-toggle"
        title="הגדרות PWA"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
        }}
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
                <label>בדוק עדכונים</label>
                <div className="pwa-setting-control">
                  <button
                    onClick={checkForUpdates}
                    className="pwa-check-update-btn"
                  >
                    בדוק עכשיו
                  </button>
                </div>
              </div>

              <div className="pwa-setting-item">
                <label>עדכון אוטומטי</label>
                <div className="pwa-setting-control">
                  <label className="pwa-toggle">
                    <input
                      type="checkbox"
                      checked={autoUpdateEnabled}
                      onChange={toggleAutoUpdate}
                    />
                    <span className="pwa-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
