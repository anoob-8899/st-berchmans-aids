import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AdminEditProvider } from "@/lib/AdminEditContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarioChatbot } from "@/components/mario/MarioChatbot";

export const metadata: Metadata = {
  title: "Department of AI & Data Science | St. Berchmans College (Autonomous)",
  description: "Official portal of the Department of Artificial Intelligence & Data Science, St. Berchmans College, Changanassery. Autonomous programs, faculty, student showcase, syllabus, notes, and MARIO assistant.",
  icons: {
    icon: "/images/sb college logo.jpg",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-white text-[#1A1A1A] antialiased selection:bg-[#FA7538]/20 selection:text-[#FA7538]">
        <LanguageProvider>
          <AdminEditProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <MarioChatbot />
          </AdminEditProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
