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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!data.success) {
      setError("Invalid credentials");
      return;
    }

    // router.replace("/admin/cpanel/dashboard");
    window.location.href = "/dashboard";
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