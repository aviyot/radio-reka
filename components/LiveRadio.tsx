"use client";

import { FiRadio, FiClock } from "react-icons/fi";

interface LiveRadioProps {
  radioUrl: string;
}

export default function LiveRadio({ radioUrl }: LiveRadioProps) {
  return (
    <section className="rounded-[2rem] bg-white shadow-xl ring-1 ring-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <FiRadio className="h-7 w-7 text-sky-600" />
            <div>
              <div className="text-lg font-bold">שידור חי</div>
              <div className="text-sm text-slate-500">
                התחבר לשידור בזמן אמת
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FiClock className="h-5 w-5 text-slate-500" />
            <span>שעות שידור: 6-7 | 13-14 | 19-20</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6">
        <audio
          className="w-full min-h-[3rem]"
          controls
          src={radioUrl}
          preload="none"
        >
          הדפדפן שלך לא תומך בנגן השמע
        </audio>
      </div>
    </section>
  );
}
