// StudentLayout.jsx — Shared sidebar layout for all student pages

import { useState } from "react";
import { useNavigate,  Link } from "react-router-dom";

const NAV_ITEMS = [
  { id:"dashboard",    label:"Dashboard",     icon:"📊", path:"/student/dashboard" },
  { id:"search",       label:"Find offers",   icon:"🔍", path:"/student/search" },
  { id:"applications", label:"My applications",icon:"📋", path:"/student/applications" },
  { id:"profile",      label:"My profile",    icon:"👤", path:"/student/profile" },
];

function Sidebar({ active, onNav }) {
    const navigate = useNavigate();
  
  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200" style={{width:240}}>
      {/* Logo */}
      <div className="px-5 py-5 border-soft border-slate-100">
        <Link to="/" className="font-syne font-extrabold text-xl text-slate-900 tracking-tight">
          Stag<span className="text-[#2E7DF7]">.</span>io
        </Link>
        <div className="mt-0.5 text-xs text-slate-400 font-medium">Student Portal</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 py-2">Menu</div>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => {
              if(onNav) onNav(item.id);
               navigate(item.path);
              }}
            className={`sidebar-link ${active === item.id ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === "applications" && (
              <span className="ml-auto badge badge-blue">3</span>
            )}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream/30 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5aaee8] to-[#2E7DF7] flex items-center justify-center text-sm font-bold text-white shrink-0">
            AB
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">Amira Benali</div>
            <div className="text-xs text-slate-400 truncate">L3 Informatique · IFA</div>
          </div>
          <span className="text-slate-300 text-xs">⚙️</span>
        </div>
        <button className="w-full mt-1 text-xs text-slate-400 hover:text-[#b5394e] py-2 transition-colors text-left px-3">
          Sign out →
        </button>
      </div>
    </aside>
  );
}

export { Sidebar, NAV_ITEMS };
export default function StudentLayout({ children, active, onNav }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-cream/30">

        {/* Desktop sidebar */}
        <div className="hidden md:flex shrink-0 h-full">
          <Sidebar active={active} onNav={onNav} />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <>
            <div className="mobile-overlay md:hidden" onClick={() => setMobileOpen(false)} />
            <div className="mobile-sidebar md:hidden">
              <Sidebar active={active} onNav={(id) => { onNav && onNav(id); setMobileOpen(false); }} />
            </div>
          </>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile topbar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-soft border-slate-200">
            <button onClick={() => setMobileOpen(true)} className="flex flex-col gap-1.5 p-1">
              <span className="block w-5 h-0.5 bg-slate-700 rounded" />
              <span className="block w-5 h-0.5 bg-slate-700 rounded" />
              <span className="block w-5 h-0.5 bg-slate-700 rounded" />
            </button>
            <span className="font-syne font-extrabold text-slate-900">Stag<span className="text-[#2E7DF7]">.</span>io</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5aaee8] to-[#2E7DF7] flex items-center justify-center text-xs font-bold text-white">AB</div>
          </div>

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
