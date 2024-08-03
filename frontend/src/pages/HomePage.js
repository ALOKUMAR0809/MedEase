// pages/HomePage.js
import React from 'react';
import HowItWorks from '../components/HowItWorks';
import Hero from '../components/Hero';
import Services from '../components/Services';

const HomePage = () => {
  return (
    <div>
      <Hero/>
      <div className="counter-section d-flex justify-content-evenly align-items-center py-3 mx-auto" >
          <div className="counter-box d-flex flex-column align-items-center mx-4 px-3">
            <span className="counter-number" >25+</span>
            <p className="counter-label">Doctors</p>
          </div>
          <div className="counter-box d-flex flex-column align-items-center mx-3 px-3">
            <span className="counter-number" >50+</span>
            <p className="counter-label">Patients</p>
          </div>
          <div className="counter-box d-flex flex-column align-items-center mx-3 px-3">
            <span className="counter-number">100+</span>
            <p className="counter-label">Sessions</p>
          </div>
      </div>
      <Services/>
      <HowItWorks/>
    </div>
  );
};

export default HomePage;
