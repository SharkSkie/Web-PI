const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'super_secret_zine_key_12345';
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanName = name.trim();

        const [userExists] = await pool.query('SELECT email FROM users WHERE LOWER(TRIM(email)) = ?', [cleanEmail]);
        if (userExists.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.trim(), salt);

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(TRIM(email)) = ?', [cleanEmail]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];

        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(cleanPassword, user.password);
        } catch(e) {}

        if (!isMatch && (cleanPassword === user.password || password === user.password)) {
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
