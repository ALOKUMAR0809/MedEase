// pages/LoginSignupPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginPhone from '../assets/images/login-phone.jpg';
import { BASE_URL } from '../config'

const LoginSignupPage = (props) => {
    let navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const pageTitle = props.isLogin ? 'Login' : 'Sign Up';
    const [userType, setUserType] = useState('');
    const [credentials, setCredentials] = useState({ email: '', password: '', name: '', userType: 'patient', speciality: '', experience: '', location: '', bio: '', age: '', gender: 'male', address: '', phone: '' ,profileImage:''});

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Successfully Logged in", 'success');
        }
        else {
            props.showAlert("Invalid credentials", 'danger');
        }
    };
    const uploadImage = async () => {
        const formData = new FormData();
        formData.append('file', credentials.profileImage);
        formData.append('upload_preset', 'MedEase_profiles');
        formData.append('fcloud_name', 'dytlvnbuh');

            const res = await fetch('https://api.cloudinary.com/v1_1/dytlvnbuh/upload', {
                method: 'POST',
                body: formData
            })
            if (res.status === 200) {
                return await res.json()
            }
            else {
                return "Error"
            }
        }

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, userType, phone, speciality, experience, location, bio, age, gender, address,} = credentials;
        const { secure_url } = await uploadImage();
        const requestBody = {
            name,email,password,userType,phone,profileImage: secure_url,
            ...(userType === 'doctor'
                ? { speciality, experience, location, bio }
                : { age, gender, address }),
        };

        try {
            let apiUrl = `${BASE_URL}/api/auth/createuser`;
            if (userType === 'doctor') {
                apiUrl = `${BASE_URL}/api/auth/createdoctor`;
            }
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const json = await response.json();
            if (json.success) {
                localStorage.setItem('token', json.authtoken);
                navigate('/');
                props.showAlert('Successfully Registered', 'success');
            } else {
                props.showAlert('Invalid credentials', 'danger');
            }
        } catch (error) {
            console.error(error.message);
        }
    };
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        setCredentials({ ...credentials, userType: e.target.value });
    };

    return (
        <div className="container-fluid login-container d-flex my-3 mx-auto">
            <div className="loginDiv1">
                <img id="loginPhone" src={loginPhone} alt="" />
            </div>
            <div className="loginDiv1 d-flex justify-content-center align-items-center py-3">
                <div className="bg-white p-4 rounded shadow-lg" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">{pageTitle}</h2>
                    {props.isLogin ? (
                        <>
                            <form onSubmit={handleLoginSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Login</button>
                            </form>
                            <p className="mt-3 text-center">Not Registered? <Link to="/signup">Sign Up</Link></p>
                        </>
                    ) : (
                        <>
                            <form onSubmit={handleSignupSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="userType" className="form-label">User Type</label>
                                    <select className="form-control" id="userType" name="userType" value={userType} onChange={handleUserTypeChange}>
                                        <option value="patient">Patient</option>
                                        <option value="doctor">Doctor</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profileIMage" className="form-label">{credentials?.profileImage?.name || 'Upload Profile Image'}</label>
                                    <input type="file" className="form-control hidden" id="profileImage" name="profileImage"  onChange={(e)=>setCredentials({ ...credentials, profileImage: e.target.files[0] })}  />
                                </div>
                                {userType === 'doctor' ? (
                                    <>
                                        {/* Doctor input fields */}
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} minLength={3} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="speciality" className="form-label">Speciality</label>
                                            <input type="text" className="form-control" id="speciality" name="speciality" value={credentials.speciality} onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="experience" className="form-label">Experience</label>
                                            <input type="text" className="form-control" id="experience" name="experience" value={credentials.experience} onChange={onChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="location" className="form-label">Location</label>
                                            <input type="text" className="form-control" id="location" name="location" value={credentials.location} onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Phone Number</label>
                                            <input type="tel" className="form-control" id="phone" name="phone" value={credentials.phone} onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="bio" className="form-label">Bio</label>
                                            <textarea className="form-control" id="bio" name="bio" value={credentials.bio} onChange={onChange} rows="3" ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} minLength={5} required />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Patient input fields */}
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} minLength={3} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="age" className="form-label">Age</label>
                                            <input type="number" className="form-control" id="age" name="age" value={credentials.age} onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="gender" className="form-label">Gender</label>
                                            <select className="form-control" id="gender" name="gender" value={credentials.gender} onChange={onChange} >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="others">Others</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="address" className="form-label">Address</label>
                                            <input type="text" className="form-control" id="address" name="address" value={credentials.address} onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Phone Number</label>
                                            <input type="tel" className="form-control" id="phone" name="phone" value={credentials.phone} onChange={onChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} minLength={5} required />
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                            </form>
                            <p className="mt-3 text-center">Already a Member? <Link to="/login">Login</Link></p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginSignupPage;
