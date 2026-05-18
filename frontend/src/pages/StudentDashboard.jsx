import React from "react";
import { Link } from "react-router-dom";
import StudentLayout from "./StudentLayout";

// --- بيانات تجريبية (Mock Data) ---
const RECENT_OFFERS = [
  { 
    id: 1, 
    title: "Full-Stack Developer", 
    company: "Sonatrach Digital", 
    location: "Alger", 
    skills: ["React", "Node.js"], 
    type: "On-site", 
    duration: "6 months", 
    new: true 
  },
  { 
    id: 2, 
    title: "Backend Engineer", 
    company: "Djezzy Tech", 
    location: "Alger", 
    skills: ["Python", "Django"], 
    type: "Hybrid", 
    duration: "4 months", 
    new: true 
  },
  { 
    id: 3, 
    title: "Mobile Dev (Flutter)", 
    company: "Cevital Digital", 
    location: "Béjaïa", 
    skills: ["Flutter", "Firebase"], 
    type: "Remote", 
    duration: "3 months", 
    new: false 
  },
];

const APPLICATIONS = [
  { company: "Mobilis IT", role: "Frontend Dev", date: "May 02", status: "pending" },
  { company: "Ooredoo Labs", role: "Data Analyst", date: "Apr 28", status: "accepted" },
  { company: "BNA Digital", role: "Backend Intern", date: "Apr 20", status: "refused" },
];

const STATS = [
  { label: "Applications", value: "7", icon: "📤", color: "bg-blue-50 border-blue-100" },
  { label: "Profile Views", value: "34", icon: "👁️", color: "bg-indigo-50 border-indigo-100" },
  { label: "Matches", value: "12", icon: "🎯", color: "bg-emerald-50 border-emerald-100" },
  { label: "Interviews", value: "1", icon: "🗓️", color: "bg-amber-50 border-amber-100" },
];

const statusMap = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
  accepted: { label: "Accepted", cls: "bg-green-100 text-green-700" },
  refused: { label: "Refused", cls: "bg-rose-100 text-rose-700" },
};

export default function StudentDashboard() {
  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-700">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Student Portal</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hello, Ayoub! 👋</h1>
            <p className="text-slate-500 font-medium mt-1">L3 Informatique · University of Constantine 2</p>
          </div>
          <Link 
            to="/student/search" 
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-blue-600 transition-all flex items-center gap-2 group"
          >
            Explore Internships 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, i) => (
            <div key={i} className={`p-6 rounded-[2.5rem] border ${stat.color} transition-all hover:shadow-md`}>
              <div className="text-3xl mb-4">{stat.icon}</div>
              <div className="text-3xl font-black text-slate-900 leading-none">{stat.value}</div>
              <div className="text-[11px] font-black text-slate-500 uppercase mt-3 tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* --- Left Column: Recommended Offers --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recommended for you</h2>
              <Link to="/student/search" className="text-sm font-bold text-blue-600 hover:underline">View all</Link>
              </div>
            
            <div className="grid gap-4">
              {RECENT_OFFERS.map(offer => (
                <div key={offer.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-50 transition-colors">🏢</div>
                      <div>
                        <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors leading-tight">{offer.title}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-tighter">{offer.company} • {offer.location}</p>
                      </div>
                    </div>
                    {offer.new && <span className="bg-green-100 text-green-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">New</span>}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {offer.skills.map(s => (
                      <span key={s} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">{s}</span>
                    ))}
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">{offer.type}</span>
                  </div>

                  {/* ✅ زر View Details يعمل الآن وينقلك لصفحة البحث */}
                  <Link 
                    to="/student/search" 
                    className="block w-full text-center py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest"
                  >
                    View Details & Apply
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* --- Right Column: Sidebar --- */}
          <div className="space-y-8">
            
            {/* Quick Status Section */}
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-6 px-2">Applications Status</h2>
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
                {APPLICATIONS.map((app, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-800 text-sm mb-1 leading-none">{app.company}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{app.role}</p>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter ${statusMap[app.status].cls}`}>
                      {statusMap[app.status].label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Profile CTA Section */}
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
              <div className="text-3xl mb-4">✨</div>
              <h4 className="font-black text-xl mb-2 leading-tight">Complete your profile!</h4>
              <p className="text-blue-100 text-xs leading-relaxed mb-6">
                Students who upload their <b>PDF CV</b> and <b>GitHub</b> link get noticed by top companies 3x faster.
              </p>
              <Link 
                to="/student/profile" 
                className="inline-block w-full text-center bg-white text-blue-600 px-6 py-4 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest"
              >
                Go to Profile
              </Link>
            </div>
            </div>
        </div>
      </div>
    </StudentLayout>
  );
}