import { useState, useEffect } from "react";

// ── Tailwind custom config injected via style tag ──
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    * { box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; }
    .font-syne { font-family: 'Syne', sans-serif; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes float2 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-7px); }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.85); }
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slide-in-right {
      from { opacity: 0; transform: translateX(32px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    .animate-float  { animation: float  3.5s ease-in-out infinite; }
    .animate-float2 { animation: float2 4.2s ease-in-out infinite; }
    .animate-pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

    .anim-fade-up  { animation: fade-up .65s ease both; }
    .anim-delay-1  { animation-delay: .1s; }
    .anim-delay-2  { animation-delay: .22s; }
    .anim-delay-3  { animation-delay: .36s; }
    .anim-delay-4  { animation-delay: .50s; }

    .anim-slide-right { animation: slide-in-right .7s ease both; }

    .dot-grid {
      background-image: radial-gradient(circle, #2E7DF720 1.2px, transparent 1.2px);
      background-size: 22px 22px;
    }

    .card-hover {
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
    }
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 36px rgba(46,125,247,0.12);
      border-color: #2E7DF7 !important;
    }

    .nav-blur {
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .shimmer-btn {
      background: linear-gradient(90deg, #1A4A8A 0%, #2E7DF7 40%, #1A4A8A 80%);
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
  `}</style>
);

// ── Reusable Components ──
const Tag = ({ children, green }) => (
  <span
    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      green
        ? "bg-emerald-50 text-emerald-600"
        : "bg-blue-50 text-blue-600"
    }`}
  >
    {children}
  </span>
);

const NavLink = ({ children, href = "#" }) => (
  <a
    href={href}
    className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors duration-200"
  >
    {children}
  </a>
);

// ── Main Component ──

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${
            scrolled
              ? "bg-white/90 border-b border-slate-200 shadow-sm"
              : "bg-white/70"
          }`}
        >
          <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="font-syne font-extrabold text-xl text-slate-900 tracking-tight">
              Stag<span className="text-blue-500">.</span>io
            </a>
            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8 list-none">
              <li><NavLink href="#how">How it works</NavLink></li>
              <li><NavLink href="#roles">For whom</NavLink></li>
              <li><NavLink href="#features">Features</NavLink></li>
            </ul>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/login"
                className="text-sm font-medium text-slate-600 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
              >
                Sign in
              </a>
              <a
                href="/register"
                className="shimmer-btn text-sm font-medium text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-blue-200 hover:shadow-md transition-shadow duration-200"
              >
                Get started →
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col gap-4">
              {`["How it works", "For whom", "Features"].map(l => (
                <a key={l} href="#" className="text-sm font-medium text-slate-600">{l}</a>
              ))`}
              <hr className="border-slate-100" />
              <a href="/login"    className="text-sm font-medium text-slate-600">Sign in</a>
              <a href="/register" className="shimmer-btn text-sm font-medium text-white text-center py-2.5 rounded-lg">Get started</a>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section className="min-h-screen flex items-center pt-16 pb-12 px-5 md:px-8 relative overflow-hidden">
          {/* bg layers */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/40 to-white" />
            <div className="absolute right-0 top-0 w-1/2 h-full dot-grid opacity-60" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute top-24 right-1/4 w-48 h-48 bg-sky-100/50 rounded-full blur-2xl" />
          </div>

          <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center relative">

            {/* Left */}
            <div>
              {/* Badge */}
              <div className="anim-fade-up inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1.5 mb-6">
                <span className="animate-pulse-dot w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span className="text-xs font-semibold text-blue-700 tracking-wide">University — Enterprise Link · 2025–2026</span>
              </div>

              <h1 className="anim-fade-up anim-delay-1 font-syne font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-5"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
                Your internship,<br />
                <span className="text-blue-500">matched</span> perfectly.
              </h1>
              <p className="anim-fade-up anim-delay-2 text-slate-500 font-light leading-relaxed mb-8 max-w-md"
                style={{ fontSize: "1.05rem" }}>
                Stag.io connects students with companies through smart skill-based matching —
                and automates the entire internship agreement process for universities.
              </p>

              <div className="anim-fade-up anim-delay-3 flex flex-wrap gap-3 items-center">
                <a
                  href="/register"
                  className="shimmer-btn text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-blue-300 hover:shadow-lg transition-all duration-200 text-sm"
                >
                  Find your internship →
                </a>
                <a
                  href="#how"
                  className="text-sm font-medium text-slate-600 px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                >
                  See how it works
                </a>
              </div>

              <p className="anim-fade-up anim-delay-4 mt-5 text-xs text-slate-400">
                Free for students · <span className="text-emerald-500 font-medium">No sign-up fees</span> · Backed by MESRS
              </p>
            </div>

            {/* Right — card visual */}
            <div className="anim-slide-right relative flex justify-center items-center">
              <div className="relative w-72 md:w-80">

                {/* Back cards */}
                <div className="absolute top-4 left-6 w-64 h-48 bg-blue-50 border border-blue-100 rounded-2xl rotate-3 opacity-70" />
                <div className="absolute top-2 right-4 w-64 h-48 bg-emerald-50 border border-emerald-100 rounded-2xl -rotate-2 opacity-60" />

                {/* Main offer card */}
                <div className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-xl z-10 animate-float">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg">🏢</div>
                    <div>
                      <div className="font-syne font-bold text-sm text-slate-800">Sonatrach Digital</div>
                      <div className="text-xs text-slate-400">Alger, Algérie</div>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">New</span>
                  </div>
                  <div className="font-semibold text-slate-800 text-sm mb-2">Full-Stack Web Developer</div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {["React", "Node.js", "PostgreSQL"].map(t => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">6 months · On-site</span>
                    <button className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Apply</button>
                  </div>
                </div>

                {/* Float badge 1 */}
                <div className="animate-float2 absolute -top-4 -right-6 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 z-20">
                  <span className="text-base">✅</span>
                  <span className="text-xs font-semibold text-slate-700">Agreement generated</span>
                </div>

                {/* Float badge 2 */}
                <div className="animate-float absolute -bottom-4 -left-6 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 z-20"
                style={{ animationDelay: "1.8s" }}>
                  <span className="text-base">🎯</span>
                  <span className="text-xs font-semibold text-slate-700">12 matches found</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── STATS BAR ── */}
        <div className="bg-slate-900 py-10 px-5 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "1,200+", label: "Students placed" },
              { num: "340+",   label: "Partner companies" },
              { num: "98%",    label: "Agreement automation" },
              { num: "48h",    label: "Avg. matching time" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-syne font-extrabold text-2xl md:text-3xl text-white mb-1">
                  {num.includes("+") ? (
                    <>{num.replace("+", "")}<span className="text-blue-400">+</span></>
                  ) : num.includes("%") ? (
                    <>{num.replace("%", "")}<span className="text-blue-400">%</span></>
                  ) : (
                    <>{num}</>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="py-20 px-5 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">Process</p>
              <h2 className="font-syne font-extrabold text-slate-900 tracking-tight mb-3"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                Three steps to your internship
              </h2>
              <p className="text-slate-500 font-light leading-relaxed max-w-md">
                No more paperwork, no more waiting. From profile to signed agreement — all in one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  icon: "👤",
                  title: "Build your profile",
                  desc: "Create your digital CV, tag your technical skills (React, Python, Java...) and link your GitHub or portfolio.",
                  color: "bg-blue-50 border-blue-100",
                  numColor: "text-blue-200",
                },
                {
                  num: "02",
                  icon: "🔍",
                  title: "Get matched",
                  desc: "Browse offers filtered by Wilaya, tech stack and internship type. Apply to companies with one click.",
                  color: "bg-slate-50 border-slate-200",
                  numColor: "text-slate-200",
                },
                {
                  num: "03",
                  icon: "📄",
                  title: "Sign & start",
                  desc: "Once accepted, the university validates and your internship agreement (Convention de Stage) is auto-generated in PDF.",
                  color: "bg-emerald-50 border-emerald-100",
                  numColor: "text-emerald-200",
                },
              ].map(({ num, icon, title, desc, color, numColor }) => (
                <div
                  key={num}
                  className={`card-hover relative p-6 rounded-2xl border ${color} overflow-hidden`}
                >
                  <div className={`font-syne font-extrabold text-7xl absolute -top-2 -right-1 ${numColor} select-none`}>{num}</div>
                  <div className="text-3xl mb-4">{icon}</div>
                  <h3 className="font-syne font-bold text-slate-800 text-lg mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-light">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR WHOM ── */}
        <section id="roles" className="py-20 px-5 md:px-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">Roles</p>
              <h2 className="font-syne font-extrabold text-slate-900 tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                Built for everyone in the process
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  role: "Students",
                  emoji: "🎓",
                  bg: "bg-blue-600",
                  items: [
                    "Create a skill-tagged digital CV",
                    "Search & filter internship offers",
                    "Apply with one click",
                    "Track application status",
                  ],
                  cta: "Sign up as student",
                  href: "/register/student",
                },
                {
                  role: "Companies",
                  emoji: "🏢",
                  bg: "bg-slate-800",
                  items: [
                    "Publish & manage internship offers",
                    "Browse matching student profiles",
                    "Accept or decline applicants",
                    "Dashboard for candidate tracking",
                  ],
                  cta: "Sign up as recruiter",
                  href: "/register/company",
                },
                {
                  role: "Administration",
                  emoji: "🏛️",
                  bg: "bg-emerald-600",
                  items: [
                    "Validate internship agreements",
                    "Auto-generate PDFs (Convention de Stage)",
                    "Track student placements",
                    "Global placement statistics",
                  ],
                  cta: "Admin access",
                  href: "/admin/login",
                },
              ].map(({ role, emoji, bg, items, cta, href }) => (
                <div key={role} className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover">
                  <div className={`${bg} px-6 py-5 flex items-center gap-3`}>
                    <span className="text-3xl">{emoji}</span>
                    <h3 className="font-syne font-bold text-white text-xl">{role}</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3 mb-6">
                      {items.map(item => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <span className="text-blue-400 mt-0.5 shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={href}
                      className={`block text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 ${
                        bg === "bg-blue-600"
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                          : bg === "bg-slate-800"
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-800 hover:text-white"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {cta} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>{/* ── FEATURES ── */}
        <section id="features" className="py-20 px-5 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-2">Features</p>
              <h2 className="font-syne font-extrabold text-slate-900 tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}>
                Everything in one place
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { icon: "⚡", title: "Skill-based matching",   desc: "Tag your stack, get offers that actually fit your skills." },
                { icon: "📋", title: "PDF auto-generation",    desc: "Convention de Stage generated instantly after validation." },
                { icon: "📊", title: "Admin dashboard",        desc: "Real-time statistics on student placements across departments." },
                { icon: "🔔", title: "Live notifications",     desc: "Instant alerts on application status changes." },
                { icon: "🔍", title: "Advanced filters",       desc: "Filter by Wilaya, domain, duration, or tech stack." },
                { icon: "🔒", title: "Secure JWT auth",        desc: "Role-based access for students, companies, and admins." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card-hover p-5 rounded-xl border border-slate-200 flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-xl">{icon}</div>
                  <div>
                    <div className="font-syne font-bold text-slate-800 text-sm mb-1">{title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed font-light">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-20 px-5 md:px-8 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-syne font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Ready to find your perfect<br />
              <span className="text-blue-400">internship match?</span>
            </h2>
            <p className="text-slate-400 font-light mb-8 text-base leading-relaxed">
              Join thousands of students who landed their internship through Stag.io.
              It's free, fast, and built for Algerian universities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/register"
                className="shimmer-btn text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-blue-900 transition-shadow text-sm"
              >
                Create your account →
              </a>
              <a
                href="#how"
                className="text-sm font-medium text-slate-300 border border-slate-700 px-8 py-3.5 rounded-xl hover:border-slate-500 hover:text-white transition-all duration-200"
              >
                Learn more
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-slate-950 py-10 px-5 md:px-8 border-t border-slate-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-syne font-extrabold text-lg text-white">
              Stag<span className="text-blue-400">.</span>io
            </div>
            <p className="text-xs text-slate-500">
              © 2025–2026 · 
            </p>
            <div className="flex gap-5 text-xs text-slate-500">
              <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms-of-service" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}