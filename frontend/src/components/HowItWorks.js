// HowItWorks.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import {howItWorks} from '../data'

const HowItWorks = () => {
  return (
    <section className="how-it-works py-3" style={{backgroundColor: "#eaf0fc"}}>
      <div className="container text-center">
        <h5 style={{color:"orange"}}>How it works</h5>
        <h4 className='my-2'>Quick Solution For Scheduling With Doctor</h4>
        <div className="card-container mt-4">
        {howItWorks.map((item, index) => (
            <React.Fragment key={index}>
              <div className="card-item">
                <img src={require('../assets/images/' + item.image +'.jpg')} alt={item.title}  className="card-img-top" />
                <div className="card-body">
                  <h6 className="card-title mb-2">{item.title}</h6>
                  <p className="card-text">{item.details}</p>
                </div>
              </div>
              {index < howItWorks.length - 1 && (
                <FontAwesomeIcon className="horizontal-arrow" icon={faArrowRight} />
              )}
            </React.Fragment>
        ))}
        </div>
      </div>
      <div className='box d-flex justify-content-center align-items-center'>
        <div className='sub-box1 d-flex justify-content-center align-items-center py-4 px-4'>
          <h3>You Can Start Consultation with Doctor Now</h3>
        </div>
        <div className='sub-box2 d-flex justify-content-center align-items-center py-4 '>
          <Link to="/StartConsultation" className="btn text-white mt-3" style={{backgroundColor:"#efb31d", borderRadius:"20px"}}>Start Consultation Now</Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
