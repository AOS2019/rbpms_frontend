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
  description: "An integrated, data-driven platform that automates bridge construction planning, tracks daily site activities, manages resources, and delivers real-time analytics and visual progress insights for railway infrastructure projects",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">{children}</body>
//     </html>
//   );
// }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white h-screen shadow-md p-4">
            <h1 className="text-xl font-bold mb-6">RBPMS</h1>
            <nav className="space-y-3 border-t pt-4 text-gray-700">
              <a href="/dashboard" className="block p-4 bg-gray-100 hover:bg-gray-200">Dashboard</a>
              <a href="/daily-report" className="block p-4 hover:bg-gray-200">Daily Report</a>
              <a href="/weekly-plan" className="block p-4 hover:bg-gray-200">Weekly Plan</a>
              <a href="/visualization" className="block p-4 hover:bg-gray-200">Visualization</a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
