// Hero.js
import React from 'react';
import { Link } from 'react-router-dom';
import hero from '../assets/images/hero-img.jpg'

const Hero = () => {
    return (
        <section className="hero text-white text-center  d-flex" style={{ backgroundColor: '#6baff8' }}>
            <div className='hero1 d-flex flex-column justify-content-center align-items-center text-left'>
                <h2>Welcome to <span id="hero-title1">MedEase</span> <br/><span id="hero-title2">- An Online Doctor Consultation</span></h2>
                <p>"Experience convenient and expert medical advice right from home. Connect with qualified doctors for virtual consultations and personalized solutions today!"</p>
                <Link to="/about" className="btn text-white mt-3" style={{backgroundColor:"#0aac71"}}>Know More</Link>
            </div>
            <div className='hero2 d-flex justify-content-center align-items-center'>
                <img src={hero} alt=""/>
            </div>
        </section>
    );
};

export default Hero;
