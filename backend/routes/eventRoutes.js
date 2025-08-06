const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/eventModel');
const { authenticateToken, authorizeOrganizer } = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const bucket = require('../config/storage'); // Import Google Cloud Storage bucket

const router = express.Router();

// Configure multer for memory storage (needed for Google Cloud uploads)
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/events - Create a new event
router.post('/', authenticateToken, authorizeOrganizer, upload.array('images', 5), async (req, res) => {
    const { name, address, start_datetime, end_datetime, terms_and_conditions } = req.body;
    const organizer_id = req.user.id;

    // Parse and validate numeric inputs
    const total_tickets = parseInt(req.body.total_tickets, 10);
    const ticket_price = parseFloat(req.body.ticket_price);

    if (!name || !address || !start_datetime || !end_datetime || isNaN(total_tickets) || isNaN(ticket_price)) {
        return res.status(400).json({ message: 'Please fill out all required fields and provide valid numbers for tickets and price.' });
    }

    if (total_tickets <= 0) {
        return res.status(400).json({ message: 'Total tickets must be a positive number.' });
    }

    if (ticket_price < 0) {
        return res.status(400).json({ message: 'Ticket price cannot be negative.' });
    }

    try {
        const newEvent = await Event.create({
            organizer_id,
            name,
            address,
            start_datetime,
            end_datetime,
            total_tickets,
            ticket_price,
            terms_and_conditions,
        });

        // Upload images to Google Cloud Storage
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // Create a unique filename with organizer ID and UUID
                const filename = `${organizer_id}/${uuidv4()}${path.extname(file.originalname)}`;
                const blob = bucket.file(filename);
                
                // Create a write stream to upload the file
                const stream = blob.createWriteStream({
                    resumable: false,
                  //  public: true,
                    metadata: {
                        contentType: file.mimetype,
                    },
                });

                // Handle stream errors and completion
                await new Promise((resolve, reject) => {
                    stream.on('error', (err) => {
                        console.error('Upload error:', err);
                        reject(err);
                    });
                    
                    stream.on('finish', async () => {
                        // Generate the public URL for the uploaded file
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        
                        // Save the image URL to the database
                        await Event.addImage(newEvent.id, publicUrl);
                        resolve();
                    });
                    
                    // End the stream with the file buffer
                    stream.end(file.buffer);
                });
            }
        }

        res.status(201).json({ message: 'Event created and images uploaded successfully', event: newEvent });
    } catch (error) {
        console.error('Error creating event:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/events - Get all events by organizer
router.get('/', authenticateToken, authorizeOrganizer, async (req, res) => {
    try {
        const events = await Event.findByOrganizerId(req.user.id);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/events/:id - Get details for a single event
router.get('/:id', authenticateToken, authorizeOrganizer, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Ensure the event belongs to the logged-in organizer
        if (event.organizer_id !== req.user.id) {
            return res.status(403).json({ message: 'Access Denied: You do not own this event' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
