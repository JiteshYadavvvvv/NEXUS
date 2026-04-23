import { Github, Linkedin } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DevCard = ({ dev }) => {
  return (
    <div
      className={cn(
        "dev-card-element relative flex flex-col transition-all duration-500 ease-out h-[420px] mt-8 lg:mt-0 z-10 w-full sm:w-[360px]"
      )}
    >
      <div
        className={cn(
          "group relative w-full h-full rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-600 overflow-hidden flex flex-col backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5"
        )}
      >
        <div className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[60px] bg-white/5"
        )} />

        <div className="flex items-center justify-between px-5 pt-5 pb-3 z-10 relative">
          <span className={cn(
            "text-[14px] font-bold tracking-[0.2em] uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors"
          )}>
            GDG AIT PUNE
          </span>
          <a 
            href={`https://instagram.com/${dev.username.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-500 hover:text-white transition-colors font-mono tracking-widest cursor-pointer underline-offset-4 hover:underline"
          >
            {dev.username}
          </a>
        </div>

        <div className="relative w-full flex-grow px-5 pb-2 z-10 pointer-events-none">
          <div className={cn(
            "relative w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 group-hover:border-zinc-700/80 transition-colors"
          )}>
            <img
              src={dev.image}
              alt={dev.name}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 filter grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100"
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/40 to-transparent opacity-90 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col px-5 pb-6 pt-3 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={cn(
                "font-semibold tracking-tight text-xl transition-colors text-zinc-200 group-hover:text-white"
              )}>
                {dev.name}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider font-semibold">{dev.role}</p>
            </div>
            <div className="flex gap-2">
              <a href={dev.github} target="_blank" rel="noreferrer" className={cn(
                "p-2.5 rounded-lg transition-all duration-300 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 group-hover:border-zinc-700"
              )}>
                <Github size={16} strokeWidth={2} />
              </a>
              <a href={dev.linkedin} target="_blank" rel="noreferrer" className={cn(
                "p-2.5 rounded-lg transition-all duration-300 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 group-hover:border-zinc-700"
              )}>
                <Linkedin size={16} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DevCard;
