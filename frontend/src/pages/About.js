import React from 'react'
import { Link } from 'react-router-dom'
import about from '../assets/images/aboutUs.png'
import { testimonyData } from '../data';

const About = () => {
  return (
    <>
      <div className='about d-flex '>
        <div className='sub-div1 d-flex justify-content-center align-items-center'>
          <img src={about} alt="" />
        </div>
        <div className=' sub-div2 d-flex flex-column justify-content-center align-items-center p-4'>
          <div className='d-flex flex-column justify-content-center align-items-start p-4'>
            <h2 style={{ color: '#35A29F' }}>About Us</h2>
            <p className='text-justify'>"Welcome to MedEase, your trusted platform for convenient and reliable online doctor consultations. Our mission is to bridge the gap between patients and healthcare professionals, providing accessible, high-quality medical advice from the comfort of your home. With a team of experienced and certified doctors from various specialties, we strive to deliver personalized and compassionate care to each patient. Our user-friendly interface ensures a seamless and secure virtual consultation experience. Whether you need expert medical guidance, second opinions, or follow-up care, we are here to cater to your healthcare needs. Join us in revolutionizing healthcare accessibility and experience the future of digital medical consultations with MedEase."</p>
            <Link to="/login" className="btn text-white mt-3 " style={{ backgroundColor: "#0aac71" }}>Know More</Link>
          </div>
        </div>
      </div>

      <div id="carouselExampleIndicators" className="carousel slide" style={{backgroundColor: "#9ED2BE"}}>
        <h4 className='text-center pt-4 text-$orange' style={{color: '#FFEECC'}}>What Our Users Say About Us</h4>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          {testimonyData.map((item, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={item.id}>
              <section className='pt-3 pb-5'>
                <div className="d-flex justify-content-center">
                  <div className="testimonial-card m-1 p-3 rounded bg-white text-center">
                    <img src={require('../assets/images/' +
                      item.image +'.jpg')} alt={item.name} />
                    <p className='mb-2'>{item.testimony}</p>
                    <p style={{fontWeight: '600'}}>- {item.name}</p>
                  </div>
                </div>
              </section>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" >
          <span className="carousel-control-prev-icon " aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  )
}

export default About
