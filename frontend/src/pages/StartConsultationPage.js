import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchUser from '../utils/useFetchUser';
import { BASE_URL } from '../config'

// Create a separate component for showing doctor details
const DoctorDetails = ({ doctor}) => (
  <div className="card mb-3 mt-4">
    <img src={doctor.profileImage} className="card-img-top rounded-circle mx-auto mt-3" alt={doctor.name} style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
    <div className="card-body text-center">
      <h5 className="card-title">{doctor.name}</h5>
      <p className="card-text mb-2">Speciality: {doctor.speciality}</p>
      <p className="card-text mb-2">Experience: {doctor.experience} years</p>
      <p className="card-text">Location: {doctor.location}</p>
      <p className=" mb-4" style={{ color:doctor.isAvailable === "Available"? "green": doctor.isAvailable === "Not Available"? "red": "blue"}}>{doctor.isAvailable}</p>
    </div>
  </div>
);

const StartConsultation = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [problem, setProblem] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const {userDetails, fetchUser, authToken} = useFetchUser();

 
  useEffect(() => {
    fetchUser();
    // Fetch the list of available doctors from the server
    fetch(`${BASE_URL}/api/doctors`)
      .then(response => response.json())
      .then(data => setDoctors(data))
      .catch(error => console.error(error));
  }, [fetchUser]);
  
  const navigate = useNavigate();

  // If not authenticated, redirect to the login page
  if (!authToken) {
    navigate('/login');
    return null;
  }

  const handleStartConsultation = async () => {
    if (selectedDoctor && problem && symptoms) {
      const selectedDoctorData = doctors.find(doctor => doctor._id === selectedDoctor);
      if(selectedDoctorData.isAvailable !=="Available"){
        props.showAlert("The Selected Doctor is not available", 'danger')
        return;
      }// Send a POST request to create a new consultation session
      const response = await fetch(`${BASE_URL}/api/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          doctorName: selectedDoctorData.name,
          patientId : userDetails._id,
          patientName : userDetails.name,
          problem,
          symptoms,
        }),
      });
  
      if (response.ok) {
        props.showAlert("Successfully started the session", 'success')
        navigate('/profile');
      } else {
        console.error('Failed to start consultation session');
      }
    }
  };
  return (
    <div className="container py-5">
      <h3 className="mb-3 text-center">Start Consultation</h3>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="doctorSelect" className="form-label">Select a doctor</label>
          <select id="doctorSelect" className="form-select mb-3" value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.speciality}</option>
            ))}
          </select>
          <label htmlFor="problem" className="form-label">Describe the problem</label>
          <input type="text" id="problem" placeholder='Please explain your problem clearly' className="form-control mb-3" value={problem} onChange={e => setProblem(e.target.value)} />
          <label htmlFor="symptoms" className="form-label">Symptoms</label>
          <textarea id="symptoms" placeholder='Please try to write symptoms in pointwise' className="form-control mb-4" style={{resize: 'none'}} rows="4" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
          <button className="btn btn-primary" onClick={handleStartConsultation} disabled={!selectedDoctor || !problem || !symptoms}>Start Consultation</button>
        </div>
        <div className="col-md-6 mt-4 mt-md-0">
          {selectedDoctor && (
            <div>
              <DoctorDetails doctor={doctors.find(doctor => doctor._id === selectedDoctor)}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartConsultation;
