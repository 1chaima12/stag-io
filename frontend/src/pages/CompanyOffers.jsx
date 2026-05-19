import { useState, useEffect } from "react";
import axios from "axios";
import CompanyLayout from "./CompanyLayout";

const WILAYAS = ["Alger", "Oran", "Constantine", "Annaba", "Béjaïa", "Tizi Ouzou", "Blida", "Sétif", "Tlemcen", "Batna"];
const TYPES = ["On-site", "Remote", "Hybrid"];
const ALL_SKILLS = ["React", "Vue", "Angular", "Node.js", "Express", "Django", "Python", "Java", "Flutter", "SQL", "Docker"];

const EMPTY_FORM = {
    title: "",
    description: "",
    wilaya: "Alger",
    internship_type: "On-site", 
    skills: [],
    is_active: true,
};

// --- مكون النافذة المنبثقة (Modal) لإضافة أو تعديل عرض ---
function OfferModal({ offer, onClose, onSave }) {
    const [form, setForm] = useState(offer ? { ...offer } : { ...EMPTY_FORM });
    
    const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const toggleSkill = s => {
        const skills = form.skills_required || [];
        upd("skills_required", skills.includes(s) ? skills.filter(x => x !== s) : [...skills, s]);
    };
    
    const isEdit = !!offer?.id;
    // التحقق من صحة البيانات قبل تفعيل زر الحفظ
    const valid = form.title.trim().length > 2 && form.description.trim().length > 10;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-900 text-xl">{isEdit ? "Edit Offer" : "Post New Offer"}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title *</label>
                        <input value={form.title} onChange={e => upd("title", e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-olive-500 outline-none" placeholder="e.g. Frontend Developer" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description * (Min 10 chars)</label>
                        <textarea rows={4} value={form.description} onChange={e => upd("description", e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-olive-500 outline-none" placeholder="Describe the internship details..." />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Wilaya</label>
                            <select value={form.wilaya} onChange={e => upd("wilaya", e.target.value)} className="w-full p-2.5 border rounded-lg outline-none">
                                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                            <select value={form.internship_type} onChange={e => upd("internship_type", e.target.value)} className="w-full p-2.5 border rounded-lg outline-none">
                                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Skills Required</label>
                        <div className="flex flex-wrap gap-1.5">
                            {ALL_SKILLS.map(s => (
                                <button key={s} onClick={() => toggleSkill(s)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${form.skills_required?.includes(s) ? "bg-olive-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold">Cancel</button>
                        <button 
                            disabled={!valid} 
                            onClick={() => onSave(form)} 
                            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all ${valid ? "bg-olive-600 hover:bg-olive-700 active:scale-95" : "bg-slate-300 cursor-not-allowed"}`}
                        >
                            {isEdit ? "Save Changes" : "Post Offer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- المكون الرئيسي ---
export default function CompanyOffers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [delModal, setDelModal] = useState(null);

    const API_URL = "https://stag-io-lr0s.onrender.com/api/offers/";

    // دالة جلب الهيدرز مع التوكن الصحيح
    const getHeaders = () => {
    // نبحث في كل الأسماء المحتملة التي قد يكون التوكن مخزناً بها
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData.access || localStorage.getItem("accessToken");

    if (!token) {
        console.error("لم يتم العثور على توكن! يجب تسجيل الدخول.");
        return {};
    }

    return {
        headers: {
            'Authorization':` Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};
   const fetchOffers = async () => {
    try {
        // جلب البيانات الخام للتأكد
        const rawData = localStorage.getItem("userData");
        console.log("بيانات المستخدم في التخزين:", rawData);

        if (!rawData) {
            alert("لا توجد بيانات دخول، يرجى تسجيل الدخول أولاً");
            return;
        }

        const userData = JSON.parse(rawData);
        const token = userData.access; // تأكد أن المفتاح هو access

        const res = await axios.get("https://stag-io-lr0s.onrender.com/api/offers/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setOffers(res.data);
    } catch (err) {
        console.error("Fetch error details:", err.response);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchOffers();
    }, []);

   const handleSave = async (form) => {
    try {
        const config = getHeaders(); // جلب التوكن
        if (form.id) {
            await axios.put(`${API_URL}${form.id}/`, form, config);
        } else {
            // تأكد من تمرير config كبارامتر ثالث هنا
            await axios.post(API_URL, form, config); 
        }
        setModal(null);
        fetchOffers(); // تحديث القائمة
    } catch (err) {
        alert("خطأ في الصلاحيات: يرجى تسجيل الدخول مجدداً");
    }
};

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}${delModal.id}/`, getHeaders());
            setOffers(prev => prev.filter(o => o.id !== delModal.id));
            setDelModal(null);
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <CompanyLayout active="offers">
            <div className="p-5 md:p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Manage Offers</h1>
                        <p className="text-slate-400 text-sm">{offers.length} offers posted by your company</p>
                    </div>
                    <button 
                        onClick={() => setModal("create")} 
                        className="bg-olive-600 hover:bg-olive-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                        + Post Offer
                    </button>
                </div>
                <div className="grid gap-4">
                    {loading ? (
                        <div className="text-center py-20 text-slate-400">Loading your offers...</div>
                    ) : offers.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
                            No offers found. Start by posting your first internship!
                        </div>
                    ) : (
                        offers.map(offer => (
                            <div key={offer.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{offer.title}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{offer.wilaya} • {offer.internship_type}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setModal(offer)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">Edit</button>
                                    <button onClick={() => setDelModal(offer)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">🗑</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {modal && <OfferModal offer={modal === "create" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

            {delModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
                        <h3 className="font-bold text-lg mb-2">Delete Offer?</h3>
                        <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete "{delModal.title}"?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDelModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </CompanyLayout>
    );
}