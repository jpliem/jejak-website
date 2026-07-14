import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = "https://jejak-website.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Jejak | Souvenir Rute 3D Cetak untuk Pelari, Pesepeda, dan Pendaki",
    template: "%s | Jejak",
  },
  description:
    "Abadikan jejakmu! Souvenir unik 3D cetak dari rute lari, gowes, dan mendaki. Plakat, terrain map, dan gantungan kunci dari data GPS asli kamu.",
  keywords: [
    "souvenir lari",
    "souvenir pesepeda",
    "souvenir hiking",
    "souvenir mendaki",
    "plakat rute 3D",
    "gantungan kunci rute lari",
    "terrain map 3D",
    "kenangan rute strava",
    "hadiah pelari",
    "hadiah pesepeda",
    "hadiah pendaki",
    "3D printed route souvenir",
    "running souvenir",
    "cycling souvenir",
    "hiking souvenir",
  ],
  authors: [{ name: "Jejak" }],
  creator: "Jejak",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Jejak",
    title: "Jejak | Souvenir Rute 3D Cetak",
    description:
      "Abadikan jejakmu! Plakat, terrain, dan gantungan kunci 3D dari rute lari, gowes, dan mendaki kamu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jejak | Souvenir Rute 3D Cetak",
    description:
      "Abadikan jejakmu! Souvenir unik 3D cetak dari rute lari, gowes, dan mendaki.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Jejak",
    description:
      "Souvenir unik 3D cetak dari rute lari, gowes, dan mendaki. Plakat, terrain map, dan gantungan kunci dari data GPS asli.",
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    image: `${siteUrl}/products/plaque.jpeg`,
    priceRange: "$$",
    acceptsPayments: true,
    areaServed: "ID",
    knowsAbout: [
      "3D printing",
      "route souvenir",
      "running souvenir",
      "cycling souvenir",
      "hiking souvenir",
    ],
  };

  return (
    <html lang="id" className={jakarta.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="grain-overlay">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
