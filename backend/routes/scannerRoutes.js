const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Scanner = require('../models/scannerModel');
const { authenticateToken, authorizeOrganizer } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/scanners - Create a new scanner
router.post('/', authenticateToken, authorizeOrganizer, async (req, res) => {
    const { name, eventId, validityInDays } = req.body;
    const organizer_id = req.user.id;

    if (!name || !eventId || !validityInDays) {
        return res.status(400).json({ message: 'Please enter all required scanner fields' });
    }

    try {
        const username = `scanner_${uuidv4().split('-')[0]}`; // Generate a unique username
        const rawPassword = Math.random().toString(36).slice(-8); // Generate a random 8-character password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(rawPassword, salt);

        const valid_until = new Date();
        valid_until.setDate(valid_until.getDate() + parseInt(validityInDays));

        const newScanner = await Scanner.create(
            organizer_id,
            eventId,
            name,
            username,
            password_hash,
            valid_until
        );

        res.status(201).json({
            message: 'Scanner created successfully',
            scanner: {
                id: newScanner.id,
                name: newScanner.name,
                eventId: newScanner.event_id,
                username: newScanner.username,
                password: rawPassword, // Return raw password ONCE
                valid_until: newScanner.valid_until
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/scanners - Get all scanners by organizer
router.get('/', authenticateToken, authorizeOrganizer, async (req, res) => {
    try {
        const scanners = await Scanner.findByOrganizerId(req.user.id);
        res.json(scanners);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/scanners/:id - Delete a scanner
router.delete('/:id', authenticateToken, authorizeOrganizer, async (req, res) => {
    try {
        const deletedScanner = await Scanner.delete(req.params.id);
        if (!deletedScanner) {
            return res.status(404).json({ message: 'Scanner not found' });
        }
        res.json({ message: 'Scanner deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;