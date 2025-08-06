const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Scanner = require('../models/scannerModel');
const Ticket = require('../models/ticketModel');
const { authenticateToken, authorizeScanner } = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// POST /api/scanner-app/login - Authenticate a scanner
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const scanner = await Scanner.findByUsername(username);
        if (!scanner) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, scanner.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check if the scanner's credentials are still valid
        if (new Date() > new Date(scanner.valid_until)) {
            return res.status(403).json({ message: 'Scanner credentials have expired' });
        }

        const payload = {
            user: {
                id: scanner.id,
                type: 'scanner',
                eventId: scanner.event_id // Include eventId for scanner context
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' }, // Scanner tokens can have a longer expiry
            (err, token) => {
                if (err) throw err;
                res.json({ message: 'Logged in successfully', token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/scanner-app/validate-ticket - Validate a ticket
router.post('/validate-ticket', authenticateToken, authorizeScanner, async (req, res) => {
    const { ticketId } = req.body;
    const scanner_id = req.user.id;
    const scanner_event_id = req.user.eventId; // Event ID associated with the scanner

    if (!ticketId) {
        return res.status(400).json({ message: 'Please provide a ticket ID' });
    }

    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Ensure the ticket belongs to the scanner's assigned event
        if (ticket.event_id !== scanner_event_id) {
            return res.status(403).json({ message: 'Ticket does not belong to this event' });
        }

        if (ticket.status === 'scanned') {
            return res.status(400).json({ message: 'Ticket already scanned', ticket });
        }

        const updatedTicket = await Ticket.updateStatus(ticketId, 'scanned', new Date(), scanner_id);

        // Increment tickets_sold for the event
        // This is a simplified approach; in a real app, you might have a more robust transaction
        // or a separate service for ticket sales/scanning to ensure consistency.
        // For now, we'll assume the ticket was "sold" before it's scanned.
        // If the ticket was just created (status 'available'), we might need to increment tickets_sold.
        // However, the prompt implies tickets are "sold" first, then "scanned".
        // So, we only update the status to 'scanned'.
        // If the requirement was to increment tickets_sold upon scanning, it would be:
        // await Event.incrementTicketsSold(scanner_event_id, 1);

        res.json({ message: 'Ticket validated successfully', ticket: updatedTicket });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;