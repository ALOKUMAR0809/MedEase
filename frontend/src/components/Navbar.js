// components/Navbar.js
import React ,{useEffect}from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import useFetchUser from '../utils/useFetchUser';

const Navbar = () => {
  const { userDetails,setUserDetails,fetchUser} = useFetchUser();
  let navigate = useNavigate();
  const handleLogout = ()=>{
    localStorage.removeItem('token');
    setUserDetails({});
    navigate('/login');
  }
  useEffect(() => {
    fetchUser();
  }, [fetchUser]); 
  // Set the background image URL based on the user type
  let profileBackgroundImage = userDetails.profileImage;
  
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#e3f2fd' }}>
      <div className="container-fluid">
        <NavLink className="navbar-brand text-white" exact to="/">
          <img src={logo} alt="Logo" height="60" className="d-inline-block align-top" />
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link mx-2" activeclassname="active" exact to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link mx-2" activeclassname="active" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link mx-2" activeclassname="active" to="/find-doctor">Find Doctors</NavLink>
            </li>
            {userDetails.userType ==='patient' &&
            <li className="nav-item">
              <NavLink className="nav-link mx-2" activeclassname="active" to="/StartConsultation">Start Consultation</NavLink>
            </li>
            }
            <li className="nav-item">
              <NavLink className="nav-link mx-2" activeclassname="active" to="/profile">Sessions</NavLink>
            </li>
            
          </ul>
          
          {localStorage.getItem('token') ? <>
          <div className='d-flex gap-5 my-1 px-3'>
            <NavLink to="/profile" className="btn my-2 p-3  rounded-circle border border-success" style={{ backgroundImage: `url(${profileBackgroundImage})`, backgroundSize: 'cover', backgroundPosition:'center'}}></NavLink>
            <button className="btn my-2 text-white  logout-btn" style={{ backgroundColor: '#0aac71' }} onClick={handleLogout}>Logout</button>
          </div>
          </> : <><NavLink to="/login" className="btn my-2 text-white mx-auto" style={{backgroundColor:"#0aac71"}}>Login</NavLink></>
          } 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
