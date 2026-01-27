"use client";

import { useState } from "react";
import { usePWA } from "../hooks/usePWA";
import packageJson from "../package.json";
import ShareButton from "./ShareButton";

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
    isInstallable,
    installApp,
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
              <div className="pwa-setting-item version-display">
                <label>גרסה נוכחית</label>
                <div className="pwa-setting-control">
                  <span className="version-number">v{packageJson.version}</span>
                </div>
              </div>

              {isInstallable && !isInstalled && (
                <div className="pwa-setting-item">
                  <label>התקנת האפליקציה</label>
                  <div className="pwa-setting-control">
                    <button
                      onClick={installApp}
                      className="pwa-install-btn"
                      title="התקן אפליקציה"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ marginRight: "0.5rem" }}
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      התקן אפליקציה
                    </button>
                  </div>
                </div>
              )}

              <div className="pwa-setting-item">
                <label>שתף אפליקציה</label>
                <div className="pwa-setting-control">
                  <ShareButton className="pwa-share-button" />
                </div>
              </div>

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
