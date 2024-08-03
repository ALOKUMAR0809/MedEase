import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {saveAs} from 'file-saver';
import { BASE_URL } from '../config'

const MedicalRecordPage = (props) => {
  const { sessionId,status } = useParams();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [newMedicalRecord, setNewMedicalRecord] = useState({
    image: null,
    details: "",
    time: Date.now(),
  });

  const authToken = localStorage.getItem("token");
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", newMedicalRecord.image);
    formData.append("upload_preset", "MedEase_profiles");
    formData.append("fcloud_name", "dytlvnbuh");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dytlvnbuh/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) { return await res.json();} 
    else { return "Error";}
  };

  const fetchMedicalRecords = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/sessions/${sessionId}/getMedicalRecord`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        }
      );
      const data = await response.json();
      setMedicalRecords(data);
    } catch (error) {
      console.error("Error fetching medical records:", error);
    }
  }, [authToken, sessionId]);

  useEffect(() => {
    fetchMedicalRecords();
  }, [fetchMedicalRecords]);

  const handleAddMedicalRecord = async () => {
    const { secure_url } = await uploadImage();
    const MedicalRecordToAdd = {
      id: medicalRecords.length + 1,
      image: secure_url,
      details: newMedicalRecord.details,
    };
    try {
      const response = await fetch(
        `${BASE_URL}/api/sessions/${sessionId}/AddMedicalRecords`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(MedicalRecordToAdd),
        }
      );

      if (response.ok) {
        props.showAlert("Successfully added medical record", 'success');
        setMedicalRecords([...medicalRecords, MedicalRecordToAdd]);
        setNewMedicalRecord({
          image: null,
          details: "",
        });
      } else {
        props.showAlert("Failed to add medical record", 'danger');
      }
    } catch (error) {
      console.error("Error adding medical record:", error);
    }
  };

  const viewMedicalRecordImage = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };
  
  const handleDownloadMedicalRecord = (imageUrl) => {
      saveAs(imageUrl,"Prescription");
      props.showAlert("Successfully downloaded medical record", 'success');
  };

  return (
    <div className="container ">
      <h2 className="text-center mt-3">Medical Record Page</h2>
      <div className="row mt-4">
        {/* Display existing medical records*/}
        <h4 className="mb-3">Medical Records</h4>
        {medicalRecords.length === 0 ? (<p>No Medical Record available.</p>) : (
          medicalRecords.map((medicalRecord) => (
            <div className="col-md-3">
              <div key={medicalRecord.id} className="card mb-3 EffectedCard">
                <div className="EffectedCard-img-container" style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={medicalRecord.image} className="EffectedCard-img-top" alt="Medical Record" style={{ objectFit: 'cover' ,width: '100%', height: '100%' }}/>
                  <div className="Effected-details-overlay">
                    <p className="Effected-details-text">{medicalRecord.details}</p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <p className="card-text">
                      {new Date(medicalRecord.createdAt).toLocaleDateString("en-US",{ year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <p className="card-text">
                      {new Date(medicalRecord.createdAt).toTimeString().split(" ")[0]}
                    </p>
                  </div>
                  <div className="btn-group d-flex justify-content-center">
                    <button className="btn btn-primary" onClick={() => viewMedicalRecordImage(medicalRecord.image)}>View</button>
                    <button className="btn btn-secondary" onClick={() =>handleDownloadMedicalRecord(medicalRecord.image, "prescription.jpg")}>Download</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {status !=="Completed" && (
      <div className="mt-4">
        <h5>Add Medical Record</h5>
        <div className="mb-3">
          <label htmlFor="medicalRecordImage" className="form-label">Medical Record Image</label>
          <input type="file" id="medicalRecordImage" className="form-control" onChange={(e) => setNewMedicalRecord({...newMedicalRecord, image: e.target.files[0],})}/>
        </div>
        <div className="mb-3">
          <label htmlFor="medicalRecordDetails" className="form-label">Medical Record Details</label>
          <textarea id="medicalRecordDetails" className="form-control" rows="4" value={newMedicalRecord.details} onChange={(e) => setNewMedicalRecord({...newMedicalRecord, details: e.target.value,})}/>
        </div>
        <button className="btn btn-primary mb-3" onClick={handleAddMedicalRecord} disabled={!newMedicalRecord.image || !newMedicalRecord.details}>Add Medical Record</button>
      </div>
      )}
    </div>
  );
};

export default MedicalRecordPage;
