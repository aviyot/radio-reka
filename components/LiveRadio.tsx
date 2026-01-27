"use client";

interface LiveRadioProps {
  radioUrl: string;
}

export default function LiveRadio({ radioUrl }: LiveRadioProps) {
  return (
    <div className="content-section live-section">
      <div className="section-header">
        <div className="live-header-content">
          <div className="live-title">
            <span className="live-indicator">🔴</span>
            שידור חי
          </div>
          <div className="broadcast-hours">
            <span className="hours-label">שעות שידור באמהרית:</span>
            <span className="hours-time">6-7 | 13-14 | 19-20</span>
            <span className="timezone-label">(שעון ישראל)</span>
          </div>
        </div>
      </div>
      <div className="audio-container">
        <audio className="audio-player" controls src={radioUrl} preload="none">
          הדפדפן שלך לא תומך בנגן השמע
        </audio>
      </div>
    </div>
  );
}
