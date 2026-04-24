"use client";

import { usePWA } from "../hooks/usePWA";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export default function ShareButton({
  title = "רדיו רקע אמהרית",
  text = "רדיו רקע אמהרית - שידור חי ותוכניות מוקלטות",
  url,
  className = "inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70",
}: ShareButtonProps) {
  const { shareContent } = usePWA();

  const handleShare = async () => {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    await shareContent(title, text, shareUrl);
  };

  return (
    <button
      onClick={handleShare}
      className={className}
      title="שתף"
      aria-label="שתף תוכן"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      שתף
    </button>
  );
}
