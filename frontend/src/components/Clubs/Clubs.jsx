import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClubCard from './ClubCard'
import { ArrowLeft } from 'lucide-react'
import ElectricBorder from './ElectricBorder';
// import { useView } from '../../context/ViewContext';

export default function MainContent() {
  const navigate = useNavigate();
  // const { setCurrentView, setApplicationData } = useView();
  const [selectedClub, setSelectedClub] = useState(null);

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
              <ClubCard {...c} img={c.logo || c.img} abbr={c.abbr || c.name} onApply={handleApply} />
            </ElectricBorder>
          ))}
        </div>
      </section>
    </main>
  );
}
