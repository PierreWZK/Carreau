import type { Metadata, Viewport } from "next";
import { URL_SITE } from "@/lib/site";
import "./globals.css";

const description =
  "Un défi CSS par jour, en trois niveaux : reproduis la cible en HTML et CSS. Un petit rafraîchissement de mémoire sur les bases.";

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: "Carreau — le défi CSS du jour",
  description,
  openGraph: {
    title: "Carreau — le défi CSS du jour",
    description,
    url: "/",
    siteName: "Carreau",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Carreau — le défi CSS du jour",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8E9DF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
