'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Activity,
  Milestone,
  ChartBar,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Reports",
    href: "/daily-report",
    icon: Activity,
  },
  {
    name: "Plans",
    href: "/weekly-plan",
    icon: Milestone,
  },
  {
    name: "Visualization",
    href: "/visualization",
    icon: ChartBar,
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [isOpen, setIsOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          router.replace("/");
          return;
        }

        setLoading(false);
      } catch (error) {
        router.replace("/admin");
      }
    };

    checkAuth();
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Topbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm lg:hidden">
        <div>
          <h1 className="text-lg font-bold text-gray-800">RBPMS Bridges</h1>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-72 transform border-r bg-white shadow-lg transition-transform duration-300 ease-in-out
            lg:static lg:translate-x-0 lg:shadow-none
            ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b px-6 py-5">
              <h1 className="text-2xl font-bold text-blue-700">
                RBPMS Bridges
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Railway Bridge Planning Management System
              </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-2 px-4 py-5">
              {navItems.map((item) => {
                const Icon = item.icon;

                const active = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all
                      ${
                        active
                          ? "bg-blue-600 text-white shadow"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="border-t p-4">
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="min-h-screen flex-1 p-4 md:p-6 lg:p-8">
          <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}