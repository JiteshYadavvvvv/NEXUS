import React from 'react';
import Launching from './Launching';
import ImageSection from './ImageSection';
import Footer from './Footer';
import { ClubStackSection } from '../Home/ClubStackSection';

const Section = () => {
  return (
    <div className="main-wrapper bg-black">
      <Launching />
      <ImageSection />
      {/* "Works with all AIT Clubs" hover section carried over from NEXUS */}
      <ClubStackSection />
      <Footer />
    </div>
  );
};

export default Section;
