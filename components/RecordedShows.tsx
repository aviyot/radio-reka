"use client";

import { useState, useEffect, useCallback } from "react";

interface RecordedShowsProps {
  initialDate?: string;
  initialShow?: string;
}

export default function RecordedShows({
  initialDate,
  initialShow = "amharit",
}: RecordedShowsProps) {
  const [selectedDate, setSelectedDate] = useState("2025-07-28");
  const [selectedShow, setSelectedShow] = useState(initialShow);
  const [isLoading, setIsLoading] = useState(false);
  const [userHasSelectedShow, setUserHasSelectedShow] = useState(false);

  // הגדרת תאריך נכון רק אחרי mount
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

  // עדכון תוכנית נבחרת כשמשתנה initialShow - רק אם המשתמש לא בחר ידנית
  useEffect(() => {
    console.log(`בדיקת עדכון אוטומטי:`, {
      initialShow,
      selectedShow,
      userHasSelectedShow,
      shouldUpdate:
        initialShow && initialShow !== selectedShow && !userHasSelectedShow,
    });

    if (initialShow && initialShow !== selectedShow && !userHasSelectedShow) {
      setSelectedShow(initialShow);
      console.log(`✅ עדכון אוטומטי של תוכנית נבחרת ל: ${initialShow}`);
    } else if (userHasSelectedShow) {
      console.log(`🚫 לא מעדכן - המשתמש בחר ידנית: ${selectedShow}`);
    }
  }, [initialShow, selectedShow, userHasSelectedShow]);

  // פונקציה לחישוב התאריך הנכון לתוכנית
  const getAdjustedDate = useCallback(() => {
    if (!selectedDate) return selectedDate;

    const now = new Date();
    const currentHour = now.getHours();
    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDateObj.toDateString() === now.toDateString();

    // הגדרת שעות התחלה לתוכניות
    const showStartHours = {
      amharit: 6, // בוקר - מתחיל מ-06:00
      "kan-amhari-noon": 13, // צהריים - מתחיל מ-13:00
      "evenign-news-amharit": 19, // ערב - מתחיל מ-19:00
    };

    const startHour =
      showStartHours[selectedShow as keyof typeof showStartHours] || 0;

    // אם זה היום הנוכחי והשעה הנוכחית היא לפני שעת ההתחלה של התוכנית
    if (isToday && currentHour < startHour) {
      // חסר יום אחד
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
    // וודא שהתאריך תקין
    if (isNaN(date.getTime())) {
      const today = new Date();
      return `${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}`;
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, [getAdjustedDate]);

  // פורמט תאריך לתצוגה
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

  // בדיקה אם התאריך המוצג הוא מיום קודם
  const isShowingPreviousDay = useCallback(() => {
    if (!selectedDate) return false;
    const adjustedDate = getAdjustedDate();
    return adjustedDate !== selectedDate;
  }, [selectedDate, getAdjustedDate]);

  // יצירת URL עבור iframe
  const iframeUrl = `https://omny.fm/shows/${selectedShow}/${getIframeDate()}/embed`;

  // שמות התוכניות
  const getShowName = (show: string) => {
    switch (show) {
      case "amharit":
        return "🌅 בוקר";
      case "kan-amhari-noon":
        return "☀️ צהריים";
      case "evenign-news-amharit":
        return "🌙 ערב";
      default:
        return show;
    }
  };

  // טיפול בשינוי תוכנית
  const handleShowChange = (show: string) => {
    if (show !== selectedShow) {
      setIsLoading(true);
      setSelectedShow(show);
      setUserHasSelectedShow(true); // סימון שהמשתמש בחר ידנית
      console.log(`משתמש בחר ידנית שידור: ${show}`);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // טיפול בשינוי תאריך
  const handleDateChange = (date: string) => {
    if (date !== selectedDate) {
      setIsLoading(true);
      setSelectedDate(date);
      console.log(`משתמש שינה תאריך ל: ${date}`);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const shows = ["amharit", "kan-amhari-noon", "evenign-news-amharit"];

  // יצירת key ייחודי לכל שילוב של תאריך ותוכנית
  const iframeKey = `${selectedShow}-${selectedDate}`;

  // עוקב אחרי שינויים ב-URL של iframe
  useEffect(() => {
    if (!selectedDate) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [iframeUrl, selectedShow, selectedDate]);

  return (
    <div className="content-section recorded-section">
      <div className="section-header">
        📻 תוכניות מוקלטות - {getShowName(selectedShow)} ({getDisplayDate()})
        {isShowingPreviousDay() && (
          <span className="previous-day-indicator"> (מיום קודם)</span>
        )}
      </div>

      <div className="iframe-container">
        {isLoading && (
          <div className="loading-overlay">
            🔄 טוען תוכנית {getShowName(selectedShow)}
            <br />
            📅 {getDisplayDate()}
          </div>
        )}
        <iframe
          key={iframeKey}
          className="iframe-embed"
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

      {/* Controls */}
      <div className="controls">
        <input
          type="date"
          className="date-input"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          title="בחר תאריך"
        />

        {shows.map((show) => (
          <button
            key={show}
            className={`time-button ${selectedShow === show ? "active" : ""}`}
            onClick={() => handleShowChange(show)}
            title={getShowName(show)}
            disabled={isLoading}
          >
            {getShowName(show)}
            {selectedShow === show && " ✓"}
          </button>
        ))}
      </div>
    </div>
  );
}
