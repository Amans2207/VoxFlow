import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

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
  title: "VoxFlow - AI Video Production Studio",
  description: "Edit videos like a pro with AI. Transform your content with the Titan-X AI Engine, Neural Dubbing, and Precision Studio.",
  keywords: ["AI Video Editor", "Automated Dubbing", "Viral Content Creator", "VoxFlow", "Aman Studio"],
  openGraph: {
    title: "VoxFlow AI | The Global Creator Engine",
    description: "Break global boundaries with the Titan-X Neural Pipeline.",
    images: ["/og-image.png"],
  }
};

import { ThemeProvider } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { ToastProvider } from "@/components/Toast";
import MaintenanceWrapper from "@/components/MaintenanceWrapper";


import { AIProvider } from "@/context/AIContext";
import AIProgressWrapper from "@/components/AIProgressWrapper";

import { UploadProvider } from "@/context/UploadContext";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="" style={{ fontFamily: "var(--font-inter), sans-serif" }} suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <UploadProvider>
              <AIProvider>
                <ThemeProvider>
                  <MaintenanceWrapper>
                    {children}
                  </MaintenanceWrapper>
                  <ThemeSwitcher />
                  <AIProgressWrapper />
                </ThemeProvider>
              </AIProvider>
            </UploadProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

