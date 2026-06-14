import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AdminPanel from "@/pages/Profile/organisations/Admin/adminpanel";
import ApplicantPanel from "@/pages/Profile/Applicant/applicantpanel";
import MemberPanel from "@/pages/Profile/organisations/Member/memberPanel";
import SuperAdminPanel from "@/pages/Profile/SuperAdmin/SuperAdminPanel";
import MyForms from "@/pages/Forms/MyForms";
import FillForm from "@/pages/Forms/FillForm";
import ResponseDashboard from "@/pages/response/Dashboard";
import { useAuth } from "@/context/AuthContext";

import { ProfileProvider } from "@/pages/Profile/Shared/ProfileContext";
import SharedDashboardLayout from "@/pages/Profile/Shared/DashboardLayout";
const adminData = { profile: { clubs: [] }, members: [], tasks: [], messages: [], notifications: [] };

const AdminRoute = ({ children }) => (
  <ProfileProvider initialData={adminData} role="Admin">
    <SharedDashboardLayout>{children}</SharedDashboardLayout>
  </ProfileProvider>
);

const MemberRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const selectedClub = location.state?.club || (() => {
    try {
      const saved = localStorage.getItem("enteredClub");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const memberClubs = (user?.clubs || []).map((club) => ({
    id: club._id,
    _id: club._id,
    name: club.name,
    abbr: club.abbr || club.name?.substring(0, 3).toUpperCase(),
    logo: club.logo || club.img || "/clubprofiles/ns.png",
    role: "Member"
  }));

  const resolvedSelectedClub = selectedClub
    ? memberClubs.find((club) => club.id === selectedClub.id || club._id === selectedClub._id || club.name === selectedClub.name)
    : memberClubs[0] || null;

  const initialData = {
    profile: { clubs: resolvedSelectedClub ? [resolvedSelectedClub] : memberClubs },
    members: [],
    tasks: [],
    messages: [],
    notifications: []
  };

  return (
    <ProfileProvider initialData={initialData} role="Member">
      <SharedDashboardLayout>{children}</SharedDashboardLayout>
    </ProfileProvider>
  );
};

const ResponseRedirect = () => {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? "/admin/responses" : "/member/responses"} replace />;
};

export const protectedRoutes = [
  { path: "/profile/Admin", element: <AdminPanel /> },
  { path: "/profile/Member", element: <MemberPanel /> },
  { path: "/profile/Applicant", element: <ApplicantPanel /> },
  { path: "/profile/SuperAdmin", element: <SuperAdminPanel /> },

  { path: "/my-forms", element: <AdminRoute><MyForms /></AdminRoute> },
  { path: "/response", element: <ResponseRedirect /> },
  { path: "/admin/responses", element: <AdminRoute><ResponseDashboard viewerRole="admin" /></AdminRoute> },
  { path: "/admin/responses/:formId", element: <AdminRoute><ResponseDashboard viewerRole="admin" /></AdminRoute> },
  { path: "/member/responses", element: <MemberRoute><ResponseDashboard viewerRole="member" /></MemberRoute> },
  { path: "/member/responses/:formId", element: <MemberRoute><ResponseDashboard viewerRole="member" /></MemberRoute> },


  { path: "/forms/:formId", element: <FillForm /> },
];
