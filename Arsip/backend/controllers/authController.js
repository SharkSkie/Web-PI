const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please add all fields' });
        }

        const [userExists] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            role: 'user',
            token: generateToken(result.insertId)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];

        // Some seeder users might have plain text "password". Fallback to direct check if no bcrypt hash match
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch(e) {}
        
        if (!isMatch && password === user.password) {
            // For Demo users seeded without bcrypt
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
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};
