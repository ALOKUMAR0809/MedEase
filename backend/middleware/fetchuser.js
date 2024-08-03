var jwt = require('jsonwebtoken');
const JWT_SECRET = 'AmitKumar';

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
        return;
    }
    
    try {
        const data = jwt.verify(token, JWT_SECRET);
        if (data.user && data.user.userType === 'patient') {
            req.user = data.user;
        } else if (data.doctor && data.doctor.userType === 'doctor') {
            req.doctor = data.doctor;
        }
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchuser;
