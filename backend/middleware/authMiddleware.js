const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Auth Header:', authHeader);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'No token');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        
        if (!decoded.user) {
            return res.status(403).json({ message: 'Invalid token structure' });
        }
        req.user = decoded.user;
        console.log('User set on request:', req.user);
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', expired: true });
        }
        res.status(403).json({ message: 'Invalid Token: ' + error.message });
    }
};

const authorizeOrganizer = (req, res, next) => {
    console.log('Authorizing organizer, user:', req.user);
    console.log('authorizeOrganizer → req.user:', req.user);

    if (req.user && req.user.type === 'organizer') {
        console.log('User authorized as organizer');
        next();
    } else {
        console.log('User not authorized as organizer, type:', req.user?.type);
        res.status(403).json({ message: 'Access Denied: Organizers only' });
    }
};

const authorizeScanner = (req, res, next) => {
    if (req.user && req.user.type === 'scanner') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Scanners only' });
    }
};

module.exports = {
    authenticateToken,
    authorizeOrganizer,
    authorizeScanner
};

