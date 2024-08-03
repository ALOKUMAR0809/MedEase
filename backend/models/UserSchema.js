const mongoose  = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        enum: ['male', 'female','others'], 
        default: 'male', 
    },
    address:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
      },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    userType:{
        type: String,
        enum: ['patient', 'doctor'], 
    },
    date:{
        type: Date,
        default: Date.now
    },
    profileImage: {
        type: String,
        default: '../assets/images/avatar.jpg', 
      },


});

module.exports = mongoose.model('user',UserSchema);