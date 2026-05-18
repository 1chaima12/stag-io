import { useState, useEffect } from "react";
import api from "../api"; 
import StudentLayout from "./StudentLayout";

// الخرائط اللونية للحالات (تأكد من مطابقتها لحالات Django: pending, accepted, rejected)
const STATUS_MAP = {
  pending:  { label:"Pending",  badge:"bg-orange-100 text-orange-700", dot:"bg-orange-500",  icon:"⏳", msg:"Awaiting company decision." },
  accepted: { label:"Accepted", badge:"bg-green-100 text-green-700",  dot:"bg-green-500",   icon:"✅", msg:"Your application was accepted! Agreement being prepared." },
  rejected: { label:"Rejected", badge:"bg-red-100 text-red-700",    dot:"bg-red-500",     icon:"❌", msg:"Your application was not selected this time." },
};

function Timeline({ status, date }) {
  const steps = [
    { label: "Applied", date: date || "Recently", done: true },
    { label: "Profile reviewed", date: "In progress", done: status !== "pending" },
    { label: "Company decision", date: status === "pending" ? "—" : "Completed", done: status !== "pending" },
    { label: "Agreement generated", date: "—", done: status === "accepted" },
  ];

  return (
    <div>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isRefused = status === "rejected" && i === 2;
        const isDone = step.done && !isRefused;
        return (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all ${
                isRefused ? "bg-red-50 border-red-400 text-red-600"
                : isDone  ? "bg-blue-600 border-blue-600 text-white"
                :           "bg-white border-slate-200 text-slate-300"
              }`}>
                {isRefused ? "✕" : isDone ? "✓" : String(i+1)}
              </div>
              {!isLast && (
                <div className={`w-0.5 h-8 mt-1 rounded-full ${isDone && !isRefused ? "bg-blue-100" : "bg-slate-100"}`}/>
              )}
            </div>
            <div className="pb-4 flex-1">
              <div className={`text-sm font-semibold ${isRefused ? "text-red-600" : isDone ? "text-slate-800" : "text-slate-400"}`}>
                {step.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{step.date}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await api.get('applications/');
        setApplications(response.data);
        if (response.data.length > 0) setSelected(response.data[0]);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  // تصفية البيانات (تأكد من تحويل الحالة لـ lowercase لتجنب مشاكل الحروف)
  const filtered = tab === "All"
    ? applications
    : applications.filter(a => (a.status || "").toLowerCase() === tab.toLowerCase());

  if (loading) return (
    <StudentLayout active="applications">
      <div className="p-20 text-center animate-pulse text-slate-400 font-bold text-xl">Loading your applications...</div>
    </StudentLayout>
  );

  return (
    <StudentLayout active="applications">
      <div className="p-5 md:p-8">
        <div className="mb-6">
          <h1 className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight">My applications</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your internship requests</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
          {["All", "Pending", "Accepted", "Rejected"].map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${
                tab === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* القائمة اليسرى */}
          <div className="md:col-span-2 space-y-3">
            {filtered.length > 0 ? filtered.map(app => {
              const statusKey = (app.status || "pending").toLowerCase();
              const s = STATUS_MAP[statusKey] || STATUS_MAP.pending;
              return (
                <div 
                  key={app.id} 
                  onClick={() => setSelected(app)}
                  className={`p-5 rounded-[2rem] border transition-all cursor-pointer ${
                    selected?.id === app.id ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-100/20" : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    {/* استبدلنا offer_details بـ offer_title و company_name بناءً على السيريالايزر */}
                    <h3 className="font-black text-slate-900 text-sm truncate pr-2">{app.offer_title || "Internship Offer"}</h3>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${s.badge}`}>{s.label}</span>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mb-3">{app.company_name || "Unknown Company"}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-sm text-slate-400 font-bold">No applications found.</p>
              </div>
            )}
          </div>

          {/* تفاصيل الطلب المختار */}
          <div className="md:col-span-3">
            {selected ? (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 sticky top-4 shadow-sm">
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-50">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">💼</div>
                  <div>
                    <h2 className="font-black text-2xl text-slate-900 leading-tight">{selected.offer_title}</h2>
                    <p className="text-blue-600 font-bold text-sm">{selected.company_name}</p>
                  </div>
                </div>

                {/* Status Message */}
                <div className={`p-5 rounded-2xl mb-8 flex items-center gap-4 text-sm font-bold border ${
                  selected.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' : 
                  selected.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                }`}>
                  <span className="text-xl">{STATUS_MAP[selected.status?.toLowerCase()]?.icon}</span>
                  {STATUS_MAP[selected.status?.toLowerCase()]?.msg}
                </div>

                <div className="mb-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Tracking Timeline</h4>
                  <Timeline status={selected.status?.toLowerCase()} date={new Date(selected.created_at).toLocaleDateString()} />
                </div>{selected.status === "accepted" && (
                  <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group">
                    <span>📄</span> Download Internship Agreement
                    <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                  </button>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300 gap-3 bg-slate-50/50 rounded-[2.5rem] border border-dashed">
                <span className="text-4xl opacity-50">📑</span>
                <p className="text-sm font-bold tracking-tight">Select an application to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}