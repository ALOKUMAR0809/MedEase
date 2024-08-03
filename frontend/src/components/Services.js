import React from 'react'
import img1 from '../assets/images/homepage-img1.jpg'
import { services } from '../data'

const Services = () => {
  return (
    <section className="services py-3 mb-5" style={{backgroundColor: "#eaf0fc"}}>
      <div className="container text-center">
        <h5 style={{color:"#35A29F"}}>Our Services</h5>
        <h4 className='my-2'>Our Services For Your Health</h4>
        <div className="card-container mt-4">
        {services.map((item) => (
          <div className="card-item card-services" key={item.id}>
            <img src={require('../assets/images/' + item.image +'.jpg')} alt={item.title}  className="card-img-top service-img"/>
            <div className="card-body">
              <h6 className="card-title mb-2">{item.title}</h6>
              <p className="card-text">{item.details}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
      <div className='sep-img'>
        <img src={img1} alt=""/>
      </div>
    </section>
  )
}

export default Services
