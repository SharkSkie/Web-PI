const pool = require('../config/db');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a buffer to Cloudinary and return the secure URL
 */
const uploadToCloudinary = (buffer, originalname) => {
    return new Promise((resolve, reject) => {
        const filename = `${Date.now()}-${originalname.replace(/\s+/g, '_')}`;
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',  // PDF files must use 'raw'
                folder: 'mindzine',
                public_id: filename
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

exports.uploadZine = async (req, res) => {
    try {
        const { title, description } = req.body;
        const user_id = req.user.id;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload file buffer to Cloudinary
        const fileUrl = await uploadToCloudinary(req.file.buffer, req.file.originalname);

        const [result] = await pool.query(
            'INSERT INTO zines (user_id, title, description, file_path) VALUES (?, ?, ?, ?)',
            [user_id, title, description, fileUrl]
        );

        res.status(201).json({ message: 'Zine uploaded successfully', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
};

exports.getApprovedZines = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT zines.*, users.name as author FROM zines JOIN users ON zines.user_id = users.id WHERE status = "approved" ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
