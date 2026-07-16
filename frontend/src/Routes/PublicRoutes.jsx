import React from "react";
import MainContent from "../components/MainContent";
import Login from "../pages/Auth/Login";
import Clubs from "../components/Clubs/Clubs";
import SignUp from "@/pages/Auth/SignUp";
// [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
// VerifyAccount is the OTP email-verification page used after email/password
// registration. It is unreachable while email/password auth is disabled.
// To re-enable: uncomment the import and the route below.
// import VerifyAccount from "@/pages/Auth/VerifyAccount";
import AuthSelection from "@/pages/Auth/AuthSelection";
import EventsPage from "@/pages/Events";
import Developers from "../pages/Developers";


export const publicRoutes = [
  { path: "/", element: <MainContent /> },
  { path: "/clubs", element: <Clubs /> },
  { path: "/get-started", element: <AuthSelection /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
  // [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
  // { path: "/verify-account", element: <VerifyAccount /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/developers", element: <Developers /> },
];
