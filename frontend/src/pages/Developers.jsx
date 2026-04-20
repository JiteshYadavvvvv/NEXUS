import { useEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DevGrid from "../components/Developers/DevGrid";

const Developers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      ".header-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans text-white">
      <main className="relative flex w-full min-h-screen pt-5 pb-12 font-mono flex-col items-center z-10">
        <section className="w-full flex justify-center flex-col items-center">
          {/* Back Button Section */}
          <div className="w-full max-w-[1200px] flex items-center justify-start mt-6 mb-4 px-6 sm:px-8 header-anim relative z-20">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all hover:-translate-y-0.5 active:scale-95 duration-300 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
          </div>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full max-w-[1200px] px-6 sm:px-8 mb-8 gap-6 header-anim relative z-20 pointer-events-none">
            <div className="uppercase pointer-events-auto">
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4'>
                Meet the <span className="text-gray-400">Creators.</span>
              </h2>
              <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed capitalize">
                Discover the elite developers, designers, and innovators pushing the boundaries of what's possible on our platform.
              </p>
            </div>
          </div>

          <DevGrid />
        </section>
      </main>
    </div>
  );
};

export default Developers;
