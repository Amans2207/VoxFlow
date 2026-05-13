import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SocketProvider } from "@/components/SocketProvider";
import { JourneyTracker } from "@/components/JourneyTracker";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://voxflow.ai'),
  title: {
    default: "VoxFlow AI | The Viral Video Production Studio",
    template: "%s | VoxFlow AI"
  },
  description: "Create AI videos in seconds. The world's most powerful AI Video Production Studio for Creators and Agencies. Powered by the Titan-X Neural Engine.",
  applicationName: "VoxFlow AI",
  authors: [{ name: "Aman Studio" }],
  generator: "Next.js",
  keywords: ["AI Video Editor", "Neural Dubbing", "Hormozi Captions", "Titan-X Engine", "Automated Video Production", "Aman Studio", "VoxFlow"],
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: "VoxFlow AI | Next-Gen AI Video Production",
    description: "Orchestrate viral content in 100+ languages with AI precision. The future of video creation is here.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "VoxFlow AI Studio" }],
    url: 'https://voxflow.ai',
    siteName: "VoxFlow AI",
    locale: "en_US",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "VoxFlow AI | Next-Gen AI Video Studio",
    description: "Create viral videos in seconds with the Titan-X Neural Engine.",
    creator: "@voxflow_ai",
    images: ["/twitter-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { ThemeProvider } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ToastProvider } from "@/components/Toast";
import MaintenanceWrapper from "@/components/MaintenanceWrapper";


import { AIProvider } from "@/context/AIContext";
import AIProgressWrapper from "@/components/AIProgressWrapper";

import { UploadProvider } from "@/context/UploadContext";
import { AuthProvider } from "@/components/AuthProvider";
import { CreditsProvider } from "@/context/CreditsContext";

import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="" style={{ fontFamily: "var(--font-inter), sans-serif" }} suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>
              <CreditsProvider>
                <UploadProvider>
                  <AIProvider>
                      <ThemeProvider>
                        <MaintenanceWrapper>
                          <SocketProvider>
                            <GlobalErrorBoundary>
                              <JourneyTracker />
                              {children}
                            </GlobalErrorBoundary>
                          </SocketProvider>
                        </MaintenanceWrapper>
                        <ThemeSwitcher />
                        <AIProgressWrapper />
                      </ThemeProvider>
                  </AIProvider>
                </UploadProvider>
              </CreditsProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
        <Script
          id="service-worker-cleaner"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              // Clear old cache storage
              if ('caches' in window) {
                caches.keys().then(function(names) {
                  for (let name of names) caches.delete(name);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

