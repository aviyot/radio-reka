"use client";

import { memo } from "react";
import ShareButton from "./ShareButton";

interface ShowControlsProps {
  selectedProdDate: string;
  onDateChange: (date: string) => void;
  prodTimes: string[];
  timeName: string;
  onTimeChange: (time: string) => void;
  formatName: (value: string) => string;
}

const ShowControls = memo(
  ({
    selectedProdDate,
    onDateChange,
    prodTimes,
    timeName,
    onTimeChange,
    formatName,
  }: ShowControlsProps) => {
    return (
      <div className="show-controls">
        {/* All buttons and date input in same row */}
        <div className="controls-container">
          {/* Date input */}
          <input
            type="date"
            className="date-input-custom"
            style={{ direction: "ltr", textAlign: "left" }}
            value={selectedProdDate}
            onChange={(e) => onDateChange(e.target.value)}
            title="בחר תאריך"
          />

          {/* Time buttons */}
          {prodTimes.map((time) => {
            const isActive = timeName === time;
            return (
              <button
                key={time}
                className={`time-button-custom ${isActive ? "active" : ""}`}
                onClick={() => onTimeChange(time)}
                title={`${formatName(time)} - לחץ לבחירה`}
                data-active={isActive ? "true" : "false"}
              >
                {formatName(time)}
                {isActive && <span className="active-indicator">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

ShowControls.displayName = "ShowControls";

export default ShowControls;
