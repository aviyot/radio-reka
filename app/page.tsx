"use client";

import Header from "../components/Header";
import SmartRadio from "../components/SmartRadio";

export default function Home() {
  const radioUrl =
    "https://playerservices.streamtheworld.com/api/livestream-redirect/KAN_REKA.mp3";

  return (
    <div className="app-container">
      <Header />
      <SmartRadio radioUrl={radioUrl} />
    </div>
  );
}
