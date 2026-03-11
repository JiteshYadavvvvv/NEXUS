import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0d1117] border-t border-white/5 text-gray-400 font-mono mt-auto">

      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[1200px] py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12">
          
          {/* Brand & Legal Column (Left-most) */}
          <div className="col-span-2 flex flex-col gap-6 lg:pr-8">
            <Link to="/" className="flex items-center gap-3 w-fit group mb-4">
              <img 
                src="/nexus.svg" 
                alt="NEXUS Logo" 
                className="h-10 w-auto rounded-full" 
              />
              <span className="text-2xl font-bold text-white tracking-tight">NEXUS</span>
            </Link>
            
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><Instagram className="w-4 h-4" /></a>
            </div>

            <div className="flex flex-col gap-4 mt-4 text-[13px] text-gray-400 font-medium tracking-wide">
              <a href="#" className="hover:text-white transition-colors w-fit">Trust</a>
              <a href="#" className="hover:text-white transition-colors w-fit">Privacy</a>
              <a href="#" className="hover:text-white transition-colors w-fit">Terms of use</a>
              <a href="#" className="hover:text-white transition-colors w-fit">Legal notices</a>
            </div>
            
            <div className="mt-4">
               <div className="relative inline-block w-40">
                  <select className="appearance-none w-full bg-transparent border border-white/10 text-gray-400 text-[13px] rounded-md pl-3 pr-8 py-2 focus:outline-none focus:border-white/20 transition-colors">
                    <option>English</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
               </div>
            </div>
            
            <div className="mt-2">
               <span className="text-xs text-gray-600">© {currentYear} Nexus.</span>
            </div>
          </div>

          {/* Column 1 */}
          <div className="col-span-1 flex flex-col gap-4">
            <h4 className="text-white text-sm font-semibold mb-2 tracking-wide">Platform</h4>
            <Link to="/" className="text-[13px] hover:text-white transition-colors w-fit">Home</Link>
            <a href="#about" className="text-[13px] hover:text-white transition-colors w-fit">About Us</a>
            <Link to="/developers" className="text-[13px] hover:text-white transition-colors w-fit">Developers</Link>
            <Link to="/events" className="text-[13px] hover:text-white transition-colors w-fit">Events</Link>
            <Link to="/leaderboard" className="text-[13px] hover:text-white transition-colors w-fit">Leaderboard</Link>
          </div>

          {/* Column 2 */}
          <div className="col-span-1 flex flex-col gap-4">
            <h4 className="text-white text-sm font-semibold mb-2 tracking-wide">Clubs</h4>
            <Link to="/clubs/radioraga" className="text-[13px] hover:text-white transition-colors w-fit">Radio Raga</Link>
            <Link to="/clubs/ecell" className="text-[13px] hover:text-white transition-colors w-fit">E-Cell</Link>
            <Link to="/clubs/evclub" className="text-[13px] hover:text-white transition-colors w-fit">EV Club</Link>
            <Link to="/clubs/gdsc" className="text-[13px] hover:text-white transition-colors w-fit">GDSC</Link>
            <Link to="/clubs/oss" className="text-[13px] hover:text-white transition-colors w-fit">OSS Club</Link>
            <Link to="/clubs" className="text-[13px] hover:text-white transition-colors w-fit mt-1 text-gray-500">All clubs</Link>
          </div>

          {/* Column 3 */}
          <div className="col-span-1 flex flex-col gap-4">
            <h4 className="text-white text-sm font-semibold mb-2 tracking-wide">Company</h4>
            <a href="#" className="text-[13px] hover:text-white transition-colors w-fit">Mission & values</a>
            <a href="#" className="text-[13px] hover:text-white transition-colors w-fit">Careers</a>
            <a href="#" className="text-[13px] hover:text-white transition-colors w-fit">News</a>
            <a href="#" className="text-[13px] hover:text-white transition-colors w-fit">Contact</a>
          </div>

          {/* Column 4 */}
          <div className="col-span-1 flex flex-col gap-4">
            <h4 className="text-white text-sm font-semibold mb-2 tracking-wide">Connect</h4>
            <a href="#" className="text-[13px] hover:text-white transition-colors w-fit">Community</a>
            <a href="#" className="text-[13px] hover:text-white transition-colors w-fit">Events & Webinars</a>
            <a href="https://github.com/Jitesh-Yadav01/SYNC-AIT" target="_blank" rel="noopener noreferrer" className="text-[13px] hover:text-white transition-colors w-fit">Open Source</a>
            <a href="#" className="text-[13px] hover:text-white transition-colors w-fit">Support</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
