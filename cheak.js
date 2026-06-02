const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('apex.db');

db.all("SELECT * FROM contacts", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log("Contacts:");
    console.table(rows);
});

db.close();