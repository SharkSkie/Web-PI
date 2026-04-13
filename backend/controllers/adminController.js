const pool = require('../config/db');

exports.getAllZines = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT zines.*, users.name as author FROM zines JOIN users ON zines.user_id = users.id ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.updateZineStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await pool.query('UPDATE zines SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Zine marked as ${status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
