import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RBPMS - Researcher’s Business Performance Management System",
  description:
    "An integrated, data-driven platform that automates bridge construction planning, tracks daily site activities, manages resources, and delivers real-time analytics and visual progress insights for railway infrastructure projects",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-gray-100 text-gray-800">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <aside className="w-full lg:w-64 bg-white shadow-md p-4 lg:h-screen lg:sticky lg:top-0">
            <h1 className="text-xl font-bold mb-6">RBPMS</h1>
            <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-0 lg:space-y-3 border-t pt-4 text-gray-700 lg:border-none lg:pt-0">
              <a
                href="/dashboard"
                className="block w-full rounded-md p-3 text-center lg:text-left bg-gray-100 hover:bg-gray-200"
              >
                Dashboard
              </a>
              <a
                href="/daily-report"
                className="block w-full rounded-md p-3 text-center lg:text-left hover:bg-gray-200"
              >
                Daily Report
              </a>
              <a
                href="/weekly-plan"
                className="block w-full rounded-md p-3 text-center lg:text-left hover:bg-gray-200"
              >
                Weekly Plan
              </a>
              <a
                href="/visualization"
                className="block w-full rounded-md p-3 text-center lg:text-left hover:bg-gray-200"
              >
                Visualization
              </a>
            </nav>
          </aside>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
