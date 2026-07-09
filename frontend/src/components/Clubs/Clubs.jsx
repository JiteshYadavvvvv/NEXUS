import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClubCard from './ClubCard'
import { ArrowLeft, X, Instagram } from 'lucide-react'
import ElectricBorder from './ElectricBorder';
// import { useView } from '../../context/ViewContext';

export default function MainContent() {
  const navigate = useNavigate();
  // const { setCurrentView, setApplicationData } = useView();
  const [selectedClub, setSelectedClub] = useState(null);
  const [detailsClub, setDetailsClub] = useState(null);

  const handleApply = (abbr, name) => {
    navigate('/login', { state: { club: { abbr, name } } });
  }

  const handleClose = () => {
    setSelectedClub(null);
  }
  
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.body.classList.add('no-custom-cursor');
    return () => document.body.classList.remove('no-custom-cursor');
  }, []);

  // Close the details dialog on Escape.
  useEffect(() => {
    if (!detailsClub) return;
    const onKey = (e) => { if (e.key === 'Escape') setDetailsClub(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailsClub]);

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    async function fetchClubs() {
      setLoading(true)
      try {
        const res = await fetch('/api/clubs.json', { 
          signal: controller.signal
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch clubs: ${res.status}`)
        }
        const data = await res.json();
        if (!cancelled) {
          setClubs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!cancelled) setClubs([]);
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchClubs()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  if(loading){
    return(
      <p>Loading...</p>
    )
  }

  // if (selectedClub) {
  //   return (
  //     <ApplicationForm
  //       clubName={selectedClub.name}
  //       abbr={selectedClub.abbr}
  //       onClose={handleClose}
  //     />
  //   );
  // }

  return (
    <main className="relative flex w-full min-h-screen pt-5 pb-12 font-mono flex-col items-center" style={{ overflowX: 'clip' }}>
      <section className="w-full flex justify-center flex-col items-center" id="clubs" aria-label="Clubs list">
        <div className="w-full max-w-[1200px] flex items-center justify-start mt-6 mb-4 px-6 sm:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all hover:-translate-y-0.5 active:scale-95 duration-300 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
        <div className="mb-10 w-full max-w-[1200px] px-6 sm:px-8">
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4'>
            Explore <span className="text-gray-400">Clubs.</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed">
            Find your crowd. Engage with student-led organizations that align with your passions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-[1200px] px-6 sm:px-8">
          {clubs.map(c => (
            <ElectricBorder key={c.name} color="#555555" speed={0.3} chaos={0.08} borderRadius={12} className="h-full w-full">
              <ClubCard {...c} img={c.logo || c.img} abbr={c.abbr || c.name} onApply={handleApply} onDetails={setDetailsClub} />
            </ElectricBorder>
          ))}
        </div>
      </section>

      {detailsClub && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDetailsClub(null)} />
          <div className="relative w-full max-w-md bg-black border border-white/10 rounded-2xl shadow-2xl p-6 font-mono">
            <button
              onClick={() => setDetailsClub(null)}
              aria-label="Close"
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-1.5 transition-all active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="h-11 w-11 rounded-lg bg-white/5 border border-white/10 p-1.5 flex items-center justify-center shrink-0">
                <img src={detailsClub.img} alt="" className="w-full h-full object-contain filter grayscale brightness-200" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white leading-tight">{detailsClub.name}</h3>
                {detailsClub.fullForm && (
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{detailsClub.fullForm}</span>
                )}
              </div>
            </div>

            {detailsClub.desc && (
              <p className="text-sm leading-relaxed text-gray-400 mb-4">{detailsClub.desc}</p>
            )}

            {(() => {
              const handle = detailsClub.insta ? detailsClub.insta.replace(/^@/, '') : '';
              return handle ? (
                <a
                  href={`https://instagram.com/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-all active:scale-95"
                >
                  <Instagram className="h-4 w-4" /> @{handle}
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white/5 border border-white/5 rounded-lg px-3 py-2">
                  <Instagram className="h-4 w-4 opacity-40" /> Instagram coming soon
                </span>
              );
            })()}

            <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold mt-6 mb-3">
              Student Secretaries 2026–27
            </div>

            <ul className="flex flex-col gap-2">
              {detailsClub.secretaries && detailsClub.secretaries.length > 0 ? (
                detailsClub.secretaries.map((s, i) => (
                  <li key={i} className="bg-white/5 border border-white/5 rounded-lg px-3 py-2.5">
                    <div className="text-sm text-white">{s.name}</div>
                    {s.branch && <div className="text-xs text-gray-500">{s.branch}</div>}
                  </li>
                ))
              ) : (
                <li className="text-sm text-gray-500">Secretaries will be announced soon.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
