import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import GoogleAuthButton from "@/components/GoogleAuthButton";

const YEAR_OPTIONS = ["FE", "SE", "TE", "BE"];
const BRANCH_OPTIONS = ["COMP", "IT", "ENTC", "MECH", "ARE"];

// ─── Google Profile Setup Step ───────────────────────────────────
const GoogleProfileSetup = ({ onSubmit, loading }) => {
  const [setupName, setSetupName] = useState("");
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [number, setNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [regnNo, setRegnNo] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!setupName.trim() || !regnNo || !year) return;
    onSubmit({
      name: setupName.trim(),
      bio: bio.trim(),
      hobbies: hobbies.trim(),
      number: Number(number),
      branch: branch.trim(),
      regnNo: Number(regnNo),
      year
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold tracking-tight">One last step!</h2>
        <p className="mt-2 text-sm text-slate-400">
          Complete your profile to get started
        </p>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">
          Full Name
        </label>
        <input
          type="text"
          required
          disabled={loading}
          placeholder="Nishant Singh"
          value={setupName}
          onChange={(e) => setSetupName(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">
          Bio
        </label>
        <input
          type="text"
          disabled={loading}
          placeholder="Tell us tum kitne chod ho..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50"
        />
      </div>

      {/* Hobbies */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">
          Hobbies
        </label>
        <input
          type="text"
          disabled={loading}
          placeholder="Run , run n run ..."
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50"
        />
      </div>

      {/* Number */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">
          Phone Number
        </label>
        <input
          type="number"
          disabled={loading}
          placeholder="e.g. 9876543210"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Branch */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">
          Branch
        </label>
        <select
          disabled={loading}
          placeholder="e.g. COMP, IT, ENTC"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50 [&>option]:text-black"
        >
          <option value="" disabled>
            Select branch
          </option>
          {BRANCH_OPTIONS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Registration Number */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">
          Registration Number
          <span className="ml-2 text-[11px] font-normal text-slate-500">
            — Required
          </span>
        </label>
        <input
          type="number"
          required
          disabled={loading}
          placeholder="e.g. 260001"
          value={regnNo}
          onChange={(e) => setRegnNo(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Year */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-900 dark:text-gray-200">
          Year
          <span className="ml-2 text-[11px] font-normal text-slate-500">
            — Required
          </span>
        </label>
        <select
          required
          disabled={loading}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all disabled:opacity-50 [&>option]:text-black"
        >
          <option value="" disabled>
            Select year
          </option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || !setupName.trim() || !regnNo || !year}
        className="w-full mt-4 py-3 rounded-xl bg-[#D4AF37]/90 hover:bg-[#D4AF37] text-slate-950 text-sm font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all transform hover:-translate-y-0.5 disabled:bg-white/5 disabled:text-gray-500 disabled:shadow-none disabled:transform-none disabled:pointer-events-none border border-[#D4AF37]/20 disabled:border-transparent"
      >
        {loading ? "Saving..." : "Finish Setup"}
      </button>
    </form>
  );
};

// ─── Main SignUp Component ───────────────────────────────────────
const SignUp = () => {
  const location = useLocation();

  // [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
  // These state vars were used by the email/password registration form.
  // To re-enable: uncomment these, restore handleSubmit, signUp from useAuth,
  // and add the form JSX back in the "form" step below.
  //
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [year, setYear] = useState("");

  // For the Google → profile setup flow
  const [step, setStep] = useState("form"); // "form" | "profile-setup"
  const [googleUser, setGoogleUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  // signUp removed — email/password registration is disabled
  const { updateUserInfo } = useAuth();

  // When arriving from Login page with an incomplete Google account,
  // skip the form and go straight to profile setup.
  useEffect(() => {
    if (location.state?.fromLogin) {
      setStep("profile-setup");
    }
  }, [location.state?.fromLogin]);

  // [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
  // handleSubmit called signUp(name, email, password, year) → POST /api/auth/register
  // then redirected to /verify-account for OTP verification.
  //
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await toast.promise(
  //     async () => {
  //       const res = await signUp(name, email, password, year);
  //       if (!res.success) throw new Error(res.message || "Registration failed");
  //       return res;
  //     },
  //     {
  //       pending: "Registering...",
  //       success: {
  //         render({ data }) {
  //           setTimeout(() => navigate("/verify-account", { state: { email } }), 2000);
  //           return data.message || "Registered successfully! 👌";
  //         },
  //       },
  //       error: { render({ data }) { return data.message || "Registration failed 🤯"; } },
  //     }
  //   );
  // };

  // ── Google sign-up success ──
  const handleGoogleSuccess = (result) => {
    const user = result.user;
    if (user?.year) {
      toast.success("Signed up with Google! 👌");
      setTimeout(() => navigate(user.role === "member" ? "/profile/Member" : "/profile/Applicant"), 1500);
    } else {
      setGoogleUser(user);
      setStep("profile-setup");
    }
  };

  const handleGoogleError = (msg) => {
    toast.error(msg || "Google signup failed 🤯");
  };

  // ── Profile setup submit after Google signup ──
  const handleProfileSetup = async ({ name, regnNo, bio, hobbies, number, branch, year }) => {
    setSaving(true);
    try {
      const result = await updateUserInfo({ name, regnNo, bio, hobbies, number, branch, year });
      if (result.success) {
        toast.success(`Welcome aboard, ${name}! 🎉`);
        setTimeout(() => navigate(result.user?.role === "member" ? "/profile/Member" : "/profile/Applicant"), 1500);
      } else {
        toast.error(result.message || "Failed to save profile");
      }
    } catch (err) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
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
      <div className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl px-8 py-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
        {step === "form" && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        {step === "profile-setup" ? (
          // ── Google Profile Setup Screen ──
          <div className="pt-2">
            <GoogleProfileSetup onSubmit={handleProfileSetup} loading={saving} />
          </div>
        ) : (
          // ── Sign-up Screen (Google only) ──
          <>
            {/* Header */}
            <div className="mb-8 text-center pt-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Sign up with your Google account
              </p>
            </div>

            {/*
              [EMAIL/PASSWORD AUTH — INTENTIONALLY DISABLED]
              The registration form (name, email, password, year, submit) has been
              removed. Applicants must register via Google.
              To re-enable: restore name/email/password/year state, handleSubmit,
              signUp from useAuth, and add the form element here:

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label ...>Full Name</label>
                  <input type="text" required value={name} onChange={...} />
                </div>
                <div className="space-y-1">
                  <label ...>Email address</label>
                  <input type="email" required value={email} onChange={...} />
                </div>
                <div className="space-y-1">
                  <label ...>Password</label>
                  <input type="password" required value={password} onChange={...} />
                </div>
                <div className="space-y-1">
                  <label ...>Year</label>
                  <select required value={year} onChange={...}>...</select>
                </div>
                <button type="submit" ...>Sign Up</button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-700/60" />
                <span className="text-xs text-slate-500 select-none">or</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>
            */}

            {/* Google Auth */}
            <GoogleAuthButton
              label="Sign up with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {/* Extra */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-white hover:text-gray-300 font-medium transition"
                >
                  Login
                </button>
              </p>
            </div>

            <p className="mt-6 text-[11px] text-center text-slate-500 dark:text-slate-400">
              By continuing, you agree to our{" "}
              <span className="text-slate-900 dark:text-white underline underline-offset-2 cursor-pointer">
                Terms
              </span>{" "}
              &{" "}
              <span className="text-slate-900 dark:text-white underline underline-offset-2 cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
