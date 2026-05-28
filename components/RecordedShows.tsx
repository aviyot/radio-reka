"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FiCalendar,
  FiClock,
  FiSun,
  FiCoffee,
  FiMoon,
  FiRefreshCw,
} from "react-icons/fi";

interface RecordedShowsProps {
  initialDate?: string;
  initialShow?: string;
}

const showIcons = {
  amharit: <FiSun className="button-icon" />,
  "kan-amhari-noon": <FiCoffee className="button-icon" />,
  "evenign-news-amharit": <FiMoon className="button-icon" />,
};

export default function RecordedShows({
  initialDate,
  initialShow = "amharit",
}: RecordedShowsProps) {
  const [selectedDate, setSelectedDate] = useState("2025-07-28");
  const [selectedShow, setSelectedShow] = useState(initialShow);
  const [dialogDate, setDialogDate] = useState("2025-07-28");
  const [dialogShow, setDialogShow] = useState(initialShow);
  const [isLoading, setIsLoading] = useState(false);
  const [userHasSelectedShow, setUserHasSelectedShow] = useState(false);
  const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);

  const getLatestShowForDate = useCallback((dateValue: string) => {
    const selectedDateObj = new Date(dateValue);
    if (isNaN(selectedDateObj.getTime())) return "evenign-news-amharit";

    const now = new Date();
    const israelTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }),
    );
    const currentHour = israelTime.getHours();
    const isToday =
      selectedDateObj.toDateString() === israelTime.toDateString();

    if (!isToday) return "evenign-news-amharit";
    if (currentHour >= 19) return "evenign-news-amharit";
    if (currentHour >= 13) return "kan-amhari-noon";
    if (currentHour >= 6) return "amharit";
    return "evenign-news-amharit";
  }, []);

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      setSelectedDate(`${year}-${month}-${day}`);
    }
  }, [initialDate]);

  useEffect(() => {
    if (initialShow && initialShow !== selectedShow && !userHasSelectedShow) {
      setSelectedShow(initialShow);
    }
  }, [initialShow, selectedShow, userHasSelectedShow]);

  useEffect(() => {
    if (!selectedDate || userHasSelectedShow || initialShow) return;

    const latestShow = getLatestShowForDate(selectedDate);
    if (latestShow !== selectedShow) {
      setSelectedShow(latestShow);
    }
  }, [
    selectedDate,
    selectedShow,
    userHasSelectedShow,
    initialShow,
    getLatestShowForDate,
  ]);

  const getAdjustedDate = useCallback(() => {
    if (!selectedDate) return selectedDate;

    const now = new Date();
    const israelTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }),
    );
    const currentHour = israelTime.getHours();

    const selectedDateObj = new Date(selectedDate);
    const isToday =
      selectedDateObj.toDateString() === israelTime.toDateString();

    const showStartHours = {
      amharit: 6,
      "kan-amhari-noon": 13,
      "evenign-news-amharit": 19,
    };

    const startHour =
      showStartHours[selectedShow as keyof typeof showStartHours] || 0;

    if (isToday && currentHour < startHour) {
      const yesterday = new Date(selectedDateObj);
      yesterday.setDate(yesterday.getDate() - 1);
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, "0");
      const day = String(yesterday.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return selectedDate;
  }, [selectedDate, selectedShow]);

  const getIframeDate = useCallback(() => {
    const adjustedDate = getAdjustedDate();
    if (!adjustedDate) return "";
    const date = new Date(adjustedDate);
    if (isNaN(date.getTime())) {
      const today = new Date();
      return `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, [getAdjustedDate]);

  const getDisplayDate = useCallback(() => {
    const adjustedDate = getAdjustedDate();
    if (!adjustedDate) return "טוען...";
    const date = new Date(adjustedDate);
    if (isNaN(date.getTime())) return "תאריך לא תקין";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }, [getAdjustedDate]);

  const iframeUrl = `https://omny.fm/shows/${selectedShow}/${getIframeDate()}/embed`;

  const getShowName = (show: string) => {
    switch (show) {
      case "amharit":
        return "בוקר";
      case "kan-amhari-noon":
        return "צהריים";
      case "evenign-news-amharit":
        return "ערב";
      default:
        return show;
    }
  };

  const openSelectionDialog = () => {
    setDialogDate(selectedDate);
    setDialogShow(selectedShow);
    setIsShowDialogOpen(true);
  };

  const applyDialogSelection = () => {
    if (!dialogDate) {
      setIsShowDialogOpen(false);
      return;
    }

    const hasChanges =
      dialogDate !== selectedDate || dialogShow !== selectedShow;

    if (hasChanges) {
      setIsLoading(true);
      setSelectedDate(dialogDate);
      setSelectedShow(dialogShow);
      setUserHasSelectedShow(true);
      setTimeout(() => setIsLoading(false), 500);
    }

    setIsShowDialogOpen(false);
  };

  const shows = ["amharit", "kan-amhari-noon", "evenign-news-amharit"];
  const iframeKey = `${selectedShow}-${selectedDate}`;

  useEffect(() => {
    if (!selectedDate) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [iframeUrl, selectedShow, selectedDate]);

  return (
    <section className="rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <FiCalendar className="h-5 w-5 text-slate-500" />
            <div className="flex items-center gap-2">
              <div className="font-bold">תוכניות מוקלטות</div>
              <div className="text-sm text-slate-500">{getDisplayDate()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-slate-50">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[1.75rem] bg-white/90 p-6 text-slate-700">
            <FiRefreshCw className="h-7 w-7 text-sky-600" />
            <div className="text-base font-semibold">
              טוען תוכנית {getShowName(selectedShow)}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FiClock className="h-4 w-4" />
              <span>{getDisplayDate()}</span>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          className=" w-full h-44  border-0 bg-white"
          src={iframeUrl}
          title={`תוכנית מוקלטת - ${getShowName(selectedShow)}`}
          loading="eager"
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setIsLoading(false);
          }}
          allow="autoplay; encrypted-media"
        />
      </div>

      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="flex justify-start flex-wrap gap-1">
          <button
            type="button"
            className="flex items-center justify-around gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-500 hover:bg-sky-50"
            onClick={openSelectionDialog}
            title="בחר תוכנית ותאריך"
            disabled={isLoading}
          >
            {showIcons[selectedShow as keyof typeof showIcons]}
            <span>
              בחירה: {getShowName(selectedShow)} • {getDisplayDate()}
            </span>
          </button>
        </div>
      </div>

      {isShowDialogOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
            <div className="mb-4 text-center">
              <div className="text-lg font-bold text-slate-900">
                בחירת תוכנית ותאריך
              </div>
              <div className="text-sm text-slate-500">
                נבחר כרגע: {getShowName(selectedShow)} • {getDisplayDate()}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="recorded-date-picker"
                className="mb-1 block text-sm font-semibold text-slate-700"
              >
                תאריך
              </label>
              <input
                id="recorded-date-picker"
                type="date"
                className="w-full rounded-2xl border border-slate-300 bg-white py-2 px-3 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                style={{ direction: "ltr", textAlign: "left" }}
                value={dialogDate}
                onChange={(e) => setDialogDate(e.target.value)}
                title="בחר תאריך"
              />
            </div>

            <div className="space-y-2">
              {shows.map((show) => {
                const iconKey = show as keyof typeof showIcons;
                const isActive = dialogShow === show;
                return (
                  <button
                    key={show}
                    type="button"
                    className={`w-full flex items-center justify-between rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-50"
                    }`}
                    onClick={() => setDialogShow(show)}
                    title={getShowName(show)}
                    disabled={isLoading}
                  >
                    <span className="flex items-center gap-2">
                      {showIcons[iconKey]}
                      {getShowName(show)}
                    </span>
                    {isActive && <span>✓</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-sky-600 bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                onClick={applyDialogSelection}
              >
                החל
              </button>
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setIsShowDialogOpen(false)}
              >
                סגירה
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 
      <div className="flex  gap-3 border-t border-slate-200 bg-slate-50 p-4 flex-row items-center justify-between">
        <div className="text-sm text-slate-500">
          {getShowName(selectedShow)} • {getDisplayDate()}
        </div>
      </div> */}
    </section>
  );
}
