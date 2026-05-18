import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public
import Landing      from "./pages/Landing";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import NotFound     from "./pages/NotFound";

// Student
import StudentDashboard   from "./pages/StudentDashboard";
import StudentSearch      from "./pages/StudentSearch";
import StudentApplications from "./pages/StudentApplications";
import StudentProfile     from "./pages/StudentProfile";
//company
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyOffers from "./pages/CompanyOffers";
import CompanyCandidates from "./pages/CompanyCandidates";

//admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminCompanies from "./pages/AdminCompanies";
import AdminValidations from "./pages/AdminValidations";
import AdminStudent from "./pages/AdminStudent";
import AdminAgreements from "./pages/AdminAgreements";


export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        {/* ── Public ── */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Student ── */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard"    element={<StudentDashboard />} />
        <Route path="/student/search"       element={<StudentSearch />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/profile"      element={<StudentProfile />} />
     {/*company*/}

  <Route path="/company" element={<Navigate to="/company/dashboard" replace />} />
    <Route path="/company/dashboard"    element={<CompanyDashboard/>} />
      <Route path="/company/profile"    element={<CompanyProfile />} />
        <Route path="/company/offers"    element={<CompanyOffers />} />
        <Route path="/company/candidates"    element={<CompanyCandidates />} />
       {/*Admin*/}
       <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
<Route path="/admin/dashboard"    element={<AdminDashboard/>} />
<Route path="/admin/companies"    element={<AdminCompanies/>} />
<Route path="/admin/validations"    element={<AdminValidations/>} />
<Route path="/admin/students"    element={<AdminStudent/>} />
<Route path="/admin/agreements" element={<AdminAgreements />} />
        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}