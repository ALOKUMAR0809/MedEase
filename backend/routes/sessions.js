// routes/sessions.js

const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');

// Fetch sessions based on user type (doctor or patient)
router.get('/', async (req, res) => {
  const { userId, userType } = req.query;

  try {
    let sessions;

    if (userType === 'doctor') {
      // Fetch sessions where the doctorId matches userId
      sessions = await Consultation.find({ doctorId: userId });
    } else {
      // Fetch sessions where the patientId matches userId
      sessions = await Consultation.find({ patientId: userId });
    }

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

router.get('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await Consultation.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Return session details
    res.json(session);
  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/:sessionId/AddPrescriptions', async(req,res)=>{
  const sessionId = req.params.sessionId;

  prescription = await Prescription.create({
    sessionId: sessionId, 
    image: req.body.image,
    details: req.body.details,
    createdAt: req.body.time,
  });
  res.status(200).send("Prescription added successfully")
});

router.get('/:sessionId/getPrescription', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const pres = await Prescription.find({sessionId :sessionId});

    if (!pres) {
      return res.status(404).json({ message: 'prescription not found' });
    }

    // Return session details
    res.json(pres);
  } catch (error) {
    console.error('Error fetching prescription details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/:sessionId/AddMedicalRecords', async(req,res)=>{
  const sessionId = req.params.sessionId;

  medicalRecord = await MedicalRecord.create({
    sessionId: sessionId, 
    image: req.body.image,
    details: req.body.details,
    createdAt: req.body.time,
  });
  res.status(200).send("Medical Record added successfully")
});

router.get('/:sessionId/getMedicalRecord', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const md = await MedicalRecord.find({sessionId :sessionId});

    if (!md) {
      return res.status(404).json({ message: 'medical record not found' });
    }

    res.json(md);
  } catch (error) {
    console.error('Error fetching medical record details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/:sessionId/accept', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const updatedSession = await Consultation.findByIdAndUpdate(sessionId, { status: 'Active' }, { new: true });
    res.json(updatedSession);
  } catch (error) {
    console.error('Error accepting session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reject a session request
router.patch('/:sessionId/reject', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const updatedSession = await Consultation.findByIdAndUpdate(sessionId, { status: 'Rejected' }, { new: true });
    res.json(updatedSession);
  } catch (error) {
    console.error('Error rejecting session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/:sessionId/end', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const updatedSession = await Consultation.findByIdAndUpdate(sessionId, { status: 'Completed' }, { new: true });
    res.json(updatedSession);
  } catch (error) {
    console.error('Error rejecting session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
