import { useState, useRef, useEffect } from "react";
import CompanyLayout from "./CompanyLayout";
import axios from "axios";

const API = "http://stag-io-lr0s.onrender.com/api";

const WILAYAS = ["Alger","Oran","Constantine","Annaba","Béjaïa","Tizi Ouzou","Blida","Sétif","Tlemcen","Batna","Bordj Bou Arréridj","Boumerdès","Tipaza","Médéa","Djelfa"];
const SECTORS = ["Technology","Telecommunications","Energy & Oil","Banking & Finance","Healthcare","Education","Manufacturing","Retail","Consulting","Transport & Logistics","Media","Agriculture"];

const EMPTY = {
  name: "", email: "", phone: "", website: "", linkedin: "",
  wilaya: "", address: "", sector: "", size: "", founded: "",
  description: "", logo: null, logo_url: null,
};

export default function CompanyProfile() {
  const [profile,     setProfile]     = useState(EMPTY);
  const [draft,       setDraft]       = useState(EMPTY);
  const [editing,     setEditing]     = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile,    setLogoFile]    = useState(null);
  const logoRef = useRef();

  // جلب بيانات الشركة من الـ Backend
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios.get(`${API}/company/profile/`, {
      headers: { Authorization: `Bearer ${token} `}
    })
      .then(res => {
        setProfile(res.data);
        setDraft(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load company profile.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    return () => { if (logoPreview) URL.revokeObjectURL(logoPreview); };
  }, [logoPreview]);

  const upd = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  const startEdit = () => { setDraft({ ...profile }); setEditing(true); setSaved(false); };

  const cancel = () => {
    setEditing(false);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setLogoFile(null);
  };

  const save = async () => {
    setSaving(true);
    const token = localStorage.getItem("access_token");
    try {
      const formData = new FormData();
      Object.entries(draft).forEach(([k, v]) => {
        if (k === "logo" || k === "logo_url") return;
        if (v !== null && v !== undefined) formData.append(k, v);
      });
      if (logoFile) formData.append("logo", logoFile);

      const res = await axios.patch(`${API}/company/profile/`, formData, {
        headers: {
          Authorization:` Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(res.data);
      setEditing(false);
      setSaved(true);
      setLogoPreview(null);
      setLogoFile(null);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogo = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Image files only."); return; }
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));
    setLogoFile(file);
  };

  const displayLogo = logoPreview || profile.logo_url;

  const completion = () => {
    const p = editing ? draft : profile;
    let s = 0;
    if (p.name) s += 20; if (p.description) s += 20; if (p.wilaya) s += 15;
    if (displayLogo) s += 15; if (p.website) s += 10; if (p.phone) s += 10; if (p.sector) s += 10;
    return s;
  };

const Field = ({ label, k, placeholder, type = "text", note }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}{note && <span className="text-blue-400 normal-case font-normal ml-1">· {note}</span>}
    </label>
    {editing
      ? <input type={type} value={draft[k] || ""} onChange={e => upd(k, e.target.value)}
          placeholder={placeholder} className="input-field" />
      : <p className="text-sm text-slate-700 font-medium py-2 px-3 bg-slate-50 rounded-lg min-h-[38px] flex items-center">
          {profile[k] || <span className="text-slate-400 italic">Not set</span>}
        </p>
    }
  </div>
);

  if (loading) return (
    <CompanyLayout active="profile">
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm animate-pulse">Loading profile...</div>
      </div>
    </CompanyLayout>
  );

  return (
    <CompanyLayout active="profile">
      <div className="p-5 md:p-8 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-1">Company</p>
            <h1 className="font-syne font-extrabold text-slate-900 text-2xl md:text-3xl tracking-tight">Company profile</h1>
            <p className="text-slate-400 text-sm font-light mt-0.5">Visible to students browsing your offers</p>
          </div>
          <div className="flex gap-2 items-center">
            {saved && <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">✓ Saved!</span>}
            {error && <span className="text-xs text-red-500">{error}</span>}
            {!editing
              ? <button onClick={startEdit} className="shimmer-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl">Edit profile</button>
              : <>
                  <button onClick={cancel} className="text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={save} disabled={saving} className="shimmer-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-50">
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </>
            }
          </div>
        </div>

        {/* Profile header card */}
        <div className="card p-5 mb-5">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className="relative shrink-0">
              <div
                onClick={() => editing && logoRef.current.click()}
                className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center overflow-hidden ${
                  displayLogo ? "border-slate-200" : "border-dashed border-slate-300 bg-slate-50"
                } ${editing ? "cursor-pointer hover:border-blue-400 transition-colors" : ""}`}
              >
                {displayLogo
                  ? <img src={displayLogo} alt="logo" className="w-full h-full object-cover" />
                  : <span className="text-3xl">🏢</span>
                }
              </div>
              {editing && (
                <button onClick={() => logoRef.current.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xs shadow-sm hover:bg-slate-50">
                  📷
                </button>
              )}
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => handleLogo(e.target.files[0])} />
            </div>

            <div className="flex-1">
              <h2 className="font-syne font-extrabold text-slate-900 text-xl">{profile.name || "Your Company"}</h2>
              <p className="text-slate-500 text-sm">{profile.sector} {`profile.size && · ${profile.size}`}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.wilaya && <span className="badge badge-blue">📍 {profile.wilaya}</span>}
                {profile.website && <span className="badge badge-slate">🌐 {profile.website}</span>}
                {profile.founded && <span className="badge badge-slate">📅 Founded {profile.founded}</span>}
              </div>
            </div>

            <div className="md:text-right shrink-0">
              <div className="font-syne font-extrabold text-3xl text-blue-600">{completion()}%</div>
              <div className="text-xs text-slate-400 mb-2">Profile complete</div>
              <div className="h-2 w-28 bg-slate-100 rounded-full overflow-hidden ml-auto">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width:` ${completion()}% `}} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">

          {/* Description */}
          <div className="card p-5">
            <h3 className="font-syne font-bold text-slate-800 text-base mb-1">Company description</h3>
            <p className="text-xs text-slate-400 mb-3">Shown to students on your offer pages</p>
            {editing
              ? <textarea rows={5} value={draft.description || ""} onChange={e => upd("description", e.target.value)}
                  placeholder="Describe your company..." className="input-field resize-none" />
              : <p className="text-sm text-slate-600 font-light leading-relaxed">
                  {profile.description || <span className="text-slate-400 italic">Not set</span>}
                </p>
            }
          </div>

          {/* Location & Contact */}
          <div className="card p-5">
            <h3 className="font-syne font-bold text-slate-800 text-base mb-4">Location & contact</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Wilaya</label>
                {editing
                  ? <select value={draft.wilaya || ""} onChange={e => upd("wilaya", e.target.value)} className="input-field">
                      <option value="">Select wilaya</option>
                      {WILAYAS.map(w => <option key={w}>{w}</option>)}
                    </select>
                  : <p className="text-sm text-slate-700 font-medium py-2 px-3 bg-slate-50 rounded-lg flex items-center min-h-[38px]">
                      {profile.wilaya || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                }
              </div>
              <Field label="Full address" k="address" placeholder="Street, district, city" />
              <Field label="Phone"        k="phone"   placeholder="+213 21 00 00 00" />
              <Field label="Email"        k="email"   placeholder="rh@company.com" type="email" />
              <Field label="Website"      k="website" placeholder="www.company.com" />
              <Field label="LinkedIn"     k="linkedin" placeholder="linkedin.com/company/name" />
            </div>
          </div>

          {/* Company Info */}
          <div className="card p-5">
            <h3 className="font-syne font-bold text-slate-800 text-base mb-4">Company information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Company name" k="name" placeholder="Company name" />
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Sector</label>
                {editing
                  ? <select value={draft.sector || ""} onChange={e => upd("sector", e.target.value)} className="input-field">
                  <option value="">Select sector</option>
                      {SECTORS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  : <p className="text-sm text-slate-700 font-medium py-2 px-3 bg-slate-50 rounded-lg flex items-center min-h-[38px]">
                      {profile.sector || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                }
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Company size</label>
                {editing
                  ? <select value={draft.size || ""} onChange={e => upd("size", e.target.value)} className="input-field">
                      <option value="">Select size</option>
                      {["1–10 employees","11–50 employees","51–200 employees","201–500 employees","500+ employees"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  : <p className="text-sm text-slate-700 font-medium py-2 px-3 bg-slate-50 rounded-lg flex items-center min-h-[38px]">
                      {profile.size || <span className="text-slate-400 italic">Not set</span>}
                    </p>
                }
              </div>
              <Field label="Founded year" k="founded" placeholder="2010" />
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}