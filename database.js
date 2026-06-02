const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (will create apex.db in the same directory)
const dbPath = path.resolve(__dirname, 'apex.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create the contacts table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            course TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Contacts table ready.');
            }
        });
    }
});

module.exports = db;
