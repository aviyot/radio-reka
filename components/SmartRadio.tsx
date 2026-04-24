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
    const israelTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }),
    );
    const hour = israelTime.getHours();

    // שעות שידור באמהרית: 6-7, 13-14, 19-20 (שעון ישראל)
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
    const israelTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }),
    );
    const hour = israelTime.getHours();

    console.log(`השעה הנוכחית בישראל: ${hour}:${israelTime.getMinutes()}`);

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
    const israelTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }),
    );
    const hour = israelTime.getHours();

    // אם עכשיו לפני 06:00 או בין 06:00-07:00 בבוקר (בזמן שידור הבוקר)
    // השידור האחרון שהסתיים היה אתמול בערב
    if (hour < 7) {
      const yesterday = new Date(israelTime.getTime() - 24 * 60 * 60 * 1000);
      const year = yesterday.getFullYear();
      const month = String(yesterday.getMonth() + 1).padStart(2, "0");
      const day = String(yesterday.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // אחרת, השידור האחרון היה היום
    const year = israelTime.getFullYear();
    const month = String(israelTime.getMonth() + 1).padStart(2, "0");
    const day = String(israelTime.getDate()).padStart(2, "0");
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
        `טוען את השידור האחרון: ${newLatestShow} מתאריך ${newLatestDate}`,
      );
    };

    // עדכון מיידי
    updateLatestShow();

    // בדיקה כל דקה
    const interval = setInterval(updateLatestShow, 60000);

    return () => clearInterval(interval);
  }, [getLatestCompletedShow, getLatestShowDate]);

  return (
    <div className="flex flex-col gap-5 p-4">
      <LiveRadio radioUrl={radioUrl} />
      <RecordedShows
        initialDate={latestShowDate}
        initialShow={latestShowTime}
      />
    </div>
  );
}
