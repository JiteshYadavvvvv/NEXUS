import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building, User, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import ClubSelectDropdown from "./ClubSelectDropdown";
import { useAuth } from "@/context/AuthContext";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const AuthSelection = () => {
  const navigate = useNavigate();
  const { user, setUser, authLoading, isAdmin, setIsAdmin, checkAdminAuth } = useAuth();
  const [selectedClub, setSelectedClub] = useState("");
  const [showClubSelect, setShowClubSelect] = useState(false);
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  const [role, setRole] = useState("admin"); // "admin" | "member"
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  
  // OTP State
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Resend Timer Effect
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (authLoading) return;
    if (isAdmin) {
      if (['director', 'principal', 'jd'].includes(user?.role)) {
        navigate('/profile/SuperAdmin', { replace: true });
        return;
      }
      navigate('/profile/Admin', { replace: true });
      return;
    }
    if (user?.year) { navigate(`/profile/${user.year}`, { replace: true }); return; }
  }, [authLoading, user, isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundImage: `url("/background.svg")`, backgroundRepeat: "no-repeat", backgroundPosition: "center top", backgroundSize: "cover" }}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  const handleOrganisationSelect = () => {
    setShowClubSelect(true);
  };

  const handleApplicantSelect = () => {
    navigate("/login", { state: { role: "Applicant" } });
  };

  const handleSuperAdminSelect = () => {
    setShowSuperAdmin(true);
    setStep(1);
    setOtp("");
    setEmail("");
  };

  const handleSuperSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/admin/send-otp`,
        { email },
        { withCredentials: true }
      );

      if (res.data?.success && res.data?.isSuperAdmin) {
        toast.success(res.data.message || "OTP sent");
        setStep(2);
        setResendTimer(60);
      } else if (res.data?.success) {
        toast.error("This email is not registered as a SuperAdmin.");
      } else {
        toast.error(res.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSuperVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/admin/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Login successful! 👌");
        const adminInfo = await checkAdminAuth();
        if (adminInfo) {
          setUser(adminInfo);
          setIsAdmin(true);
        }
        setTimeout(() => navigate("/profile/SuperAdmin"), 1200);
      } else {
        toast.error(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSuperSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      handleSuperSendOtp();
    } else {
      handleSuperVerifyOtp();
    }
  };

  const handleSendOtp = async () => {
    if (!selectedClub) {
      toast.error("Please select an organisation.");
      return;
    }
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/admin/send-otp`,
        {
          email,
          club: selectedClub?.name || selectedClub,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "OTP sent");
        setStep(2);
        setResendTimer(60);
      } else {
        toast.error(res.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/admin/verify-otp`,
        {
          email,
          club: selectedClub?.name || selectedClub,
          otp,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Login successful! 👌");

        const adminInfo = await checkAdminAuth();
        if (adminInfo) {
          setUser(adminInfo);
        }

        if (selectedClub && typeof selectedClub === "object") {
          localStorage.setItem("enteredClub", JSON.stringify(selectedClub));
        }
        setTimeout(() => navigate("/profile/Admin"), 1500);
      } else {
        toast.error(res.data?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      handleSendOtp();
    } else {
      handleVerifyOtp();
    }
  };

  const handleGoogleSuccess = async () => {
    if (!selectedClub) {
      toast.error("Please select an organisation first.");
      return;
    }

    setLoading(true);
    try {
      // result from GoogleAuthButton contains success, user, message
      // the Backend token is already set in cookies by googleAuth context method
      const verifyRes = await axios.post(
        `${API}/api/auth/verify-membership`,
        // Note: verify-membership needs clubId, we assume selectedClub is an object containing _id
        { clubId: selectedClub._id }, 
        { withCredentials: true }
      );

      if (verifyRes.data?.success) {
        if (selectedClub && typeof selectedClub === "object") {
          localStorage.setItem("enteredClub", JSON.stringify(selectedClub));
        }
        toast.success("Membership verified successfully! 👌");
        setTimeout(() => {
          navigate("/profile/Member", { state: { club: selectedClub } });
        }, 1500);
      } else {
        toast.error(verifyRes.data?.message || "User is not a member of this organisation");
        // We might want to clear token here if they are only logging in for this org, 
        // but since this is a global token they just can't access this org.
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to verify membership.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (msg) => {
    toast.error(msg || "Google login failed 🤯");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage: `url("/background.svg")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-8 py-10 relative overflow-visible">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
          onClick={() => {
            if (showSuperAdmin) {
              setShowSuperAdmin(false);
              setStep(1);
              setOtp("");
            } else if (showClubSelect) {
              setShowClubSelect(false);
            } else {
              navigate("/");
            }
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="mb-8 text-center pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            {showSuperAdmin
              ? "SuperAdmin Login"
              : showClubSelect
                ? "Organisation Login"
                : "Choose Your Path"}
          </h1>
          <p className="text-sm text-slate-400 max-w-[280px] mx-auto leading-relaxed">
            {showSuperAdmin
              ? "Director, Joint Director & Principal access"
              : showClubSelect
                ? "Select your organisation and sign in"
                : "Tell us how you want to interact with the Community"}
          </p>
        </div>

        {showSuperAdmin ? (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSuperSubmit} className="space-y-5">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="super-email"
                      className="text-sm font-medium text-slate-300 ml-1"
                    >
                      Email
                    </label>
                    <input
                      id="super-email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="director@ait.edu.in"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Sending…" : "Send OTP"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <label
                        htmlFor="super-otp"
                        className="text-sm font-medium text-slate-300 ml-1"
                      >
                        Enter OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        Change Email
                      </button>
                    </div>
                    <input
                      id="super-otp"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all tracking-widest text-center"
                    />
                  </div>

                  <div className="pt-1 space-y-3">
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Verifying…" : "Verify & Login"}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSuperSendOtp();
                      }}
                      disabled={resendTimer > 0 || loading}
                      className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        ) : !showClubSelect ? (
          <div className="space-y-4"> 
          <button
              onClick={handleSuperAdminSelect}
              className="w-full group relative flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left mt-4"
            >
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-5 w-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white">
                  SuperAdmin
                </h3>
                <p className="text-sm text-slate-400">Director, JD &amp; Principal</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={handleOrganisationSelect}
              className="w-full group relative flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                <Building className="h-5 w-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white">
                  Enter Organisation
                </h3>
                <p className="text-sm text-slate-400">Login as Admin or Member</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
            </button>

            <button
              onClick={handleApplicantSelect}
              className="w-full group relative flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left mt-4"
            >
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                <User className="h-5 w-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white">
                  Become Applicant
                </h3>
                <p className="text-sm text-slate-400">Apply for positions</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
            </button>

           
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleAdminSubmit} className="space-y-5">
              {/* Club Dropdown */}
              <div className="space-y-2 relative z-50">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Organisation
                </label>
                <ClubSelectDropdown
                  selectedClub={selectedClub?.name || selectedClub}
                  onSelect={setSelectedClub}
                />
              </div>

              {/* Role Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Role
                </label>
                <div className="flex rounded-xl border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      role === "admin"
                        ? "bg-white text-black"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("member")}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      role === "member"
                        ? "bg-white text-black"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Member
                  </button>
                </div>
              </div>

              {/* Submit / Auth */}
              {role === "admin" ? (
                <>
                  {step === 1 ? (
                    <>
                      {/* Email */}
                      <div className="space-y-2">
                        <label
                          htmlFor="org-email"
                          className="text-sm font-medium text-slate-300 ml-1"
                        >
                          Email
                        </label>
                        <input
                          id="org-email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="gdg@aitpune.edu.in"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                        />
                      </div>

                      <div className="pt-1">
                        <button
                          type="submit"
                          disabled={loading || !selectedClub}
                          className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Send OTP
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* OTP */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <label
                            htmlFor="org-otp"
                            className="text-sm font-medium text-slate-300 ml-1"
                          >
                            Enter OTP
                          </label>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            Change Email
                          </button>
                        </div>
                        <input
                          id="org-otp"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="6-digit OTP"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all tracking-widest text-center"
                        />
                      </div>
                      
                      <div className="pt-1 space-y-3">
                        <button
                          type="submit"
                          disabled={loading || otp.length !== 6}
                          className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Verify & Login
                        </button>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSendOtp();
                          }}
                          disabled={resendTimer > 0 || loading}
                          className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="pt-4 space-y-4">
                  {selectedClub ? (
                    <GoogleAuthButton
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      label="Login as Member"
                    />
                  ) : (
                    <div className="w-full py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-slate-400 text-sm text-center">
                      Select an organisation to continue
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        )}

        <p className="mt-8 text-xs text-center text-slate-500">
          By proceeding, you agree to Nexus{" "}
          <span className="text-slate-400 cursor-pointer">Terms</span>
        </p>
      </div>
    </div>
  );
};

export default AuthSelection;
