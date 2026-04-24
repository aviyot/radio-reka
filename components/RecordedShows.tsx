"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FiMusic,
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
  const [isLoading, setIsLoading] = useState(false);
  const [userHasSelectedShow, setUserHasSelectedShow] = useState(false);

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

  const isShowingPreviousDay = useCallback(() => {
    if (!selectedDate) return false;
    const adjustedDate = getAdjustedDate();
    return adjustedDate !== selectedDate;
  }, [selectedDate, getAdjustedDate]);

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

  const handleShowChange = (show: string) => {
    if (show !== selectedShow) {
      setIsLoading(true);
      setSelectedShow(show);
      setUserHasSelectedShow(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleDateChange = (date: string) => {
    if (date !== selectedDate) {
      setIsLoading(true);
      setSelectedDate(date);
      setTimeout(() => setIsLoading(false), 500);
    }
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
            <FiMusic className="h-7 w-7 text-slate-700" />
            <div>
              <div className="text-lg font-bold">תוכניות מוקלטות</div>
              <div className="text-sm text-slate-500">
                {getShowName(selectedShow)} • {getDisplayDate()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FiCalendar className="h-5 w-5 text-slate-500" />
            <span>{selectedDate}</span>
          </div>
        </div>
      </div>

      <div className="relative bg-slate-50 p-6">
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
          className="h-[260px] w-full rounded-[1.5rem] border-0 bg-white"
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

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <FiCalendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            className="w-full rounded-2xl border border-slate-300 bg-white py-2 pl-11 pr-3 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            title="בחר תאריך"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {shows.map((show) => {
            const iconKey = show as keyof typeof showIcons;
            return (
              <button
                key={show}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  selectedShow === show
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:bg-sky-50"
                }`}
                onClick={() => handleShowChange(show)}
                title={getShowName(show)}
                disabled={isLoading}
              >
                {showIcons[iconKey]}
                <span>{getShowName(show)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
