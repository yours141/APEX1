const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the same directory (HTML, CSS, JS)
app.use(express.static(__dirname));

// API Endpoint to handle form submissions
app.post('/api/contact', (req, res) => {
    const { name, phone, email, course, message } = req.body;

    if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Name, phone, and email are required.' });
    }

    const sql = `INSERT INTO contacts (name, phone, email, course, message) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, phone, email, course, message];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Failed to save contact data.' });
        }
        res.status(201).json({ 
            success: true, 
            message: 'Contact inquiry saved successfully.',
            id: this.lastID 
        });
    });
});

// Fallback route to serve index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
