import React from "react";
import MainContent from "../components/MainContent";
import Login from "../pages/Auth/Login";
import Clubs from "../components/Clubs/Clubs";
import SignUp from "@/pages/Auth/SignUp";
import VerifyAccount from "@/pages/Auth/VerifyAccount";
import AuthSelection from "@/pages/Auth/AuthSelection";
import EventsPage from "@/pages/Events";


export const publicRoutes = [
  { path: "/", element: <MainContent /> },
  { path: "/clubs", element: <Clubs /> },
  { path: "/get-started", element: <AuthSelection /> },
  {path : "/signup", element : <SignUp/>},
  { path: "/login", element: <Login /> },
  { path: "/verify-account", element: <VerifyAccount /> },
  { path: "/events", element: <EventsPage /> },
];
