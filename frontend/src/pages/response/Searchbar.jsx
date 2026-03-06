import React, { useState, useEffect } from "react";
import { Search, Mic, ChevronDown } from "lucide-react";

const SearchFields = ({ value = "name", onChange }) => {
  const [open, setOpen] = useState(false);
  
  const options = [
    { key: "name", label: "Name" },
    { key: "reg", label: "Regn No." },
    { key: "priority", label: "Priority" },
    { key: "rating", label: "Rating" },
  ];

  const selected = options.find((o) => o.key === value) || options[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <span className="select-none">{selected.label}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <ul className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden z-40">
          {options.map((opt) => (
            <li
              key={opt.key}
              onClick={() => {
                if (onChange) onChange(opt.key);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer text-sm ${
                opt.key === value ? "bg-blue-50 text-gray-900" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function Searchbar({ value = "", field = "name", onChange, onSearch }) {
  const [query, setQuery] = useState(value);
  const [selectedField, setSelectedField] = useState(field);
  const [focused, setFocused] = useState(false);

  useEffect(() => setQuery(value), [value]);
  
  useEffect(() => {
    if (onChange) onChange(query, selectedField);
  }, [selectedField]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (onChange) onChange(e.target.value, selectedField);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const v = query.trim();
    if (!v) return;
    if (onSearch) onSearch(v, selectedField);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-[8vh] pb-14 bg-gray-50 p-4">
      <h1 className="text-7xl font-google font-medium tracking-tight text-gray-800 mb-8 sm:mb-12 text-center select-none">
        Form <br className="sm:hidden" /> Submissions
      </h1>

      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className={`mx-auto flex items-center gap-3 rounded-full px-5 py-4 bg-white shadow-lg transition-all duration-300 ${focused ? "ring-2 ring-blue-500" : "hover:shadow-xl"}`}>
            <div className="flex items-center gap-3 pr-3 border-r border-gray-200">
              <SearchFields
                value={selectedField}
                onChange={(f) => {
                  setSelectedField(f);
                  if (onChange) onChange(query, f);
                }}
              />
            </div>

            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />

            <input
              value={query}
              onChange={handleInputChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-base md:text-lg px-3"
            />

            <div className="hidden sm:flex items-center gap-2">
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Mic className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center select-none">
            Quick search — choose a field and type to filter results
          </p>
        </form>
      </div>
    </div>
  );
}
