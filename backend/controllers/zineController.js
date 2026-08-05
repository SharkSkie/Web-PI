const pool = require('../config/db');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables if available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

/**
 * Upload a buffer to Cloudinary with automatic Base64 Data URL fallback
 */
const saveZineFile = async (file) => {
    const { buffer, originalname, mimetype } = file;
    const cleanName = originalname.replace(/\.[^/.]+$/, "").replace(/\s+/g, '_');
    const filename = `${Date.now()}-${cleanName}`;

    // Try Cloudinary first if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        try {
            const url = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'auto',
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
            return url;
        } catch (cloudinaryError) {
            console.warn('Cloudinary upload failed, falling back to Data URL:', cloudinaryError.message);
        }
    }

    // Fallback: Convert to Base64 Data URL so upload and preview ALWAYS succeed!
    const base64Data = buffer.toString('base64');
    return `data:${mimetype};base64,${base64Data}`;
};

exports.uploadZine = async (req, res) => {
    try {
        const { title, description } = req.body;
        const user_id = req.user.id;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Save file (Cloudinary or Data URL fallback)
        const fileUrl = await saveZineFile(req.file);

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
