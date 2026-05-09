'use client';
import { useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="max-w-full bg-white shadow-md p-4 lg:h-screen lg:sticky lg:top-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">RBPMS</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </button>
        </div>
        <nav className={`flex flex-col gap-3 lg:gap-0 lg:space-y-3 border-t pt-4 text-gray-700 lg:border-none lg:pt-0 ${isOpen ? 'block' : 'hidden'} lg:block`}>
          <a
            href="/dashboard"
            className="block w-full rounded-md p-3 text-left bg-gray-100 hover:bg-gray-200"
          >
            Dashboard
          </a>
          <a
            href="/daily-report"
            className="block w-full rounded-md p-3 text-left hover:bg-gray-200"
          >
            Daily Report
          </a>
          <a
            href="/weekly-plan"
            className="block w-full rounded-md p-3 text-left hover:bg-gray-200"
          >
            Weekly Plan
          </a>
          <a
            href="/visualization"
            className="block w-full rounded-md p-3 text-left hover:bg-gray-200"
          >
            Visualization
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
