import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jejak | Souvenir Rute 3D Cetak untuk Pelari, Pesepeda, dan Pendaki",
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
    "3D printed route",
    "route souvenir",
    "running souvenir",
    "cycling souvenir",
    "hiking souvenir",
  ],
  openGraph: {
    title: "Jejak | Souvenir Rute 3D Cetak",
    description:
      "Abadikan jejakmu! Plakat, terrain, dan gantungan kunci 3D dari rute lari, gowes, dan mendaki kamu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="grain-overlay">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
