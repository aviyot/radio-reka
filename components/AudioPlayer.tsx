"use client";

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="w-full">
      <audio
        className="w-full"
        controls
        src={src}
        preload="none"
        style={{ direction: "ltr" }}
      />
    </div>
  );
}
