"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";

export default function Products() {
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

  const products = [
    {
      nameKey: "plaqueName" as const,
      taglineKey: "plaqueTagline" as const,
      descKey: "plaqueDesc" as const,
      details: [t("plaqueDetail1"), t("plaqueDetail2"), t("plaqueDetail3")],
      image: "/products/plaque.jpeg",
      accent: "bg-terracotta",
    },
    {
      nameKey: "terrainName" as const,
      taglineKey: "terrainTagline" as const,
      descKey: "terrainDesc" as const,
      details: [t("terrainDetail1"), t("terrainDetail2"), t("terrainDetail3")],
      image: "/products/keychain-card.jpeg",
      accent: "bg-sage",
    },
    {
      nameKey: "keychainName" as const,
      taglineKey: "keychainTagline" as const,
      descKey: "keychainDesc" as const,
      details: [t("keychainDetail1"), t("keychainDetail2"), t("keychainDetail3")],
      image: "/products/keychain-card-brown.jpeg",
      accent: "bg-clay",
    },
  ];

  return (
    <section
      id="products"
      className="py-24 sm:py-32 px-6 bg-gradient-to-b from-cream to-cream-dark"
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 sm:mb-20 reveal">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-terracotta mb-4">
            {t("productsLabel")}
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-bark">
            {t("productsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product, i) => (
            <div
              key={product.nameKey}
              className={`reveal reveal-delay-${i + 1} group relative rounded-2xl bg-warm-white border border-sand/60 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-bark/[0.04] hover:-translate-y-1`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sand-light">
                <Image
                  src={product.image}
                  alt={t(product.nameKey)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-8 sm:p-10">
                <h3 className="font-heading text-3xl text-bark mb-1">
                  {t(product.nameKey)}
                </h3>
                <p className="text-sm font-medium text-terracotta mb-4">
                  {t(product.taglineKey)}
                </p>
                <p className="text-bark-light/70 leading-relaxed mb-6">
                  {t(product.descKey)}
                </p>
                <ul className="space-y-2">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-bark-light/60">
                      <div className={`w-1 h-1 rounded-full ${product.accent}`} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
