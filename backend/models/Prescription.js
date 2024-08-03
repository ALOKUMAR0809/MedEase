const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  details: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
