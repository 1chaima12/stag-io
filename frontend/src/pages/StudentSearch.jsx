import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentLayout from "./StudentLayout";

const API_BASE_URL = "https://stag-io-lr0s.onrender.com/api";

const TYPES = ["All", "On-site", "Hybrid", "Remote"];
const LOCATIONS = ["All", "Alger", "Béjaïa", "Oran", "Constantine"];

function OfferModal({ offer, onClose, onApply, applied }) {
  if (!offer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 text-2xl font-black">✕</button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl">🏢</div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{offer.title}</h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter mt-1">
              {offer.company_name ||offer.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">{offer.type}</span>
          <span className="text-xs font-bold text-purple-500 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">⏱ {offer.duration}</span>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">About the role</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{offer.description}</p>
        </div>

        <button
          onClick={() => onApply(offer.id)}
          disabled={applied}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
            applied
              ? "bg-green-100 text-green-600 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-blue-600 shadow-lg"
          }`}
        >
          {applied ? "✓ Application Sent!" : "Apply Now →"}
        </button>
      </div>
    </div>
  );
}

export default function StudentSearch() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [appliedOffers, setAppliedOffers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get(`${API_BASE_URL}/offers/`, { headers });
        setOffers(res.data);

        // debug: شوف القيم الحقيقية
        if (res.data.length > 0) {
          console.log("type:", res.data[0].type, "| wilaya:", res.data[0].wilaya);
        }

        const appRes = await axios.get(`${API_BASE_URL}/applications/`, { headers });
        setAppliedOffers(appRes.data.map(app => app.offer?.id || app.offer));

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (offerId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${API_BASE_URL}/applications/`,
        { offer: offerId },
        { headers: { Authorization:` Bearer ${token} `} }
        );
      setAppliedOffers(prev => [...prev, offerId]);
      setSelectedOffer(null);
      alert("Success! Your application reached the company.");
    } catch (err) {
      console.error("Apply error:", err.response?.data);
      alert("Error: Make sure you are logged in as a student.");
    }
  };

  const filtered = offers.filter(offer => {
    const matchSearch =
      offer.title.toLowerCase().includes(search.toLowerCase()) ||
      (offer.company_name?.toLowerCase() || "").includes(search.toLowerCase());

    // ✅ مقارنة بدون case sensitivity
    const matchType =
      typeFilter === "All" ||
      offer.type?.toLowerCase() === typeFilter.toLowerCase();

    // ✅ wilaya بدون case sensitivity
    const matchLocation =
      locationFilter === "All" ||
      offer.wilaya?.toLowerCase() === locationFilter.toLowerCase();

    return matchSearch && matchType && matchLocation;
  });

  return (
    <StudentLayout>
      <OfferModal
        offer={selectedOffer}
        onClose={() => setSelectedOffer(null)}
        onApply={handleApply}
        applied={selectedOffer && appliedOffers.includes(selectedOffer.id)}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Live from Server</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Available Internships 🔍</h1>
          <p className="text-slate-500 font-medium mt-1">{filtered.length} real-time offers</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by title or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:border-blue-400"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2">🔍</span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all border ${
                typeFilter === t ? "bg-slate-900 text-white" : "bg-white text-slate-500 border-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="px-4 py-2 rounded-xl text-xs font-black border border-slate-200 bg-white"
          >
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Offers */}
        {loading ? (
          <div className="text-center py-20 font-black text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 font-black text-slate-400">No offers found</div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(offer => (
              <div key={offer.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-50">🏢</div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{offer.title}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                        {offer.company_name || offer.location}
                      </p>
                    </div>
                  </div>
                  {appliedOffers.includes(offer.id) && (
                    <span className="bg-blue-100 text-blue-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase">✓ Applied</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black text-slate-400">💰 {offer.salary || "N/A"} · ⏰ {offer.deadline}</p>
                  <button
                    onClick={() => setSelectedOffer(offer)}
                    className="px-6 py-3 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all uppercase"
                  >
                    {appliedOffers.includes(offer.id) ? "View Application" : "View & Apply →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}