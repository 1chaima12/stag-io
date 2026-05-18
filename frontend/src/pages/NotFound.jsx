import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // إضافة هذا السطر ضروري جداً

const suggestions = [
  { label: "Home",           href: "/",                emoji: "🏠" },
  { label: "Find internships", href: "/student/search", emoji: "🔍" },
  { label: "Sign in",        href: "/login",            emoji: "🔑" },
  { label: "Create account", href: "/register",         emoji: "✨" },
];

export default function NotFoundPage() {
  const [typed, setTyped] = useState("");
  const full = "/404-not-found";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#2E7DF7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative px-6 md:px-10 py-6 flex justify-between items-center">
        <Link to="/" className="font-syne font-extrabold text-xl text-white tracking-tight">
          Stag<span className="text-[#6baed6]">.</span>io
        </Link>
        <Link to="/" className="text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg transition-all duration-200">
          ← Back to home
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">

        {/* Big 404 Visual */}
        <div className="mb-6 relative">
          <div
            className="font-syne font-extrabold text-white select-none opacity-10"
            style={{ fontSize: "clamp(7rem, 20vw, 14rem)", lineHeight: 1, letterSpacing: "-4px" }}
          >
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-6xl md:text-8xl animate-bounce">
            🗺️
          </div>
        </div>

        {/* Terminal Text Animation */}
        <div className="font-mono text-xs text-slate-500 bg-slate-900/80 border border-slate-800 rounded-lg px-4 py-2.5 mb-8 flex items-center gap-2">
          <span className="text-[#c97168]">stag.io</span>
          <span className="text-slate-600">~</span>
          <span className="text-slate-300">{typed}</span>
          <span className="animate-pulse text-[#6baed6]">|</span>
        </div>

        <h1 className="font-syne font-extrabold text-white text-3xl md:text-4xl tracking-tight mb-3">
          Lost in the internship galaxy
        </h1>
        <p className="text-slate-400 font-light leading-relaxed max-w-sm mb-10 text-sm md:text-base">
          The page you're looking for doesn't exist — or has been moved.
          Let's get you back on track.
        </p>

        {/* Suggestions Grid - Fixed with Link */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-xl mb-10">
          {suggestions.map(({ label, href, emoji }) => (
            <Link
              key={label}
              to={href}
              className="flex flex-col items-center gap-2 bg-slate-900/80 border border-slate-800 hover:border-[#2E7DF7]/50 hover:bg-slate-800/80 rounded-xl py-4 px-3 transition-all duration-200 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
              <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{label}</span>
            </Link>
          ))}
        </div>
        {/* Primary CTA */}
        <Link
          to="/"
          className="bg-[#2E7DF7] hover:bg-[#1a66d9] text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-500/20"
        >
          Take me home →
        </Link>

      </div>

      {/* Footer */}
      <div className="relative px-6 py-5 text-center">
        <p className="text-xs text-slate-700">
          © 2025–2026 · Stag.io · IFA · L3TI Workshop
        </p>
      </div>
    </div>
  );
}