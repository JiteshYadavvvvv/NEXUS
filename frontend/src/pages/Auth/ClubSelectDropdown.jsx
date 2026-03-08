import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ClubSelectDropdown = ({ clubs, selectedClub, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClubs = clubs.filter(
    (club) =>
      club.name && club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClubDetails = clubs.find((c) => c.name === selectedClub);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Target button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors outline-none",
          isOpen
            ? "border-white/30 bg-white/10 text-white"
            : "border-white/10 hover:border-white/20 bg-white/5 text-white"
        )}
      >
        {selectedClubDetails ? (
          <div className="flex items-center gap-3">
            <img
              src={selectedClubDetails.logo || "/clublogos/default.svg"}
              alt={`${selectedClubDetails.name} logo`}
              className="w-6 h-6 object-contain shrink-0"
              onError={(e) => {
                e.target.src = "/clubprofiles/ns.png";
              }}
            />
            <span className="text-white font-medium">{selectedClubDetails.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">Choose a club or board...</span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown body */}
      {isOpen && (
        <div className="w-full mt-2 mb-4 bg-[#111] border border-white/10 rounded-xl overflow-hidden animate-in fade-in duration-150">
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 outline-none"
              />
            </div>
          </div>

          {/* List of items */}
          <ul className="max-h-[300px] overflow-y-auto py-2 p-1 custom-scrollbar">
            {filteredClubs.length > 0 ? (
              filteredClubs.map((club) => {
                const isSelected = selectedClub === club.name;
                return (
                  <li key={club.name}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(club.name);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors",
                        isSelected
                          ? "bg-white/10 text-white"
                          : "hover:bg-white/10 text-slate-300 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {club.logo && (
                          <img
                            src={club.logo}
                            alt={`${club.name} logo`}
                            className="w-6 h-6 object-contain shrink-0"
                            onError={(e) => {
                              e.target.src = "/clublogos/google-developers.svg";
                            }}
                          />
                        )}
                        <span className="text-sm font-medium">{club.name}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-white shrink-0" />}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="py-8 text-center text-sm text-slate-500">
                No clubs found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClubSelectDropdown;
