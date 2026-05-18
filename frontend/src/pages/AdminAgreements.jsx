import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";

export default function AdminAgreements() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    const fetchAccepted = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://127.0.0.1:8000/api/admin/accepted-applications/', {
          headers: { Authorization:` Bearer ${token}` }
        });
        setApplications(res.data || []);
        // فلتر الطلبات المقبولة فقط
        const accepted = res.data.filter(a => a.status === 'accepted'|| a.status=== 'Accepted');
        setApplications(accepted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccepted();
  }, []);

  const handleGenerate = async (id) => {
    setGenerating(id);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(
       ` http://127.0.0.1:8000/api/admin/generate-agreement/${id}/`,
        {
          headers: { Authorization:` Bearer ${token} `},
          responseType: 'blob'
        }
      );
      // تحميل الـ PDF
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `agreement_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Error generating PDF");
    } finally {
      setGenerating(null);
    }
  };

  if (loading) return (
    <AdminLayout active="agreements">
      <div className="p-20 text-center animate-pulse text-slate-400 font-syne">Loading...</div>
    </AdminLayout>
  );

  return (
    <AdminLayout active="agreements">
      <div className="p-5 md:p-8">
        <div className="mb-6">
          <h1 className="font-syne font-extrabold text-slate-900 text-3xl">Internship Agreements</h1>
          <p className="text-slate-400 text-sm mt-1">Generate Convention de Stage PDF for accepted students</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center text-slate-400 py-20">No accepted applications yet.</div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="card border border-slate-200 p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{app.student_name}</div>
                  <div className="text-sm text-slate-500">{app.university} · {app.wilaya}</div>
                </div>
                <button
                  onClick={() => handleGenerate(app.id)}
                  disabled={generating === app.id}
                  className="shimmer-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
                >
                  {generating === app.id ? "Generating..." : "📄 Generate PDF"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}