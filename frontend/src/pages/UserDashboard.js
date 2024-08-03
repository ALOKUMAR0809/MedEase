import React, { useState, useEffect} from "react";
import { Link,useNavigate } from "react-router-dom";
import useFetchUser from '../utils/useFetchUser';
import { BASE_URL } from '../config'

const UserDashboard = (props) => {
  const {userDetails, setUserDetails,fetchUser, authToken} = useFetchUser();
  // eslint-disable-next-line
  const [sessions, setSessions] = useState([])
  const [showRequests, setShowRequests] = useState(false);
  const fetchUpdatedSessions = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/sessions?userId=${userDetails._id}&userType=${userDetails.userType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken,
        },
      });
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };
  useEffect(() => {
    // Fetch sessions based on user type (doctor or patient)
    const fetchSessions = async () => {
      try {
        const response = await fetch($,{BASE_URL}`/api/sessions?userId=${userDetails._id}&userType=${userDetails.userType}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
        });
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    if (userDetails.userType && userDetails._id) {
      fetchSessions();
    }
  }, [authToken, userDetails._id, userDetails.userType]);

  
  const handleAvailabilityChange = async (newAvailability) => {
    try {
      const response = await fetch(`${BASE_URL}/api/doctors/${userDetails._id}/update-availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ isAvailable: newAvailability }),
      });

      if (response.ok) {
        props.showAlert("Successfully changed availability status", 'success');
        const updatedUserDetails = { ...userDetails, isAvailable: newAvailability };
        setUserDetails(updatedUserDetails);
      } else {
        props.showAlert("Failed to change availability status", 'danger');
      }
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };
  
  const toggleSessionRequests = () => {
    setShowRequests(!showRequests);
  };
const handleAcceptSession = async (sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/sessions/${sessionId}/accept`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken,
      },
    });

    if (response.ok) {
      fetchUpdatedSessions();
    } else {
      console.error('Failed to accept session');
    }
  } catch (error) {
    console.error('Error accepting session:', error);
  }
};

const handleRejectSession = async (sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/sessions/${sessionId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': authToken,
      },
    });

    if (response.ok) {
      // Update UI or perform necessary actions
      fetchUpdatedSessions();
    } else {
      console.error('Failed to reject session');
    }
  } catch (error) {
    console.error('Error rejecting session:', error);
  }
};

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  const isAuthenticated = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container my-3 py-2">
      <div className="row doctorProfile bg-white py-4">
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <img src={userDetails.profileImage} alt={userDetails.name} className="img-fluid rounded mb-4 mx-5"/>
        </div>
        {userDetails.userType === "doctor" ? (
          <div className="col-md-8 doctorProfileDesc px-5">
            <h2 style={{ color: "#35A29F" }}>{userDetails.name}</h2>
            <p className="text-muted mb-2">{userDetails.speciality}</p>
            <p className="mb-1 "><strong>Experience : </strong> {userDetails.experience}</p>
            <p className="mb-1"><strong>Location :</strong> {userDetails.location}</p>
            <p className="mb-1"><strong>Contact :</strong> {userDetails.email}</p>
            <p className="mb-1"><strong>Phone :</strong> {userDetails.phone}</p>
            <p className=" mb-4" style={{ color:userDetails.isAvailable === "Available"? "green": userDetails.isAvailable === "Not Available"? "red": "blue"}}>{userDetails.isAvailable}</p>
            <div className="mb-3">
                <label htmlFor="availability" className="form-label">Availability Status</label>
                <select className="form-select" id="availability" value={userDetails.isAvailable} onChange={(e) => handleAvailabilityChange(e.target.value)}>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                    <option value="Will be available soon">Will be available soon</option>
                </select>
            </div>
            <div>
              <h5 className="text-secondary">Bio</h5>
              <p>{userDetails.bio}</p>
            </div>
          </div>
        ) : (
          <div className="col-md-8 doctorProfileDesc px-5">
            <h2 style={{ color: "#35A29F" }}>{userDetails.name}</h2>
            <p className="mb-1 "><strong>Age : </strong> {userDetails.age}</p>
            <p className="mb-1"><strong>Gender :</strong> {userDetails.gender}</p>
            <p className="mb-1"><strong>Address :</strong> {userDetails.address}</p>
            <p className="mb-1"><strong>Contact :</strong> {userDetails.email}</p>
            <p className="mb-4"><strong>Phone :</strong> {userDetails.phone}</p>
          </div>
        )}
      </div>
      {/* Toggle button for Session Requests */}
      {userDetails.userType === "doctor" && (<div className="d-flex justify-content-center mt-3">
        <button className="btn btn-primary" onClick={toggleSessionRequests}>Session Requests</button>
      </div>)}

      {/* Display Session Requests */}
      {showRequests && userDetails.userType === "doctor" && (
        <div className="mt-4">
          <h4 >Consultation Requests</h4>
          <p>Pending sessions: {sessions.filter(session => session.status === "Pending").length}</p>
          {sessions.filter(session => session.status === "Pending").map(session => (
            <div key={session._id} className="card mt-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">{session.patientName}</h5>
                  <div>
                    <p className="card-text">{session.startTime ? new Date(session.startTime).toDateString() : "N/A"}{"      "}{session.startTime ? new Date(session.startTime).toTimeString().split(" ")[0] : "N/A"}</p>
                  </div>
                </div>
                <p className="card-text text-muted mt-2 mb-1"><strong>Problem:</strong> {session.problem || "N/A"}</p>
                <p className="card-text text-muted"><strong>Symptoms:</strong> {session.symptoms || "N/A"}</p>
                <div className="d-flex justify-content-end mt-2 card-footer">
                  <button className="btn btn-success me-2" onClick={() => handleAcceptSession(session._id)}>Accept</button>
                  <button className="btn btn-danger" onClick={() => handleRejectSession(session._id)}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        
      {/* Session Details Section */}
      <div className="session-section my-4">
        <h4 className="mb-3">Session Details</h4>
        {sessions.filter(session => userDetails.userType === 'doctor' ? session.status !== 'Pending' : true).length === 0 ? (
          <p>No Session available.</p>
        ) : (
          sessions.filter(session => userDetails.userType === 'doctor' ? session.status !== 'Pending' : true).map((session,index) => (
            <div key={session._id} className={`session-card ${session.status === "Active" ? "active-session" : ""}`}>
              <div className="card mb-4" style={{backgroundColor: `${session.status === "Active" ? "#C8E4B2" : session.status === "Rejected" ? "#FF6969": session.status==="Pending"? "#C5DFF8" : "#FAF1E4"}`,}}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title" style={{ color: "#61677A" }}>Session - {index+1}</h6>
                    <h6 className="card-title">{userDetails.userType==='doctor'?session.patientName : session.doctorName}</h6>
                  </div>  
                  <div className="d-flex justify-content-between">
                    <span className="card-text">{session.startTime ? `Date: ${new Date(session.startTime).toDateString()}` : "Date: N/A"}</span>
                    <span className="card-text">{session.startTime ? `Time: ${new Date(session.startTime).toTimeString().split(" ")[0]}` : "Time: N/A"}</span>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <small className="text-muted">Status : {session.status}</small>
                  <Link to={`/session/${session._id}`} className="btn text-white" style={{ backgroundColor: "#61677A" }}>View Session</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
