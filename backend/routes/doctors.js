// routes/doctors.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/DoctorSchema');
const Review = require('../models/ReviewSchema');

// Fetch all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add a review for a specific doctor
router.post('/:doctorId/reviews', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { patientName, rating, reviewText } = req.body;

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Create a new review
    const newReview = new Review({
      doctor: doctorId,
      patientName,
      rating,
      reviewText,
    });

    // Save the review
    await newReview.save();

    // Return the newly added review
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id/fetchreviews', async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.id });
    res.json(reviews);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/:id/update-availability', async (req, res) => {
  const { id } = req.params; 
  const { isAvailable } = req.body;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id, // Update availability based on the authenticated user's ID
      { $set: { isAvailable } },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
