import { useState } from "react";
import { useNavigate,  Link } from "react-router-dom";

export const NAV = [
  { id: "dashboard", label: "Dashboard",   icon: "📊", path: "/company/dashboard" },
  { id: "profile",   label: "My profile",  icon: "🏢", path: "/company/profile"   },
  { id: "offers",    label: "My offers",   icon: "📋", path: "/company/offers"    },
  { id: "candidates",label: "Candidates",  icon: "👥", path: "/company/candidates"},
];

function Sidebar({ active, onNav, pendingCount }) {
  const navigate = useNavigate();

  return (
    // تم تصحيح width هنا
    <aside className="flex flex-col h-full bg-white border-r border-slate-200" style={{ width: "240px" }}>
      <div className="px-5 py-5 border-b border-slate-100">
        <Link to="/" className="font-syne font-extrabold text-xl text-slate-900 tracking-tight">
          Stag<span className="text-[#2E7DF7]">.</span>io
        </Link>
        <div className="mt-0.5 text-xs text-slate-400 font-medium">Company Portal</div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 py-2">Menu</div>
        {NAV.map(item => (
          <div 
            key={item.id} 
            onClick={() => {
                if(onNav) onNav(item.id);
                navigate(item.path); // إضافة التنقل الفعلي عند الضغط
            }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active === item.id ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {/* تم تصحيح width هنا */}
            <span style={{ fontSize: "1.05rem", width: "20px", textAlign: "center" }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.id === "candidates" && pendingCount > 0 && (
              <span className="ml-auto bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-sm font-bold text-white shrink-0">SD</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">Sonatrach Digital</div>
            <div className="text-xs text-slate-400 truncate">rh@sonatrach.dz</div>
          </div>
        </div>
        <button onClick={() => navigate("/login")} className="w-full mt-1 text-xs text-slate-400 hover:text-red-600 py-2 transition-colors text-left px-3">Sign out →</button>
      </div>
    </aside>
  );
}

export default function CompanyLayout({ children, active, onNav, pendingCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar active={active} onNav={onNav} pendingCount={pendingCount} />
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-[240px] bg-white shadow-xl md:hidden flex flex-col">
            <Sidebar active={active} onNav={id => { onNav && onNav(id); setMobileOpen(false); }} pendingCount={pendingCount} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200"></div>
        <button onClick={() => setMobileOpen(true)} className="flex flex-col gap-1.5 p-1">
            <span className="block w-5 h-0.5 bg-slate-700 rounded"/>
            <span className="block w-5 h-0.5 bg-slate-700 rounded"/>
            <span className="block w-5 h-0.5 bg-slate-700 rounded"/>
          </button>
          <span className="font-syne font-extrabold text-slate-900">Stag<span className="text-[#2E7DF7]">.</span>io</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xs font-bold text-white">SD</div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    
  );
}