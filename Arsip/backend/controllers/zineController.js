const pool = require('../config/db');

exports.uploadZine = async (req, res) => {
    try {
        const { title, description } = req.body;
        const user_id = req.user.id;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = `/uploads/${req.file.filename}`;

        const [result] = await pool.query(
            'INSERT INTO zines (user_id, title, description, file_path) VALUES (?, ?, ?, ?)',
            [user_id, title, description, filePath]
        );

        res.status(201).json({ message: 'Zine uploaded successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.getApprovedZines = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT zines.*, users.name as author FROM zines JOIN users ON zines.user_id = users.id WHERE status = "approved" ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};


