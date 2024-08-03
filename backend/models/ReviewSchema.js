const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', 
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
