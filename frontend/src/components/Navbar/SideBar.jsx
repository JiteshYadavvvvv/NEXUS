import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { X, Github, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

/**
 * Navigation items configuration.
 * modify this array to add or remove links from the sidebar.
 */
const NAV_ITEMS = [
  { name: "Home", path: "/", isLink: false },
  { name: "About Us", path: "/#about", isLink: true },
  { name: "Clubs", path: "/clubs", isLink: false },
  { name: "Team", path: "https://www.gdgaitpune.me/", isLink: true, external: true },
  { name: "Developers", path: "/developers", isLink: false },
];

/**
 * SideBar Component
 *
 * A responsive drawer component for mobile navigation.
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls the visibility of the sidebar.
 * @param {function} props.onClose - function to close the sidebar.
 * @param {function} props.onOpenLogin - function to trigger the login view.
 */
export default function SideBar({ open, onClose, onOpenLogin }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  // Lock body scroll when sidebar is active to prevent background scrolling
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[280px] sm:w-[320px]",
          "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl",
          "border-l border-zinc-200 dark:border-zinc-800",
          "shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          
          <div className="flex items-center mb-8">
            <span className="font-jersey-20 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Menu
            </span>
          </div>

            <nav className="flex-1">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  {item.isLink ? (
                    <a
                      href={item.path}
                      onClick={onClose}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center px-4 py-3 rounded-xl text-[15px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all duration-200 group"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <NavLink
                      to={item.path}
                      end
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200",
                          isActive
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold shadow-sm"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                        )
                      }
                    >
                      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                      {item.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            {user ? (
              <Button
                onClick={() => {
                  logout();
                  onClose();
                  navigate('/');
                }}
                variant="outline"
                className="w-full h-11 rounded-xl border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 font-medium justify-center gap-2 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => { onClose(); navigate('/login'); }}
                variant="outline"
                className="w-full h-11 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-medium justify-center gap-2 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}

            <Button
              asChild
              className="w-full h-11 rounded-xl bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <a
                href="https://github.com/Jitesh-Yadav01/SYNC-AIT"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                Star on GitHub
              </a>
            </Button>

            <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-600 font-medium mt-4">
              © {new Date().getFullYear()} NEXUS. All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
