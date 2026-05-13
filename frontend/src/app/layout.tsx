import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SocketProvider } from "@/components/SocketProvider";
import { JourneyTracker } from "@/components/JourneyTracker";

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
  title: "VoxFlow AI - Next-Gen Video Engine",
  description: "The world's most powerful AI Video Production Studio. Transform content with Titan-X Neural Dubbing, Precision Studio, and Generative AI.",
  keywords: ["AI Video Editor", "Automated Dubbing", "Viral Content Creator", "VoxFlow", "Aman Studio"],
  openGraph: {
    title: "VoxFlow AI | Next-Gen Video Production",
    description: "The future of video creation is here. Powered by the Titan-X Neural Engine.",
    images: ["/og-image.png"],
    url: 'https://voxflow.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "VoxFlow AI - Next-Gen Video Engine",
    description: "Orchestrate viral content with AI precision.",
    images: ["/twitter-image.png"],
  },
  manifest: "/manifest.json",
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
                          <JourneyTracker />
                          {children}
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

