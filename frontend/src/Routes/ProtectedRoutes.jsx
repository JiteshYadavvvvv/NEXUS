import React from "react";
import TePanel from "@/pages/Profile/Te profile/TePanel";
import FePanel from "@/pages/Profile/FE Profile/FePanel";
import SePanel from "@/pages/Profile/SE profile/SePanel";
import MyForms from "@/pages/Forms/MyForms";
import FillForm from "@/pages/Forms/FillForm";
import ResponseDashboard from "@/pages/response/Dashboard";
import SubmissionDetails from "@/pages/response/SubmissionDetails";
import DashboardSidebarLayout from "@/components/DashboardSidebarLayout";


export const protectedRoutes = [
  { path: "/profile/TE", element: <TePanel /> },
  { path: "/profile/SE", element: <SePanel /> },
  { path: "/profile/FE", element: <FePanel /> },
  { path: "/my-forms", element: <DashboardSidebarLayout><MyForms /></DashboardSidebarLayout> },
  { path: "/forms/:formId", element: <FillForm /> },
  { path: "/response", element: <DashboardSidebarLayout><ResponseDashboard /></DashboardSidebarLayout> },
  { path: "/response/:id", element: <DashboardSidebarLayout><SubmissionDetails /></DashboardSidebarLayout> },
];
