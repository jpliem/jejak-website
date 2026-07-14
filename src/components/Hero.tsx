"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/LanguageContext";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${y * 0.3}px)`;
      }
      if (textRef.current) {
        textRef.current.style.transform = `translateY(${y * 0.15}px)`;
        textRef.current.style.opacity = `${1 - y / 700}`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        ref={bgRef}
        className="hero-parallax absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-terracotta/10 via-clay/8 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-sage/10 via-sand/8 to-transparent blur-3xl" />
        <svg
          className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-auto opacity-[0.04]"
          viewBox="0 0 800 200"
          fill="none"
        >
          <path d="M0 150 Q100 50 200 120 T400 80 T600 130 T800 60" stroke="currentColor" strokeWidth="3" className="text-bark" />
          <path d="M0 160 Q150 80 300 140 T500 90 T700 150 T800 70" stroke="currentColor" strokeWidth="1.5" className="text-terracotta" />
        </svg>
      </div>

      <div ref={textRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-terracotta mb-6">
          {t("heroLabel")}
        </p>
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-bark leading-[0.95] mb-8">
          {t("heroTitle1")}
          <br />
          <span className="text-terracotta">{t("heroTitle2")}</span>
        </h1>
        <p className="text-lg sm:text-xl text-bark-light/80 max-w-xl mx-auto mb-10 leading-relaxed">
          {t("heroDesc")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/6281234567890?text=Hi%20Jejak!%20I%27d%20like%20to%20order%20a%20route%20keepsake."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-terracotta px-8 py-4 text-base font-medium text-warm-white transition-all hover:bg-terracotta-dark hover:shadow-xl hover:shadow-terracotta/20 active:scale-[0.97]"
          >
            {t("heroCta")}
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="#products"
            className="inline-flex items-center gap-2 rounded-full border border-bark/10 px-8 py-4 text-base font-medium text-bark-light transition-all hover:border-bark/20 hover:bg-bark/[0.03]"
          >
            {t("heroSecondary")}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bark-light/40">
        <span className="text-xs tracking-widest uppercase">{t("scrollText")}</span>
        <div className="w-px h-8 bg-gradient-to-b from-bark/20 to-transparent" />
      </div>
    </section>
  );
}
