import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SocketProvider } from "@/components/SocketProvider";
import { JourneyTracker } from "@/components/JourneyTracker";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

// STATIC METADATA: No variables allowed here for Turbopack optimization
export const metadata: Metadata = {
  metadataBase: new URL('https://voxflow.ai'),
  title: {
    default: "VoxFlow AI | The Viral Video Production Studio",
    template: "%s | VoxFlow AI"
  },
  description: "Create AI videos in seconds. The world's most powerful AI Video Production Studio. Powered by the Titan-X Neural Engine.",
  applicationName: "VoxFlow AI",
  authors: [{ name: "Aman Studio" }],
};

// STATIC VIEWPORT: Separated from Metadata to stop Next.js warnings
export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }} suppressHydrationWarning>
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
            `,
          }}
        />
      </body>
    </html>
  );
}
