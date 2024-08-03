import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {saveAs} from 'file-saver';
import useFetchUser from '../utils/useFetchUser'
import { BASE_URL } from '../config'

const PrescriptionPage = (props) => {
  const { sessionId, status  } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    image: null,
    details: "",
    time: Date.now(),
  });

  const {userDetails, fetchUser, authToken} = useFetchUser();

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", newPrescription.image);
    formData.append("upload_preset", "MedEase_profiles");
    formData.append("fcloud_name", "dytlvnbuh");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dytlvnbuh/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {return await res.json();}
     else {return "Error";}
  };

  const fetchPrescriptions = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/sessions/${sessionId}/getPrescription`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        }
      );
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  }, [authToken, sessionId]);

  useEffect(() => {
    fetchUser();
    fetchPrescriptions();
  }, [fetchUser, fetchPrescriptions]);

  const handleAddPrescription = async () => {
    const { secure_url } = await uploadImage();
    const prescriptionToAdd = {
      id: prescriptions.length + 1,
      image: secure_url,
      details: newPrescription.details,
    };
    try {
      const response = await fetch(`${BASE_URL}/api/sessions/${sessionId}/AddPrescriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionToAdd),
        }
      );

      if (response.ok) {
        props.showAlert("Successfully added prescription", 'success');
        setPrescriptions([...prescriptions, prescriptionToAdd]);
        setNewPrescription({
          image: null,
          details: "",
        });
      } else {
        props.showAlert("Failed to add prescription", 'danger');
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  const viewPrescriptionImage = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };
  
  const handleDownloadPrescription = (imageUrl) => {
      saveAs(imageUrl,"Prescription")
      props.showAlert("Successfully downloaded prescription", 'success');
  };

  return (
    <div className="container ">
      <h2 className="text-center mt-3">Prescription Page</h2>
      <div className="row mt-4">
        {/* Display existing prescriptions */}
        <h4 className="mb-3">Prescriptions</h4>
        {prescriptions.length === 0 ? (<p>No Prescriptions available.</p>) : (
          prescriptions.map((prescription) => (
            <div className="col-md-3">
              <div key={prescription.id} className="card mb-3 EffectedCard">
                <div className="EffectedCard-img-container" style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={prescription.image} className="EffectedCard-img-top" alt="Prescription" style={{ objectFit: 'cover' ,width: '100%', height: '100%' }}/>
                  <div className="Effected-details-overlay">
                    <p className="Effected-details-text">{prescription.details}</p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <p className="card-text">
                      {new Date(prescription.createdAt).toLocaleDateString("en-US",{ year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <p className="card-text">
                      {new Date(prescription.createdAt).toTimeString().split(" ")[0]}
                    </p>
                  </div>
                  <div className="btn-group d-flex justify-content-center">
                    <button className="btn btn-primary" onClick={() => viewPrescriptionImage(prescription.image)}>View</button>
                    <button className="btn btn-secondary" onClick={() =>handleDownloadPrescription(prescription.image, "prescription.jpg")}>Download</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Add prescription form for doctors */}
      {userDetails.userType === "doctor" && status!=="Completed" && (
        <div className="mt-4">
          <h5>Add Prescription</h5>
          <div className="mb-3">
            <label htmlFor="prescriptionImage" className="form-label">Prescription Image</label>
            <input type="file" id="prescriptionImage" className="form-control" onChange={(e) =>setNewPrescription({...newPrescription,image: e.target.files[0],})}/>
          </div>
          <div className="mb-3">
            <label htmlFor="prescriptionDetails" className="form-label">Prescription Details</label>
            <textarea id="prescriptionDetails" className="form-control" rows="4" value={newPrescription.details} onChange={(e) =>setNewPrescription({...newPrescription,details: e.target.value,})}/>
          </div>
          <button className="btn btn-primary mb-3" onClick={handleAddPrescription} disabled={!newPrescription.image || !newPrescription.details}>Add Prescription</button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionPage;
