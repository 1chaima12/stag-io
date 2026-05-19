import { useState, useRef, useEffect } from "react";
import StudentLayout from "./StudentLayout";
import api from "../api";

const ALL_SKILLS = [
  "React", "Node.js", "Django", "Python", "Java", "SQL", "Git", "Docker", "Figma", "Tailwind CSS", "FastAPI", "MongoDB"
];

export default function StudentProfile() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    university: "",
    wilaya: "",
    bio: "",
    skills: [],
    role: "student",
    digitalCV: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // جلب البيانات من السيرفر
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('profile/');
        const data = response.data;
        const nameParts = data.fullname ? data.fullname.split(" ") : ["", ""];

        const userData = {
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          university: data.student_details?.university || "",
          wilaya: data.student_details?.wilaya || "",
          bio: data.bio || "",
          skills: data.skills || [],
          digitalCV: data.student_details?.digital_cv
            ? { name: "My_Resume.pdf", size: "View PDF" }
            : null
        };
        setProfile(userData);
        setDraft(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleSkill = (skill) => {
    if (!isEditing) return;
    setDraft(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setDraft(prev => ({
        ...prev,
        newFile: file,
        digitalCV: { name: file.name, size: (file.size / 1024).toFixed(0) + " KB" }
      }));
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  // ✅ الإصلاح الرئيسي: template literal صحيح + await داخل try
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('fullname', `${draft.firstName} ${draft.lastName}`); // ✅ إصلاح
      formData.append('university', draft.university || "");
      formData.append('wilaya', draft.wilaya || "");

      if (draft.newFile) {
        formData.append('digital_cv', draft.newFile);
      }

      await api.put('profile/', formData, { // ✅ await داخل try
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(draft);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.log("error response:", error.response?.data);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;

  const currentData = isEditing ? draft : profile;

  return (
    <StudentLayout active="profile">
      <div className="max-w-4xl mx-auto p-6 md:p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Profile</h1>
            <p className="text-slate-500">Update your information for companies to see</p>
          </div>
          {!isEditing ? (
            <button onClick={() => { setDraft(profile); setIsEditing(true); }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-8">

          {/* Section 1: Basic Info */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-lg">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span> Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 block">First Name</label>
                <input
                  name="firstName"
                  disabled={!isEditing}
                  value={currentData.firstName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 block">Last Name</label>
                <input
                  name="lastName"
                  disabled={!isEditing}
                  value={currentData.lastName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 block">University</label>
                <input
                  name="university"
                  disabled={!isEditing}
                  value={currentData.university}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase mb-2 block">Wilaya</label>
                <input
                  name="wilaya"
                  disabled={!isEditing}
                  value={currentData.wilaya}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Skills */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 mb-4 text-lg">My Skills</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SKILLS.map(skill => {
                const isSelected = currentData.skills.includes(skill);
                if (!isEditing && !isSelected) return null;return (
                  <button
                    key={skill}
                    disabled={!isEditing}
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                        : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    {skill} {isEditing && (isSelected ? "✕" : "+")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: CV Upload ✅ إصلاح هيكل JSX */}
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="font-black text-xl mb-2">Digital CV (PDF)</h3>
                <p className="text-slate-400 text-sm max-w-sm">Upload your latest PDF resume.</p>
              </div>
              <div className="w-full md:w-auto">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
                {currentData.digitalCV ? (
                  <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
                    <span className="text-2xl">📄</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold truncate w-32">{currentData.digitalCV.name}</p>
                      <p className="text-[10px] text-slate-500">{currentData.digitalCV.size}</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="text-blue-400 text-[10px] font-black uppercase"
                      >
                        Change
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    disabled={!isEditing}
                    onClick={() => fileInputRef.current.click()}
                    className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                      isEditing ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    + Upload PDF
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </StudentLayout>
  );
}