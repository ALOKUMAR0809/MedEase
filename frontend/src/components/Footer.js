// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="text-white text-center py-4 footer mt-5" >
      <p className='mt-5'>&copy; {new Date().getFullYear()} MedEase - An Online Consultation Portal. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
