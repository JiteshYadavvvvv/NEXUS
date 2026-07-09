import React from 'react';
import Launching from './Launching';
import ImageSection from './ImageSection';
import Footer from './Footer';


const Section = () => {
  return (
    <div className="main-wrapper bg-black">
      <Launching />
      <ImageSection />
      <Footer />
    </div>
  );
};

export default Section;