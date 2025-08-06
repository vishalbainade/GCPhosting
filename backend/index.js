const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const scannerRoutes = require('./routes/scannerRoutes');
const scannerAppRoutes = require('./routes/scannerAppRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(cors()); // Enable CORS for all origins

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/scanners', scannerRoutes);
app.use('/api/scanner-app', scannerAppRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('EventHive Backend API is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});