"use client";

import { useState, useEffect, useCallback } from "react";
import LiveRadio from "./LiveRadio";
import RecordedShows from "./RecordedShows";

interface SmartRadioProps {
  radioUrl: string;
}

export default function SmartRadio({ radioUrl }: SmartRadioProps) {
  const [latestShowTime, setLatestShowTime] = useState<string>("amharit");
  const [latestShowDate, setLatestShowDate] = useState<string>("");

  // פונקציה לבדיקה אם אנחנו בשעות שידור חי
  const isLiveBroadcastTime = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();

    // שעות שידור באמהרית: 6-7, 13-14, 19-20
    const broadcastHours = [
      { start: 6, end: 7 },
      { start: 13, end: 14 },
      { start: 19, end: 20 },
    ];

    return broadcastHours.some(({ start, end }) => hour >= start && hour < end);
  }, []);

  // פונקציה לקבלת זמן השידור האחרון שהסתיים
  const getLatestCompletedShow = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();

    console.log(`השעה הנוכחית: ${hour}:${now.getMinutes()}`);

    if (hour >= 20 || hour < 6) {
      // אחרי 20:00 או לפני 06:00 - השידור האחרון שהסתיים היה 19-20 (ערב)
      console.log("טוען שידור ערב");
      return "evenign-news-amharit";
    } else if (hour >= 14 && hour < 19) {
      // בין 14:00-19:00 - השידור האחרון שהסתיים היה 13-14 (צהריים)
      console.log("טוען שידור צהריים");
      return "kan-amhari-noon";
    } else if (hour >= 7 && hour < 13) {
      // בין 07:00-13:00 - השידור האחרון שהסתיים היה 06-07 (בוקר)
      console.log("טוען שידור בוקר");
      return "amharit";
    }

    console.log("ברירת מחדל - שידור ערב");
    return "evenign-news-amharit"; // ברירת מחדל - השידור של אתמול ערב
  }, []);

  // פונקציה לקבלת תאריך השידור האחרון
  const getLatestShowDate = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();

    // אם עכשיו לפני 06:00, השידור האחרון היה אתמול
    if (hour < 6) {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, "0");
      const day = String(yesterday.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // אחרת, השידור האחרון היה היום
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // עדכון השידור האחרון כשמסתיים שידור חי
  useEffect(() => {
    const updateLatestShow = () => {
      // תמיד עדכן לשידור האחרון, גם בזמן שידור חי
      const newLatestShow = getLatestCompletedShow();
      const newLatestDate = getLatestShowDate();

      setLatestShowTime(newLatestShow);
      setLatestShowDate(newLatestDate);

      console.log(
        `טוען את השידור האחרון: ${newLatestShow} מתאריך ${newLatestDate}`
      );
    };

    // עדכון מיידי
    updateLatestShow();

    // בדיקה כל דקה
    const interval = setInterval(updateLatestShow, 60000);

    return () => clearInterval(interval);
  }, [getLatestCompletedShow, getLatestShowDate]);

  return (
    <div className="main-content">
      {/* שני סוגי השידורים */}
      <LiveRadio radioUrl={radioUrl} />
      <RecordedShows
        initialDate={latestShowDate}
        initialShow={latestShowTime}
      />
    </div>
  );
}
