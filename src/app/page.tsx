"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (!data.success) {
      setError("Invalid credentials");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <input
            className="border border-gray-300 p-3 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border border-gray-300 p-3 w-full mb-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>

      {/* Image Background Section */}
      <div className="flex-1 bg-cover bg-center hidden md:block" style={{ backgroundImage: 'url("/login-bg.jpg")' }}>
        {/* Optional overlay or content */}
      </div>
    </div>
  );
}









// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// const navItems = [
//   { name: "Dashboard", path: "/dashboard", icon: "📊" },
//   { name: "Daily Report", path: "/daily-report", icon: "📋" },
//   { name: "Weekly Plan", path: "/weekly-plan", icon: "📅" },
//   { name: "Visualization", path: "/visualization", icon: "📈" },
// ];

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2 rounded-lg shadow-lg"
//         aria-label="Toggle sidebar"
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto w-full">
//         <div className="min-h-screen p-4 sm:p-6 md:p-8 pt-16 lg:pt-8">
//           <div className="max-w-7xl mx-auto">{children}</div>
//         </div>
//       </main>
//     </div>
//   );
// }