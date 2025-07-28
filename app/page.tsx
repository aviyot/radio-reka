"use client";

import Header from "../components/Header";
import LiveRadio from "../components/LiveRadio";
import RecordedShows from "../components/RecordedShows";

export default function Home() {
  const radioUrl =
    "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_REKA.mp3";

  return (
    <div className="app-container">
      <Header />

      {/* Main Content */}
      <div className="main-content">
        <LiveRadio radioUrl={radioUrl} />
        <RecordedShows />
      </div>
    </div>
  );
}
