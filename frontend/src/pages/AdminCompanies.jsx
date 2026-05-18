import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../api"; 

const SECTORS = ["All", "Technology", "Energy & Oil", "Telecommunications", "Banking & Finance", "Manufacturing"];

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  // 1. جلب البيانات من الباكيند
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/pending-companies/");
        // التأكد من أن البيانات مصفوفة لتجنب خطأ filter
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setCompanies(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching companies:", err);
        // معالجة خطأ 403 Forbidden الذي ظهر في صورك
        setError(err.response?.status === 403 ? "Access Denied: Admin only" : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // 2. منطق الفلترة (تم تصحيح الأقواس هنا)
  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    const name = c.name?.toLowerCase() || "";
    const email = c.email?.toLowerCase() || "";
    const wilaya = c.wilaya?.toLowerCase() || "";
    
    const matchQ =!q||name.includes(q)|| !q || email.includes(q) || wilaya.includes(q);
    const matchS = sector === "All" || c.sector === sector;
    
    return matchQ && matchS;
  });

  return (
    <AdminLayout active="companies">
      <div className="p-5 md:p-8">

        {/* Header */}
        <div className="anim-fade-up mb-6">
          <p className="text-xs font-semibold text-[#2E7DF7] uppercase tracking-widest mb-1">Registered</p>
          <h1 className="font-syne font-extrabold text-slate-900 text-2xl md:text-3xl tracking-tight">Companies</h1>
        </div>

        {/* Filters */}
        <div className="anim-fade-up anim-d1 card border border-slate-200 p-4 mb-5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input type="text" placeholder="Search..." value={search}
                onChange={e => setSearch(e.target.value)} className="input-field pl-9 w-full" />
            </div>
            <select value={sector} onChange={e => setSector(e.target.value)} className="input-field md:w-48">
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 font-syne">Loading Database...</div>
        ) : error ? (
          <div className="card border border-red-100 bg-red-50 p-6 text-center text-red-600">{error}</div>
        ) : (
          <div className="grid md:grid-cols-5 gap-5">

            {/* Companies List - الجزء الذي كان يحتوي على الخطأ في صورتك */}
            <div className="md:col-span-3 space-y-2">
              {filtered.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setSelected(c)}
                  className={`card border cursor-pointer transition-all p-4 ${
                    selected?.id === c.id ? "border-[#2E7DF7] bg-blue-50/20" : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">🏢</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-syne font-bold text-slate-800 text-sm truncate">{c.name}</div>
                      <div className="text-xs text-slate-400">{c.sector} · {c.wilaya}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-slate-800">{c.accepted_count || 0} accepted</div>
                      <div className="text-xs text-slate-400">{c.offers_count || 0} offers</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail View */}
            <div className="md:col-span-2">
              {selected ? (
                <div className="card border border-slate-200 p-5 sticky top-4">
                  <h2 className="font-syne font-extrabold text-slate-900 text-xl mb-4">{selected.name}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-slate-700">{selected.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Wilaya</span><span className="text-slate-700">{selected.wilaya}</span></div>
                  </div>
                </div>
              ) : (
                <div className="card border border-dashed border-slate-300 p-10 text-center text-slate-400">
                  Select a company to view details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}