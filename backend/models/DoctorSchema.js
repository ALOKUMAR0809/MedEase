const mongoose  = require('mongoose')

const doctorSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['doctor'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: String,
    enum: ['Available', 'Not Available','Will be available soon'],
    default: 'Available',
  },
  speciality: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, 
  },
  bio: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '../assets/images/avatar.jpg', 
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
