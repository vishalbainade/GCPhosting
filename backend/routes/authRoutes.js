// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Organizer = require('../models/organizerModel');
// const { authenticateToken } = require('../middleware/authMiddleware');
// require('dotenv').config();

// const router = express.Router();

// // POST /api/auth/register
// router.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ message: 'Please enter all fields' });
//     }

//     try {
//         let organizer = await Organizer.findByEmail(email);
//         if (organizer) {
//             return res.status(400).json({ message: 'Organizer with this email already exists' });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const password_hash = await bcrypt.hash(password, salt);

//         organizer = await Organizer.create(name, email, password_hash);

//         const token = jwt.sign(
//             { user: { id: organizer.id, type: 'organizer' } },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.status(201).json({ message: 'Organizer registered successfully', token });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error');
//     }
// });

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Please enter all fields' });
//     }

//     try {
//         const organizer = await Organizer.findByEmail(email);
//         if (!organizer) {
//             return res.status(400).json({ message: 'Invalid Credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, organizer.password_hash);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid Credentials' });
//         }

//         const token = jwt.sign(
//             { user: { id: organizer.id, type: 'organizer' } },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.json({ message: 'Logged in successfully', token });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error');
//     }
// });

// // POST /api/auth/logout
// router.post('/logout', authenticateToken, async (req, res) => {
//     // In a real app, you'd blacklist the token
//     res.json({ message: 'Logged out successfully' });
// });

// // POST /api/auth/refresh-token
// router.post('/refresh-token', authenticateToken, async (req, res) => {
//     try {
//         const token = jwt.sign(
//             { user: { id: req.user.id, type: req.user.type } },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.json({ token });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Server Error');
//     }
// });

// module.exports = router;



const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organizer = require('../models/organizerModel');
const { authenticateToken } = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        let organizer = await Organizer.findByEmail(email);
        if (organizer) {
            return res.status(400).json({ message: 'Organizer with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        organizer = await Organizer.create(name, email, password_hash);

        const payload = {
            user: {
                id: organizer.id,
                type: 'organizer'
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Organizer registered successfully',
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const organizer = await Organizer.findByEmail(email);
        if (!organizer) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, organizer.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: organizer.id,
                type: 'organizer'
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Logged in successfully',
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
    // Optional: Implement token invalidation (e.g., blacklist)
    res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/refresh-token
router.post('/refresh-token', authenticateToken, (req, res) => {
    try {
        const payload = {
            user: {
                id: req.user.id,
                type: req.user.type
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
