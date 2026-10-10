import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Work_Sans } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const sans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const pageTitle = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: pageTitle,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F3EC",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
