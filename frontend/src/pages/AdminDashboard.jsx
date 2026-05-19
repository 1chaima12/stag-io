// AdminDashboard.jsx
import { useState, useEffect } from "react"; // 1. أضفنا useEffect
import axios from "axios"; // 2. استيراد axios لجلب البيانات
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  
  // 3. تعريف الحالة (State) لتخزين البيانات القادمة من السيرفر
  const [statsData, setStatsData] = useState({
    total_students: 0,
    students_placed: 0,
    unplaced_students: 0,
    total_companies: 0,
    pending_validations: 0,
    agreements_issued: 0,
    placement_by_dept: [],
    recent_validations: []
  });

  const [loading, setLoading] = useState(true);

  // 4. دالة جلب البيانات من Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // جلب التوكن للتفويض
       const token = localStorage.getItem('access_token');
const response = await axios.get("https://stag-io-lr0s.onrender.com/api/admin/stats/", {
  headers: { Authorization:` Bearer ${token} `}
});
        setStatsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // تحضير مصفوفة STATS بناءً على البيانات الحقيقية
  const STATS = [
    { label:"Total students",    value: statsData.total_students,    icon:"🎓", color:"bg-soft border-soft",   sub:"registered on platform" },
    { label:"Students placed",   value: statsData.students_placed,   icon:"✅", color:"bg-blush border-blush",  sub:"internship accepted" },
    { label:"Unplaced students", value: statsData.unplaced_students, icon:"⏳", color:"bg-cream border-cream",  sub:"still searching" },
    { label:"Companies",         value: statsData.total_companies,   icon:"🏢", color:"bg-rose border-rose",    sub:"active on platform" },
    { label:"Pending validation",value: statsData.pending_validations,icon:"📋", color:"bg-cream border-cream",  sub:"awaiting admin review" },
    { label:"Agreements issued", value: statsData.agreements_issued,  icon:"📄", color:"bg-soft border-soft",    sub:"Convention de Stage" },
  ];

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <AdminLayout active={active} onNav={setActive} pendingCount={statsData.pending_validations}>
      <div className="p-5 md:p-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="anim-fade-up mb-7">
          <p className="text-xs font-semibold text-[#2E7DF7] uppercase tracking-widest mb-1">Overview</p>
          <h1 className="font-syne font-extrabold text-slate-900 text-2xl md:text-3xl tracking-tight">Admin dashboard</h1>
          <p className="text-slate-400 text-sm font-light mt-0.5">IFA — Internship Office · 2025–2026</p>
        </div>

        {/* Stats grid */}
        <div className="anim-fade-up anim-d1 grid grid-cols-2 md:grid-cols-3 gap-3 mb-7">
          {STATS.map(({ label, value, icon, color, sub }) => (
            <div key={label} className={`card border p-4 ${color}`}>
              <div className="text-xl mb-2">{icon}</div>
              <div className="font-syne font-extrabold text-2xl text-slate-900">{value}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-5">
          {/* Placement by department (Real Data) */}
          <div className="md:col-span-3 anim-fade-up anim-d2">
            <h2 className="font-syne font-bold text-slate-800 text-base mb-3">Placement by department</h2>
            <div className="card border border-slate-200 p-5 space-y-4">
              {(statsData.placement_by_dept|| []).map(({ dept, placed, total }) => {const pct = total > 0 ? Math.round((placed / total) * 100) : 0;
                return (
                  <div key={dept}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{dept}</span>
                      <span className="text-xs text-slate-500">{placed}/{total} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="progress-bar-inner" style={{ width:` ${pct}%`, backgroundColor: "#2E7DF7" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent validations (Real Data) */}
          <div className="md:col-span-2 anim-fade-up anim-d3">
            <h2 className="font-syne font-bold text-slate-800 text-base mb-3">Recent activities</h2>
            <div className="card border border-slate-200 divide-y divide-slate-100">
              {(statsData.recent_validations|| []).map((v, i) => (
                <div key={i} className="p-3.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{v.student_name}</div>
                      <div className="text-xs text-slate-400">{v.company_name}</div>
                    </div>
                    <span className={`badge shrink-0 ${v.is_validated ? "badge-green" : "badge-orange"}`}>
                      {v.is_validated ? "Validated" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}