import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building, User, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClubSelectDropdown from "./ClubSelectDropdown";

const AuthSelection = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [showClubSelect, setShowClubSelect] = useState(false);

  useEffect(() => {
    const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    fetch(`${API}/api/organisation/get-clubs`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClubs(data.clubs || []);
        }
      })
      .catch((err) => console.error("Failed to load clubs", err));
  }, []);

  const handleOrganisationSelect = () => {
    setShowClubSelect(true);
  };

  const handleApplicantSelect = () => {
    navigate("/login", { state: { role: "Applicant" } });
  };

  const handleClubSubmit = (e) => {
    e.preventDefault();
    if (selectedClub) {
      const clubDetails = clubs.find((c) => c.name === selectedClub);
      navigate("/login", { 
        state: { 
          role: "Organisation", 
          club: clubDetails 
        } 
      });
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
      <div className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl px-8 py-10 relative overflow-visible">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
          onClick={() => showClubSelect ? setShowClubSelect(false) : navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="mb-10 text-center pt-4">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            {showClubSelect ? "Select Organisation" : "Choose Your Path"}
          </h1>
          <p className="text-sm text-slate-400 max-w-[280px] mx-auto leading-relaxed">
            {showClubSelect 
              ? "Select your registered club or board to proceed" 
              : "Tell us how you want to interact with the Community"}
          </p>
        </div>

        {!showClubSelect ? (
          <div className="space-y-4">
            <button
              onClick={handleOrganisationSelect}
              className="w-full group relative flex items-center gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform">
                <Building className="h-5 w-5 text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white">Enter Organisation</h3>
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
                <h3 className="text-lg font-medium text-white">Become Applicant</h3>
                <p className="text-sm text-slate-400">Apply for positions</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleClubSubmit} className="space-y-6">
              <div className="space-y-4 relative z-50">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Organisation
                </label>
                <ClubSelectDropdown 
                  clubs={clubs} 
                  selectedClub={selectedClub} 
                  onSelect={setSelectedClub} 
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!selectedClub}
                  className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="mt-8 text-xs text-center text-slate-500">
          By proceeding, you agree to Nexus <span className="text-slate-400 cursor-pointer">Terms</span>
        </p>
      </div>
    </div>
  );
};

export default AuthSelection;
