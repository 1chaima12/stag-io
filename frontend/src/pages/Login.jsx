import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; 

const ROLES = [
  {id:"student", label:"Student",  emoji:"🎓", placeholder:"amira@ifa.edu.dz"},
  {id:"company", label:"Company",  emoji:"🏢", placeholder:"rh@company.com"},
  {id:"admin",   label:"Admin",    emoji:"🏛️", placeholder:"admin@university.dz"},
];

export default function Login() {
  const [role, setRole]         = useState("student");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false); 

  const navigate = useNavigate();
  const cfg = ROLES.find(r => r.id === role);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in your credentials");
      return;
    }

    setLoading(true);
    try {
      // 1. إرسال البيانات إلى Django
      const response = await api.post('login/', {
        username: email, 
        password: password
      });

      // --- الجزء الحاسم للإصلاح (التوافق مع CompanyOffers) ---
      
      // حفظ التوكنز بالأسماء الافتراضية
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // حفظ كائن userData الذي تبحث عنه صفحة العروض
      // نقوم بدمج التوكن داخل الكائن لضمان عمل "userData.access"
      const userDataObj = {
        ...(response.data.user || {}),
        access: response.data.access
      };
      localStorage.setItem('userData', JSON.stringify(userDataObj));
      
      // حفظ بيانات المستخدم العامة
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));

      // ---------------------------------------------------

      // 2. تحديد الدور (Role) وتوجيه المستخدم
      let finalRole = role; 
      try {
        const profileRes = await api.get('profile/');
        if (profileRes.data && profileRes.data.role) {
            finalRole = profileRes.data.role.toLowerCase();
        }
      } catch (err) {
        console.warn("Using manually selected role due to profile fetch error.");
      }

      localStorage.setItem('userRole', finalRole);

      // 3. التوجيه بناءً على الدور
      if (finalRole === "student") navigate("/student/dashboard");
      else if (finalRole === "company") navigate("/company/dashboard");
      else if (finalRole === "admin") navigate("/admin/dashboard");
      else navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error.response);
      const msg = error.response?.data?.detail || "Invalid email or password.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdf9f5]">
      {/* القسم الأيسر - التصميم */}
      <div className="hidden lg:flex lg:w-[52%] bg-slate-900 flex-col relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40"/>
        <div className="relative p-10">
          <Link to="/" className="font-syne font-extrabold text-2xl text-white tracking-tight">
            Stag<span className="text-[#2E7DF7]">.</span>io
          </Link>
        </div>
        <div className="flex-1 flex flex-col justify-center px-12 pb-16 relative">
          <p className="text-xs font-semibold tracking-widest text-[#2E7DF7] uppercase mb-4">Welcome back</p>
          <h1 className="font-syne font-extrabold text-white leading-tight mb-5 text-5xl">
            Your internship<br/>journey starts<br/><span className="text-[#2E7DF7]">right here.</span>
          </h1>
        </div>
      </div>

      {/* القسم الأيمن - نموذج الدخول */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12"></div>
      <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-syne font-extrabold text-slate-900 text-3xl tracking-tight mb-1">Sign in</h2>
            <p className="text-slate-500 text-sm">
              Don't have an account? <Link to="/register" className="text-[#2E7DF7] font-medium hover:underline">Create one →</Link>
            </p>
          </div>
          
          {/* تبديل الأدوار */}
          <div className="bg-slate-100 rounded-xl p-1 flex mb-7">
            {ROLES.map(r => (
              <button 
                key={r.id} 
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  role === r.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span>{r.emoji}</span><span>{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email or Username</label>
              <input 
                type="text" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder={cfg.placeholder} 
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2E7DF7]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#2E7DF7]"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-slate-900 text-white font-semibold py-3 rounded-xl text-sm flex justify-center items-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800 transition-colors'
              }`}
            >
              {loading ? "Signing in..." : "Sign in to Stag.io →"}
            </button>
          </form>
        </div>
      </div>
    
  );
}