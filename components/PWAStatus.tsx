"use client";

import { usePWA } from "../hooks/usePWA";

export default function PWAStatus() {
  const {
    isInstallable,
    isInstalled,
    isOnline,
    hasUpdate,
    installApp,
    updateApp,
  } = usePWA();

  return (
    <>
      {/* Install Banner */}
      {isInstallable && !isInstalled && (
        <div className="pwa-install-banner">
          <div className="pwa-banner-content">
            <p>התקן את האפליקציה למכשיר שלך</p>
            <div className="pwa-banner-buttons">
              <button onClick={installApp} className="pwa-install-btn">
                התקן עכשיו
              </button>
              <button
                onClick={() => {
                  const banner = document.querySelector(
                    ".pwa-install-banner"
                  ) as HTMLElement;
                  if (banner) banner.style.display = "none";
                }}
                className="pwa-dismiss-btn"
              >
                לא תודה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Banner */}
      {hasUpdate && (
        <div className="pwa-update-banner">
          <div className="pwa-banner-content">
            <p>גרסה חדשה זמינה!</p>
            <button onClick={updateApp} className="pwa-update-btn">
              עדכן עכשיו
            </button>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="pwa-offline-indicator">
          <span>🔌 מצב אופליין - חלק מהתכונות לא זמינות</span>
        </div>
      )}

      {/* Install Button in Header (for installed apps) */}
      {!isInstalled && isInstallable && (
        <button
          onClick={installApp}
          className="pwa-header-install-btn"
          title="התקן אפליקציה"
        >
          📱
        </button>
      )}
    </>
  );
}
