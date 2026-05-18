import { useState, useEffect } from "react";
import StudentLayout from "./StudentLayout";
import api from "../api";
import axios from "axios";

const WILAYAS = ["All", "Alger", "Oran", "Constantine", "Annaba", "Béjaïa", "Tizi Ouzou", "Blida", "Sétif", "Tlemcen", "Batna"];
const TYPES = ["All", "On-site", "Remote", "Hybrid"];

function OfferCard({ offer, onApply }) {
  return (
    <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">{offer.title}</h3>
          <p className="text-sm text-gray-500 font-medium">{offer.company_name || "Company"}</p>
        </div>
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">NEW</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-medium">{offer.wilaya}</span>
        <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-medium">{offer.type}</span>
      </div>

      <button
        onClick={() => onApply(offer)}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all transform active:scale-95"
      >
        View Details & Apply
      </button>
    </div>
  );
}

function ApplyModal({ offer, onClose }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
const handleApply = async (offerID) => {
    try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.access;

        // إرسال العرض والرسالة فقط، السيرفر سيعرف الطالب من الـ Token
        const payload = {
            offer: offer.id,
            message: note
        };

        await axios.post("http://127.0.0.1:8000/api/applications/", payload, {
            headers: { Authorization:` Bearer ${token}` }
        });

        setStep(2); // الانتقال لشاشة النجاح فوراً
    } catch (err) {
        console.error(err.response?.data);
        alert("خطأ: " + JSON.stringify(err.response?.data));
    }
};



   
  
 


  
      

        // 🔥 ملاحظة: تأكد أن السيرفر يعيد حقل اسمه student_id أو id الخاص ببروفايل الطالب
     

        // 1. جلب البروفايل (الآن سيحتوي على student_id بفضل التعديل أعلاه)
        
    


  if (!offer) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
        {step === 1 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">{offer.title}</h2>
              <p className="text-gray-500 text-sm mt-1">Apply for an internship at {offer.company_name}</p>
            </div>

            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter / Note</label>
            <textarea
              placeholder="Tell them why you are the best fit..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-200 p-4 rounded-2xl h-40 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
            />
            <div className="flex gap-3 mt-8">
              <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg shadow-blue-200"
              >
                {loading ? "Sending..." : "Submit Application"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
            <h2 className="text-2xl font-black text-gray-900">Application Sent!</h2>
            <p className="text-gray-500 mt-2 px-4">Your request has been successfully submitted to the company.</p>
            <button onClick={onClose} className="mt-8 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all">
              Awesome, thanks!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentSearch() {
  const [offers, setOffers] = useState([]);
  const [applying, setApplying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get("offers/");
        setOffers(res.data);
      } catch (err) {
        console.error("Offers error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <StudentLayout active="search">
      <div className="max-w-6xl mx-auto p-6 lg:p-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Find Internships</h1>
          <p className="text-gray-500 font-medium">Explore and apply for the latest opportunities</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-bold">Loading opportunities...</p>
          </div>
        ) : offers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} onApply={setApplying} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg font-bold">No applications found at the moment</p>
          </div>
        )}
      </div>

      {applying && <ApplyModal offer={applying} onClose={() => setApplying(null)} />}
    </StudentLayout>
  );
}