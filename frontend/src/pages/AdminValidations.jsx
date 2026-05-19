import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

const TABS = ["All", "Pending", "Validated", "Agreement generated"];

const STATUS_CFG = {
  pending: { badge: "badge-orange", label: "Pending", icon: "⏳" },
  validated: { badge: "badge-blue", label: "Validated", icon: "✅" },
  agreement_generated: { badge: "badge-green", label: "PDF issued", icon: "📄" },
};

function AgreementModal({ item, onClose, onGenerate }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
      onGenerate(item.id);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box max-w-lg" onClick={e => e.stopPropagation()}>
        {!done ? (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-syne font-extrabold text-slate-900 text-xl">Convention de Stage</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <div className="border border-slate-200 rounded-xl p-5 mb-5 bg-[#fdf9f5] text-sm">
              <p><strong>Company:</strong> {item.name}</p>
              <p><strong>Sector:</strong> {item.sector}</p>
              <p><strong>Email:</strong> {item.email}</p>
            </div>
            <button
              onClick={generate}
              disabled={generating}
              className="shimmer-btn w-full text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              {generating ? "Generating..." : "📄 Generate & Send Convention"}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <h3 className="font-syne font-bold text-xl mb-2">Success!</h3>
            <button onClick={onClose} className="shimmer-btn text-white px-8 py-2.5 rounded-xl block w-full">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminValidations() {
  const [validations, setValidations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState(null);
  const [modal, setModal] = useState(null);

  const fetchValidations = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get("http://127.0.0.1:8000/api/admin/pending-companies/", {
        headers: { Authorization:` Bearer ${token} `} // ✅ إصلاح
      });

      const mapped = res.data.map(c => ({
        ...c,
        id: c.id,
        company: c.name,
        status: c.is_validate ? "validated" : "pending", // ✅ إصلاح: is_validate وليس is_validated
        validated: c.is_validate
      }));

      setValidations(mapped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching validations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchValidations();
  }, []);

  const handleValidate = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
       ` http://127.0.0.1:8000/api/admin/approve-company/${id}/`, // ✅ إصلاح
        {},
        { headers: { Authorization: `Bearer ${token} `} } // ✅ إصلاح
      );

      setValidations(prev => prev.map(v =>
        v.id === id ? { ...v, status: "validated", validated: true } : v
      ));

      if (selected?.id === id) {
        setSelected(prev => ({ ...prev, status: "validated", validated: true }));
      }
    } catch (error) {
      alert("Error validating company. Check permissions.");
    }
  };
  const handleGenerate = (id) => {
    setValidations(prev => prev.map(v =>
      v.id === id ? { ...v, status: "agreement_generated", agreementGenerated: true } : v
    ));
    if (selected?.id === id) {
      setSelected(prev => ({ ...prev, status: "agreement_generated", agreementGenerated: true }));
    }
  };

  const filtered = validations.filter(v => {
    if (tab === "All") return true;
    if (tab === "Pending") return v.status === "pending";
    if (tab === "Validated") return v.status === "validated";
    if (tab === "Agreement generated") return v.status === "agreement_generated";
    return true;
  });

  if (loading) return <div className="p-10 text-center font-syne">Loading Data...</div>;

  return (
    <AdminLayout active="validations" pendingCount={validations.filter(v => v.status === "pending").length}>
      <div className="p-5 md:p-8">

        <div className="mb-6">
          <h1 className="font-syne font-extrabold text-slate-900 text-2xl md:text-3xl">Admin Validations</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and verify new company registrations</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-5">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tab-btn ${tab === t ? "active" : "inactive"}`} // ✅ إصلاح
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-5">
          {/* List */}
          <div className="md:col-span-2 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center text-slate-400 py-10">No results</div>
            ) : filtered.map(v => (
              <div
                key={v.id}
                onClick={() => setSelected(v)}
                className={`card border cursor-pointer p-4 transition-all ${selected?.id === v.id ? "border-[#2E7DF7] bg-soft/30" : "border-slate-200"}`} // ✅ إصلاح
              >
                <div className="flex justify-between items-start">
                  <div className="font-bold text-slate-800">{v.name}</div>
                  <span className={`badge ${STATUS_CFG[v.status]?.badge}`}> 
                    {STATUS_CFG[v.status]?.label}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{v.sector} · {v.email}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="md:col-span-3">
            {selected ? (
              <div className="card border border-slate-200 p-5 sticky top-4">
                <h2 className="font-syne font-bold text-xl mb-4">{selected.name}</h2>
                <div className="space-y-3 mb-6">
                  <div className="bg-slate-50 p-3 rounded-lg text-sm">
                    <p className="text-slate-400">Email:</p>
                    <p className="font-semibold">{selected.email}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm">
                    <p className="text-slate-400">Sector:</p>
                    <p className="font-semibold">{selected.sector}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm">
                    <p className="text-slate-400">Wilaya:</p>
                    <p className="font-semibold">{selected.wilaya}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-sm">
                    <p className="text-slate-400">Status:</p>
                    <p className="font-semibold">{STATUS_CFG[selected.status]?.label}</p>
                  </div>
                </div>{/* Actions */}
                <div className="space-y-2">
                  {selected.status === "pending" && (
                    <button
                      onClick={() => handleValidate(selected.id)}
                      className="shimmer-btn w-full text-white py-3 rounded-xl font-bold"
                    >
                      ✅ Approve & Validate Company
                    </button>
                  )}
                  {selected.status === "validated" && (
                    <button
                      onClick={() => setModal(selected)}
                      className="shimmer-btn w-full text-white py-3 rounded-xl font-bold"
                    >
                      📄 Issue Official Document
                    </button>
                  )}
                  {selected.status === "agreement_generated" && (
                    <div className="text-center text-green-600 font-bold py-3">
                      ✅ Agreement already issued
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card border border-slate-200 p-10 text-center text-slate-400">
                Select a request to view details
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <AgreementModal
          item={modal}
          onClose={() => setModal(null)}
          onGenerate={(id) => {
            handleGenerate(id);
            setTimeout(() => setModal(null), 2000);
          }}
        />
      )}
    </AdminLayout>
  );
}