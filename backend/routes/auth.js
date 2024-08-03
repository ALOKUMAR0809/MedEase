const express = require('express');
const User = require('../models/UserSchema');
const Doctor = require('../models/DoctorSchema');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'AmitKumar';

router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(400).json({ success,errors: errors.array() });}
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    let doctor = await Doctor.findOne({ email: req.body.email });
    if (user || doctor) {
      return res.status(400).json({error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    // Create a new user
    user = await User.create({
      name: req.body.name,
      gender: req.body.gender,
      age : req.body.age,
      phone: req.body.phone,
      address : req.body.address,
      email: req.body.email,
      password: secPass,
      userType: req.body.userType,
      profileImage : req.body.profileImage

    });
    const data = {
      user: {
        id: user.id,
        userType: 'patient',
      }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true
    res.json({ success,authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error.");
  }
})
router.post('/createdoctor', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  body('speciality', 'Speciality is required for doctors').notEmpty(),
  body('experience', 'Experience is required for doctors').notEmpty(),
  body('location', 'Location is required for doctors').notEmpty(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    // Check whether the doctor with this email exists already
    let doctor = await Doctor.findOne({ email: req.body.email }); // Use Doctor model
    let user = await User.findOne({ email: req.body.email });
    if (doctor || user) {
      return res.status(400).json({ success, error: "A doctor with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    
    // Create a new doctor
    doctor = await Doctor.create({ // Use Doctor model
      name: req.body.name,
      email: req.body.email,
      password: secPass,
      userType: 'doctor',
      speciality: req.body.speciality,
      experience: req.body.experience,
      location: req.body.location,
      phone: req.body.phone,
      bio: req.body.bio,
      profileImage : req.body.profileImage
    });
    
    const data = {
      doctor: {
        id: doctor.id,
        userType: 'doctor',
      }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    
    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    let doctor = await Doctor.findOne({ email });
    if (!user && !doctor) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    let passwordCompare = false;
    if(user) { passwordCompare = await bcrypt.compare(password, user.password);}
    if(doctor) { passwordCompare = await bcrypt.compare(password, doctor.password);}
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }
    let data = {}
    if(user){
      data = {
        user: {
          id: user.id,
          userType : 'patient'
        }
      }
    }
    if(doctor){
      data = {
        doctor: {
          id: doctor.id,
          userType : 'doctor'
        }
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }


});

router.post('/getuser', fetchuser, async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user.id).select("-password");
      res.send(user);
    } else if (req.doctor) {
      const doctor = await Doctor.findById(req.doctor.id).select("-password");
      res.send(doctor);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router