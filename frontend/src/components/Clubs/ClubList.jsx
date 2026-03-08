import React, { useState, useEffect } from 'react'
import ClubCard from '../../../components/ClubCard'
import './club.css'

export default function ClubList({ onApply }) {
  const [clubs, setClubs] = useState([])

  useEffect(() => {
    async function fetchClubs() {
      try {
        const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${API}/api/organisation/get-clubs`, {
          credentials: "include"
        })
        const data = await res.json()
        if (data.success) {
          setClubs(data.clubs)
        }
      } catch (err) {
        console.error('Error fetching clubs:', err)
      }
    }
    fetchClubs()
  }, [])

  return (
    <section className="club-list" aria-label="Available clubs">
      <div className="cards">
        {clubs.map(club => (
          <ClubCard
            key={club.name}
            abbr={club.abbr || club.name}
            name={club.name}
            fullForm={club.fullForm}
            img={club.logo || club.img}
            desc={club.desc}
            focusAreas={club.focusAreas}
            media={club.media}
            activities={club.activities}
            onApply={onApply}
          />
        ))}
      </div>
    </section>
  )
}
