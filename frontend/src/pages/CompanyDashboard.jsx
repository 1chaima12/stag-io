import { useState, useEffect } from "react";
import CompanyLayout from "./CompanyLayout";
import api from '../api';

const STATUS = {
  pending:  { badge: "bg-orange-100 text-orange-700", label: "Pending"  },
  accepted: { badge: "bg-green-100 text-green-700",  label: "Accepted" },
  rejected: { badge: "bg-red-100 text-red-700",    label: "Rejected" },
};

export default function CompanyDashboard() {
  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [offerStats, setOfferStats] = useState([]);
  const [accountStatus, setAccountStatus] = useState("pending");
  const [stats, setStats] = useState({
    active_offers: 0,
    total_applicants: 0,
    pending_review: 0,
    accepted_interns: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
       
        const token = localStorage.getItem('access_token');
const res = await fetch('http://127.0.0.1:8000/api/dashboard-stats/', {
  headers: { Authorization: `Bearer ${token} `}
});
// ✅ بعد
const data = await res.json();
console.log(data);
if (data.error) {
  console.error(data.error);
  setLoading(false);
  return;
}
setRecentApplicants(data.recent_applicants || []);
setOfferStats(data.offers || []);
if (data.stats) setStats(data.stats);
setAccountStatus(data.company?.status || "pending");
setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []); // [] ضرورية لمنع الطلبات اللانهائية

  if (loading) return <div className="p-10 text-center italic text-slate-400">Loading Dashboard...</div>;

  return (
    <CompanyLayout active={active} onNav={setActive} pendingCount={stats?.pending_review || 0}>
      <div className="p-5 md:p-8 max-w-5xl mx-auto font-syne">
        
        {/* بنر حالة الحساب */}
        {accountStatus === "pending" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
            <span className="text-2xl">⏳</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Account pending validation</h3>
              <p className="text-sm text-slate-600">Your registration is under review by the university administration.</p>
            </div>
          </div>
        )}

        {accountStatus !== "approved" && accountStatus !== "pending" ? (
          <div className="card border border-slate-200 p-10 text-center rounded-2xl">
            <div className="text-5xl mb-4">🚫</div>
            <h3 className="font-bold text-slate-700 text-xl">Access Denied</h3>
          </div>
        ) : (
          <div className="space-y-8">
            {/* الإحصائيات (Stats) باستخدام Optional Chaining لمنع أخطاء Undefined */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Offers", value: stats?.active_offers || 0, icon: "📋", color: "bg-blue-50 border-blue-100" },
                { label: "Total Applicants", value: stats?.total_applicants || 0, icon: "👥", color: "bg-indigo-50 border-indigo-100" },
                { label: "Pending Review", value: stats?.pending_review || 0, icon: "⏳", color: "bg-amber-50 border-amber-100" },
                { label: "Accepted", value: stats?.accepted_interns || 0, icon: "✅", color: "bg-emerald-50 border-emerald-100" },
              ].map((s) => (
                <div key={s.label} className={`p-4 border rounded-xl ${s.color}`}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-extrabold text-2xl text-slate-900">{s.value}</div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-5 gap-6">
              {/* قسم المتقدمين الجدد */}
              <div className="md:col-span-3 space-y-3">
                <h2 className="font-bold text-slate-800 text-lg">Recent Applicants</h2>
                <div className="border border-slate-200 divide-y divide-slate-100 bg-white rounded-xl overflow-hidden shadow-sm">
                  {recentApplicants.length > 0 ? recentApplicants.map((app, i) => (
                    <div key={i} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {app.student_name ? app.student_name[0] : "?"}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-slate-800">{app.student_name}</div>
                        <div className="text-xs text-slate-400">{app.offer_title} · {app.date_applied}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS[app.status]?.badge || "bg-slate-100"}`}>
                        {STATUS[app.status]?.label || app.status}
                      </span>
                    </div>
                  )) : <p className="p-10 text-center text-slate-400 text-sm">No applicants yet.</p>}
                </div>
              </div>

              {/* قسم عروضي */}
              <div className="md:col-span-2 space-y-3">
                <h2 className="font-bold text-slate-800 text-lg">My Offers</h2>
                <div className="space-y-3">
                  {offerStats.length > 0 ? offerStats.map((offer, i) => (
                    <div key={i} className="border border-slate-200 p-4 bg-white rounded-xl shadow-sm hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-slate-800 text-sm leading-tight">{offer.title}</div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${offer.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {offer.active ? 'ACTIVE' : 'CLOSED'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>👥 {offer.applicants_count} applicants</span>
                        <span>📅 {offer.created_at}</span>
                      </div>
                    </div>
                  )) : <p className="p-5 text-center text-slate-400 text-sm italic">No offers posted.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}