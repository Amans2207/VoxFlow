import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "700"] });

// STATIC METADATA
export const metadata: Metadata = {
  title: "VoxFlow AI | Production Studio",
  description: "The world's most powerful AI Video Production Studio.",
};

// STATIC VIEWPORT: Mandatory separate export for Next.js 16
export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="bg-black text-white selection:bg-blue-500 selection:text-white" suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>
              <ThemeProvider>
                <GlobalErrorBoundary>
                  {children}
                </GlobalErrorBoundary>
              </ThemeProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
