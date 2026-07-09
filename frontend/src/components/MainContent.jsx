import React from 'react'
import '../styles/site.css'
import Landing from './Landing/Landing'

// The landing page (route "/") is a clone of the spacebears experience.
// It ships its own pill navbar (with NEXUS routes), so no separate Navbar/SideBar here.
export default function MainContent() {
  return <Landing />
}
