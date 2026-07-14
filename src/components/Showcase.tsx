"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";

export default function Showcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const els = sectionRef.current?.querySelectorAll(".reveal");
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 sm:py-32 px-6" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left: Image grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 relative aspect-[16/10] rounded-2xl overflow-hidden bg-sand border border-sand/60">
              <Image
                src="/products/plaque.jpeg"
                alt="Jejak 3D-printed route plaque"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand border border-sand/60">
              <Image
                src="/products/keychain-card.jpeg"
                alt="Jejak keychain card"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand border border-sand/60">
              <Image
                src="/products/keychain-card-brown.jpeg"
                alt="Jejak brown keychain card"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-sage mb-4 reveal">
              {t("showcaseLabel")}
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl text-bark mb-6 reveal reveal-delay-1">
              {t("showcaseTitle1")}
              <br />
              {t("showcaseTitle2")}
            </h2>
            <div className="space-y-4 text-bark-light/70 leading-relaxed reveal reveal-delay-2">
              <p>{t("showcaseDesc1")}</p>
              <p>{t("showcaseDesc2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
