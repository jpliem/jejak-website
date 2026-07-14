"use client";

import { useLang } from "@/lib/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center bg-sand/60 rounded-full p-0.5 text-xs font-medium">
      <button
        onClick={() => setLang("id")}
        className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
          lang === "id"
            ? "bg-warm-white text-bark shadow-sm"
            : "text-bark-light/50 hover:text-bark-light"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
          lang === "en"
            ? "bg-warm-white text-bark shadow-sm"
            : "text-bark-light/50 hover:text-bark-light"
        }`}
      >
        EN
      </button>
    </div>
  );
}
