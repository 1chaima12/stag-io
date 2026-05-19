import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../api";

const WILAYAS = ["All", "Alger", "Oran", "Constantine", "Béjaïa", "Tizi Ouzou", "Blida", "Skikda"];
const LEVELS = ["All", "L1", "L2", "L3", "M1", "M2"];
const STATUSES = ["All", "Placed", "Searching", "Pending"];

const STATUS_CFG = {
  placed: { badge: "badge-green", label: "Placed", dot: "bg-blush" },
  searching: { badge: "badge-orange", label: "Searching", dot: "bg-cream" },
  pending: { badge: "badge-blue", label: "Pending", dot: "bg-soft" },
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wilaya, setWilaya] = useState("All");
  const [level, setLevel] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/students/");
      setStudents(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/admin/students/${id}/`); // ✅ إصلاح template literal
        setStudents(students.filter(s => s.id !== id));
        if (selected?.id === id) setSelected(null);
      } catch (err) {
        alert("Failed to delete student");
      }
    }
  };

  // ✅ إصلاح منطق الفلترة - كان مكسوراً
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const fullName = s.user?.fullname?.toLowerCase() || "";
    const email = s.user?.email?.toLowerCase() || "";

    const matchQ = !q|| fullName.includes(q) || email.includes(q); // ✅ إصلاح: || بدل مسافة
    const matchW = wilaya === "All" || s.wilaya === wilaya;
    const matchL = level === "All" || s.level === level;
    const matchS = status === "All" || STATUS_CFG[s.status]?.label === status;
    
    return matchQ && matchW && matchL && matchS;
  });

  const placedCount = students.filter(s => s.status === "placed").length;
  const searchingCount = students.filter(s => s.status === "searching").length;
  const pendingCount = students.filter(s => s.status === "pending").length;

  if (loading) return (
    <AdminLayout active="students">
      <div className="p-20 text-center font-syne text-slate-400">Loading student database...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout active="students">
      <div className="p-5 md:p-8">

        {/* Header */}
        <div className="anim-fade-up mb-6">
          <p className="text-xs font-semibold text-[#2E7DF7] uppercase tracking-widest mb-1">Students</p>
          <h1 className="font-syne font-extrabold text-slate-900 text-2xl md:text-3xl tracking-tight">Student placements</h1>
          <p className="text-slate-400 text-sm font-light mt-0.5">
            {students.length} registered · {placedCount} placed · {searchingCount} searching
          </p>
        </div>

        {/* ✅ إصلاح هيكل JSX - كان div مغلق في مكان خاطئ */}
        <div className="anim-fade-up anim-d1 grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Placed", value: placedCount, color: "bg-blush border-blush" },
            { label: "Searching", value: searchingCount, color: "bg-cream border-cream" },
            { label: "Pending", value: pendingCount, color: "bg-soft border-soft" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`card border p-3 text-center ${color}`}> {/* ✅ إصلاح */}
              <div className="font-syne font-extrabold text-2xl text-slate-900">{value}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>{/* Filters */}
        <div className="anim-fade-up anim-d2 card border border-slate-200 p-4 mb-5">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <select value={wilaya} onChange={e => setWilaya(e.target.value)} className="input-field md:w-36">
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <select value={level} onChange={e => setLevel(e.target.value)} className="input-field md:w-28">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={status} onChange={e => setStatus(e.target.value)} className="input-field md:w-32">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-5">
          {/* Student list */}
          <div className="md:col-span-3 anim-fade-up anim-d3 space-y-2">
            {filtered.length > 0 ? filtered.map(s => {
              const sc = STATUS_CFG[s.status] || STATUS_CFG.searching;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`card border cursor-pointer transition-all p-4 ${selected?.id === s.id ? "border-[#2E7DF7] bg-soft/30" : "border-slate-200 hover:border-soft"}`} // ✅ إصلاح
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-soft flex items-center justify-center text-sm font-bold text-slate-800 font-syne shrink-0">
                      {s.user?.fullname?.split(" ").map(n => n[0]).join("") || "S"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-800">{s.user?.fullname}</div>
                      <div className="text-xs text-slate-400">{s.university} · {s.wilaya}</div>
                    </div>
                    <span className={`badge ${sc.badge} shrink-0`}>{sc.label}</span> {/* ✅ إصلاح */}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-14">
                <p className="text-sm text-slate-400">No students found.</p>
              </div>
            )}
          </div>

          {/* Student detail */}
          <div className="md:col-span-2 anim-fade-up anim-d3">
            {selected ? (() => {
              const sc = STATUS_CFG[selected.status] || STATUS_CFG.searching;
              return (
                <div className="card border border-slate-200 p-5 sticky top-4">
                  <div className="flex items-start gap-4 mb-5 pb-5 border-b border-slate-100">
                    <div className="w-14 h-14 rounded-2xl bg-soft flex items-center justify-center text-xl font-bold text-slate-900 font-syne shrink-0">
                      {selected.user?.fullname?.split(" ").map(n => n[0]).join("") || "S"}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-syne font-extrabold text-slate-900 text-lg">{selected.user?.fullname}</h2>
                      <p className="text-slate-500 text-sm">{selected.university}</p>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className={`badge ${sc.badge}`}>{sc.label}</span> {/* ✅ إصلاح */}
                        <span className="badge badge-slate">📍 {selected.wilaya}</span>
                      </div>
                    </div>
                  </div><div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Email</span>
                      <span className="font-medium text-slate-700">{selected.user?.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">University</span>
                      <span className="font-medium text-slate-700">{selected.university}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Wilaya</span>
                      <span className="font-medium text-slate-700">{selected.wilaya}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Skills</span>
                      <span className="font-medium text-slate-700">{selected.skills?.join(", ") || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      Delete Student
                    </button>
                    {selected.digital_cv && (
                      <a
                        href={selected.digital_cv}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-[#2E7DF7] text-white text-center rounded-lg text-sm font-bold hover:opacity-90"
                      >
                        View CV
                      </a>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="card border border-slate-200 p-10 text-center">
                <p className="text-sm text-slate-400">Select a student to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}