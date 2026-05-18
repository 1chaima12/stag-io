import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; // تأكد من استيراد ملف axios الخاص بك

const ROLES = [
  {id:"student",label:"Student",emoji:"🎓",desc:"Find & apply to internships",sel:"border-[#2E7DF7] bg-soft"},
  {id:"company",label:"Company",emoji:"🏢",desc:"Post offers & hire interns",sel:"border-slate-700 bg-slate-100"},
  {id:"admin",  label:"Admin",  emoji:"🏛️",desc:"Manage & validate placements",sel:"border-[#9b4a42] bg-blush/50"},
];

export default function Register() {
  const [step, setStep]       = useState(1);
  const [role, setRole]       = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]       = useState({fullname:"", email:"", password:""});
  const [companyDoc, setCompanyDoc] = useState(null); 
  const [dragOver] = useState(false);
  const [loading, setLoading]   = useState(false); // حالة التحميل

  
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  // Validation Logic
  const validName  = form.fullname.trim().split(" ").filter(Boolean).length >= 2;
  const validEmail = role === "student"
    ? /^[^\s@]+@[^\s@]+\.(dz|edu\.dz|edu)$/i.test(form.email)
    : form.email.includes("@") && form.email.includes(".");
  const validPass  = form.password.length >= 8;
  const validDoc   = role !== "company" || companyDoc !== null;
  const canSubmit  = validName && validEmail && validPass && validDoc;

  const handleDoc = (file) => {
    if (!file) return;
    const allowed = ["application/pdf","image/jpeg","image/png","image/jpg"];
    if (!allowed.includes(file.type)) { alert("Please upload a PDF or image file."); return; }
    if (file.size > 10 * 1024 * 1024)  { alert("File too large. Max 10 MB."); return; }
    // نخزن الملف الحقيقي للإرسال وليس فقط الاسم والحجم
    setCompanyDoc(file); 
  };

  // --- دالة إرسال البيانات لـ Django ---
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    
    // استخدام FormData لأننا قد نرسل ملف (وثيقة الشركة)
    const formData = new FormData();
    formData.append("username", form.email); // الإيميل هو اسم المستخدم
    formData.append("email", form.email);
    formData.append("fullname", form.fullname);
    formData.append("password", form.password);
    formData.append("role", role);
    
    if (role === "company" && companyDoc) {
      formData.append("verification_doc", companyDoc);
    }

    try {
      await api.post('register/', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStep(3); // الانتقال لصفحة النجاح
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      alert(error.response?.data?.email || "Registration failed. Email might be already in use.");
    } finally {
      setLoading(false);
    }
  };

  
  
  
  const btnCls = role==="company" ? "shimmer-btn-dark" : role==="admin" ? "shimmer-btn-green" : "shimmer-btn";

  return (
    <div className="min-h-screen bg-[#fdf9f5] flex overflow-hidden">
      
      {/* Left panel - التصميم كما هو */}
      <div className="hidden lg:flex lg:w-[44%] bg-slate-900 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40"/>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-soft/20 rounded-full blur-3xl"/>
        <div className="relative p-10">
          <Link to="/" className="font-syne font-extrabold text-2xl text-white tracking-tight">Stag<span className="text-soft">.</span>io</Link>
          </div>
        <div className="relative px-12 pb-4">
          <p className="text-xs font-semibold tracking-widest text-soft uppercase mb-3">Join the platform</p>
          <h2 className="font-syne font-extrabold text-white leading-tight mb-4" style={{fontSize:"clamp(1.8rem,3vw,2.6rem)",letterSpacing:"-1px"}}>
            Start your<br/>internship story<br/><span className="text-soft">today.</span>
          </h2>
          <div className="mt-10 space-y-4">
            {[{n:"01",t:"Choose your role",d:"Student, Company or Admin"},{n:"02",t:"Fill in your details",d:"Name, email, password"},{n:"03",t:"Start matching",d:"Find or post internships"}].map((s,i)=>(
              <div key={i} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-syne font-bold transition-all ${
                  (step===1&&i===0)||(step===2&&i===1)||(step===3&&i===2)?"bg-soft text-slate-900":step>i+1?"bg-blush text-slate-800":"bg-white/10 text-slate-400"
                }`}>{step>i+1?"✓":s.n}</div>
                <div>
                  <div className="text-sm font-semibold text-white">{s.t}</div>
                  <div className="text-xs text-slate-500">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative px-12 pb-8">
          <p className="text-xs text-slate-600">© 2025–2026 · IFA · L3TI Atelier</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-14 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* STEP 1 — Role Selection */}
          {step === 1 && (
            <div className="anim-fade-up">
              <h2 className="font-syne font-extrabold text-slate-900 text-3xl tracking-tight mb-1">Create an account</h2>
              <p className="text-slate-500 text-sm font-light mb-8">Already have one? <Link to="/login" className="text-[#2E7DF7] font-medium hover:underline">Sign in →</Link></p>
              <p className="text-sm font-semibold text-slate-700 mb-4">I am a…</p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {ROLES.map(r => (
                  <div key={r.id} onClick={() => setRole(r.id)}
                    className={`cursor-pointer border-2 rounded-2xl p-5 text-center transition-all ${role===r.id?r.sel:"border-slate-200 bg-white hover:border-slate-300"}`}>
                    <div className="text-3xl mb-2">{r.emoji}</div>
                    <div className="font-syne font-bold text-slate-800 text-sm mb-1">{r.label}</div>
                  </div>
                ))}
              </div>
              <button disabled={!role} onClick={() => setStep(2)}
                className={`w-full text-white font-semibold py-3 rounded-xl text-sm transition-all ${role?btnCls:"bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                Continue as {role || "..."} →
              </button>
            </div>
          )}

          {/* STEP 2 — Form Fields */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="anim-fade-up space-y-5">
              <button type="button" onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-slate-600 font-medium mb-6 flex items-center gap-1 transition-colors">← Back</button>
              <h2 className="font-syne font-extrabold text-slate-900 text-3xl tracking-tight mb-1">Your details</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name <span className="text-rose">*</span></label>
                <input required className="input-field" placeholder="Full Name" value={form.fullname} onChange={e => upd("fullname", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address <span className="text-rose">*</span></label>
                <input required type="email" className="input-field" placeholder="email@example.com" value={form.email} onChange={e => upd("email", e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password <span className="text-rose">*</span></label>
                <div className="relative">
                  <input required type={showPass?"text":"password"} className="input-field pr-11" value={form.password} onChange={e => upd("password", e.target.value)} />
                  <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{showPass?"🙈":"👁️"}</button>
                </div>
              </div>

              {role === "company" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification document <span className="text-rose">*</span></label>
                  <div
                    onClick={() => document.getElementById("docInput").click()}
                    className={`upload-zone ${companyDoc ? "filled" : ""} ${dragOver ? "drag" : ""}`}
                  >
                    {companyDoc ? <p className="text-xs font-bold text-[#9b4a42]">{companyDoc.name}</p> : <p className="text-xs text-slate-400">Click to upload document (RC/NIF)</p>}
                  </div>
                  <input id="docInput" type="file" className="hidden" onChange={e => handleDoc(e.target.files[0])}/>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!canSubmit || loading}
                className={`w-full text-white font-semibold py-3 rounded-xl text-sm transition-all ${canSubmit && !loading ? btnCls : "bg-slate-200 cursor-not-allowed"}`}
              >
                {loading ? "Creating Account..." : "Create my account →"}
              </button>
            </form>
          )}

          {/* STEP 3 — Success Screen */}
          {step === 3 && (
            <div className="anim-scale-in text-center py-8">
              <div className="w-20 h-20 bg-blush rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                {role === "company" ? "⏳" : "🎉"}
              </div>
              <h2 className="font-syne font-extrabold text-slate-900 text-3xl tracking-tight mb-3">
                {role === "company" ? "Review Pending" : "Welcome aboard!"}
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                {role === "company" 
                  ? "Admin will review your documents. You'll be notified via email soon."
                  : "Account created successfully. You can now sign in."}
              </p>
              <Link to="/login" className={`block w-full text-white font-semibold py-3 rounded-xl text-sm text-center ${btnCls}`}>Go to sign in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}