// AdminLayout.jsx
import { useState } from "react";
import { useNavigate,  Link } from "react-router-dom";
const NAV = [
  { id:"dashboard",   label:"Dashboard",   icon:"📊",path:"/admin/dashboard"  },
  { id:"validations", label:"Validations", icon:"✅" ,path:"/admin/validations"},
  { id:"students",    label:"Students",    icon:"🎓" ,path:"/admin/students"},
  { id:"companies",   label:"Companies",   icon:"🏢",path:"/admin/companies" },
  { id:"agreements", label:"Agreements", icon:"📄", path:"/admin/agreements"}
];

function Sidebar({ active, onNav, pendingCount }) {
 const navigate = useNavigate();
  return (
    <aside className="flex flex-col h-full bg-slate-900 border-r border-slate-800" style={{width:240}}>
      <div className="px-5 py-5 border-b border-slate-800">
        <Link to="/" className="font-syne font-extrabold text-xl text-white tracking-tight">
          Stag<span className="text-soft">.</span>io
        </Link>
        <div className="mt-0.5 text-xs text-slate-500 font-medium">Admin Portal</div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-2 py-2">Menu</div>
        {NAV.map(item => (
          <div key={item.id}
           onClick={() => {
             if(onNav ) onNav(item.id);
             navigate(item.path); 
           
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium ${
              active === item.id
                ? "bg-soft text-slate-900 font-semibold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}>
            <span className="text-base w-5 text-center">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === "validations" && pendingCount > 0 && (
              <span className="ml-auto text-xs font-bold bg-cream text-slate-800 px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
            {item.id === "companies" && pendingCount > 0 && (
              <span className="ml-auto text-xs font-bold bg-cream text-slate-800 px-2 py-0.5 rounded-full">!</span>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-soft flex items-center justify-center text-sm font-bold text-slate-900 shrink-0 font-syne">AD</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Dr. Omar Hadj</div>
            <div className="text-xs text-slate-500 truncate">Internship Office · IFA</div>
          </div>
        </div>
        <button className="w-full mt-1 text-xs text-slate-600 hover:text-red-400 py-2 transition-colors text-left px-3">Sign out →</button>
      </div>
    </aside>
  );
}
export default function AdminLayout({ children, active, onNav, pendingCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-[#fdf9f5]">
      <div className="hidden md:flex shrink-0 h-full">
        <Sidebar active={active} onNav={onNav} pendingCount={pendingCount} />
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-60 z-50 md:hidden bg-slate-900">
            <Sidebar active={active} onNav={id => { onNav && onNav(id); setMobileOpen(false); }} pendingCount={pendingCount} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <button onClick={() => setMobileOpen(true)} className="flex flex-col gap-1.5 p-1">
            <span className="block w-5 h-0.5 bg-white rounded" />
            <span className="block w-5 h-0.5 bg-white rounded" />
            <span className="block w-5 h-0.5 bg-white rounded" />
          </button>
          <span className="font-syne font-extrabold text-white">Stag<span className="text-soft">.</span>io</span>
          <div className="w-8 h-8 rounded-full bg-soft flex items-center justify-center text-xs font-bold text-slate-900">AD</div>
        </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}