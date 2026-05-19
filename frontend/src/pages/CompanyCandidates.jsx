import { useState, useEffect } from "react";
import axios from "axios";
import CompanyLayout from "./CompanyLayout";

const STATUS_CFG = {
  pending:  { badge: "badge-orange", label: "Pending",  icon: "⏳" },
  accepted: { badge: "badge-green",  label: "Accepted", icon: "✅" },
  rejected: { badge: "badge-red",    label: "Rejected", icon: "❌" },
};

function DecisionModal({ candidate, onClose, onDecide }) {
  const [note, setNote] = useState(candidate.note || "");
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const confirm = async () => {
    setLoading(true);
    const success = await onDecide(candidate.id, action, note);
    setLoading(false);
    if (success) setDone(true);
  };

  if (done) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box text-center" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-3">{action === "accepted" ? "🎉" : "📭"}</div>
        <h3 className="font-syne font-bold text-slate-900 text-xl mb-2">
          {action === "accepted" ? "Application Accepted!" : "Application Rejected"}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Decision for <strong>{candidate.student_name}</strong> has been saved.
        </p>
        <button onClick={onClose} className="shimmer-btn text-white px-8 py-2.5 rounded-xl text-sm">Done</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5aaee8] to-[#1A4A8A] flex items-center justify-center text-xl font-bold text-white uppercase">
            {candidate.student_name?.charAt(0)}
          </div>
          <div>
            <h3 className="font-syne font-extrabold text-slate-900 text-xl">{candidate.student_name}</h3>
            <p className="text-sm text-slate-500">{candidate.level} · {candidate.university}</p>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Internal note (optional)</label>
          <textarea rows={2} value={note} onChange={e => setNote(e.target.value)}
            placeholder="Add a reason for your decision..." className="input-field resize-none" />
        </div>

        {!action ? (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setAction("rejected")} className="reject-btn text-white py-3 rounded-xl text-sm font-semibold">✕ Reject</button>
            <button onClick={() => setAction("accepted")} className="accept-btn text-white py-3 rounded-xl text-sm font-semibold">✓ Accept</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`p-3 rounded-xl text-sm border ${action === "accepted" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              Confirm <strong>{action}</strong> for this candidate?
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setAction(null)} className="py-2.5 rounded-xl border border-slate-200 text-sm">Back</button>
              <button onClick={confirm} disabled={loading} className={`${action === "accepted" ? "accept-btn" : "reject-btn"} text-white py-2.5 rounded-xl text-sm font-semibold`}>
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompanyCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
            const res = await axios.get('https://stag-io-lr0s.onrender.com/api/company/applications/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCandidates(res.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDecide = async (id, status, note) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`
        https://stag-io-lr0s.onrender.com/api/applications/${id}/`,
        { status },
        { headers: { Authorization: `Bearer ${token} `} }
      );
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status, note } : c));
      if (selected?.id === id) setSelected(prev => ({ ...prev, status, note }));
      return true;
    } catch (err) {
      alert("Error updating application status.");
      return false;
    }
  };

  const filtered = candidates.filter(c => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchSearch = !search ||
      c.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const pendingCount = candidates.filter(c => c.status === "pending").length;

  if (loading) return (
    <CompanyLayout active="candidates">
      <div className="p-20 text-center animate-pulse text-slate-400 font-syne">Loading your candidates...</div>
    </CompanyLayout>
  );

  return (
    <CompanyLayout active="candidates" pendingCount={pendingCount}>
      <div className="p-5 md:p-8">
        <div className="mb-6">
          <h1 className="font-syne font-extrabold text-slate-900 text-3xl">Candidates Tracking</h1>
          <p className="text-slate-400 text-sm">{candidates.length} total applications</p>
        </div>

        <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 border border-slate-200">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
            <input type="text" placeholder="Search by student name or skill..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="input-field md:w-48">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center text-slate-400 py-10">No applications found.</div>
            ) : filtered.map(c => (
              <div key={c.id} onClick={() => setSelected(c)}
                className={`card p-4 cursor-pointer border transition-all ${selected?.id === c.id ? "border-[#2E7DF7] bg-blue-50/30" : "border-slate-200 hover:border-slate-300"}`}>
                <div className="flex justify-between items-start">
                  <div className="font-bold text-slate-800">{c.student_name}</div>
                  <span className={`badge ${STATUS_CFG[c.status]?.badge}`}>{STATUS_CFG[c.status]?.label}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{c.university} · {c.level}</div>
              </div>
            ))}
          </div>
          <div className="md:col-span-3">
            {selected ? (
              <div className="card p-6 border border-slate-200 sticky top-6">
                <h2 className="font-syne font-bold text-2xl mb-1">{selected.student_name}</h2>
                <p className="text-slate-500 mb-4">{selected.university} - {selected.wilaya}</p>

                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selected.skills?.map(s => <span key={s} className="skill-chip">{s}</span>)}
                  </div>
                </div>

                {selected.status === "pending" ? (
                  <button onClick={() => setModal(selected)} className="shimmer-btn w-full text-white py-3 rounded-xl font-bold">
                    Review Application →
                  </button>
                ) : (
                  <div className={`p-4 rounded-xl font-bold flex items-center gap-2 ${selected.status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {STATUS_CFG[selected.status]?.icon} Status: {STATUS_CFG[selected.status]?.label}
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-20 text-center border-dashed border-2 border-slate-200 text-slate-400">
                Select a candidate to see full details.
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && <DecisionModal candidate={modal} onClose={() => setModal(null)} onDecide={handleDecide} />}
    </CompanyLayout>
  );
}