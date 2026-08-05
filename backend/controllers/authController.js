const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'super_secret_zine_key_12345';
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// Helper to safely parse req.body in Vercel serverless environment
const parseBody = (req) => {
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {}
    }
    return body || {};
};

exports.registerUser = async (req, res) => {
    try {
        const body = parseBody(req);
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        const cleanEmail = String(email).trim().toLowerCase();
        const cleanName = String(name).trim();
        const cleanPassword = String(password).trim();

        const [userExists] = await pool.query('SELECT email FROM users WHERE LOWER(TRIM(email)) = ?', [cleanEmail]);
        if (userExists.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(cleanPassword, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [cleanName, cleanEmail, hashedPassword]
        );

        res.status(201).json({
            id: result.insertId,
            name: cleanName,
            email: cleanEmail,
            role: 'user',
            token: generateToken(result.insertId)
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message || 'Database error during registration' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const body = parseBody(req);
        const { email, password } = body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPassword = String(password).trim();

        const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(TRIM(email)) = ?', [cleanEmail]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(cleanPassword, user.password);
        } catch(e) {}

        if (!isMatch && (cleanPassword === user.password || String(password) === user.password)) {
            isMatch = true;
        }

        if (isMatch) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message || 'Database error during login' });
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};
