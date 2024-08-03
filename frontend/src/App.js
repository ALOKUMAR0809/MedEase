// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import About from './pages/About';
import FindDoctorsPage from './pages/FindDoctors';
import DoctorProfile from './pages/DoctorProfile';
import LoginSignupPage from './pages/LoginSignupPage';
import StartConsultationPage from './pages/StartConsultationPage';
import  Alert  from './components/alerts';
import UserDashboard from './pages/UserDashboard';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import Prescription from './pages/Prescription';
import Chat from './pages/Chat';
import MedicalRecords from './pages/MedicalRecords';


function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) =>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500);
  }
  return (
    <Router>
      {alert && <Alert alert={alert} />}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/find-doctor" element={<FindDoctorsPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorProfile showAlert={showAlert}/>} />
        <Route path="/login" element={<LoginSignupPage  isLogin={true} showAlert={showAlert} />}/>
        <Route path="/signup" element={<LoginSignupPage  isLogin={false} showAlert={showAlert} />}/>
        <Route path="/StartConsultation" element={<StartConsultationPage showAlert={showAlert}/>}/>
        <Route path="/profile" element={<UserDashboard showAlert={showAlert}/>}/>
        <Route path="/session/:sessionId/" element={<ConsultationDetailPage showAlert={showAlert}/>}/>
        <Route path="/prescription/:sessionId/:status" element={<Prescription showAlert={showAlert}/>}/>
        <Route path="/chat/:sessionId/:status" element={<Chat/>}/>
        <Route path="/medicalRecord/:sessionId/:status" element={<MedicalRecords showAlert={showAlert}/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
