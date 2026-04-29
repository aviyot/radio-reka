"use client";

import { useEffect, useRef, useState } from "react";
import { usePWA } from "../hooks/usePWA";
import packageJson from "../package.json";
import {
  FiMenu,
  FiDownloadCloud,
  FiInfo,
  FiRefreshCw,
  FiToggleLeft,
  FiX,
} from "react-icons/fi";
import ShareButton from "./ShareButton";

type AppInfo = {
  version?: string;
};

export default function PWASettings() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const {
    isInstalled,
    getAppInfo,
    checkForUpdates,
    autoUpdateEnabled,
    toggleAutoUpdate,
    isInstallable,
    installApp,
  } = usePWA();

  const handleGetAppInfo = async () => {
    const info = (await getAppInfo()) as AppInfo;
    alert(`גרסה: ${info?.version || "לא זמין"}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative text-right">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-4 min-w-[18rem] overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 text-slate-900">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">הגדרות האפליקציה</p>
              <p className="text-xs text-slate-500">
                גרסה v{packageJson.version}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="סגור תפריט"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {isInstallable && !isInstalled && (
              <button
                onClick={installApp}
                className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <FiDownloadCloud className="h-4 w-4" />
                  התקן אפליקציה
                </span>
              </button>
            )}

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                פעולות מהירות
              </p>
              <div className="space-y-2">
                <ShareButton className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" />
                <button
                  onClick={handleGetAppInfo}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <FiInfo className="h-4 w-4" />
                  מידע על האפליקציה
                </button>
                <button
                  onClick={checkForUpdates}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <FiRefreshCw className="h-4 w-4" />
                  בדוק עדכונים
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <span className="flex items-center gap-2">
                <FiToggleLeft className="h-4 w-4" />
                עדכון אוטומטי
              </span>
              <input
                type="checkbox"
                checked={autoUpdateEnabled}
                onChange={toggleAutoUpdate}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
