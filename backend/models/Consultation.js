// models/Consultation.js
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  doctorName:String,
  patientName:String,
  startTime: Date,
  endTime: Date,
  status:{
    type:String,
    enum:['Pending', 'Active', 'Rejected', 'Completed'],
    default: "Pending",
  },
  problem: String, 
  symptoms: String, 
});

module.exports = mongoose.model('Consultation', consultationSchema);