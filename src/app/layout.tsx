import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFolio - Professional Developer Portfolio Builder",
  description:
    "Create and host your professional developer portfolio to showcase your skills, projects, and experience to recruiters and employers. Build your coding presence with our modern, customizable platform.",
  icons: {
    icon: "/temp.png",
    shortcut: "/temp.png",
    apple: "/temp.png",
  },
  keywords: [
    "developer portfolio",
    "coding portfolio",
    "software engineer resume",
    "tech portfolio",
    "developer showcase",
    "programming projects",
    "recruiter portfolio",
    "developer website",
    "coding resume",
    "tech career",
  ],
  authors: [{ name: "Jaime Nguyen" }],
  creator: "jaimenguyen168",
  publisher: "jaimenguyen168",
  category: "Technology",
  classification: "Portfolio Builder",
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
  openGraph: {
    title: "DevFolio - Professional Developer Portfolio Builder",
    description:
      "Create and host your professional developer portfolio to showcase your skills, projects, and experience to recruiters and employers. Build your coding presence with our modern, customizable platform.",
    url: "https://devfolio.me/",
    siteName: "DevFolio",
    images: [
      {
        url: "https://devfolio.me/api/og",
        width: 1200,
        height: 630,
        alt: "DevFolio - Developer Portfolio Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://devfolio.me/",
  },
  verification: {
    google: "1prwuKVVD1FtaYZ1T6U9YzblWLAc6zAdqV2dU1aXEXU",
  },
  metadataBase: new URL("https://devfolio.me"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
