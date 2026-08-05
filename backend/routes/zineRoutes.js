const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const zineController = require('../controllers/zineController');

const router = express.Router();

// Always use memoryStorage — Cloudinary or Base64 uploads from buffer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const isAllowedMime = file.mimetype.startsWith('image/') || file.mimetype.includes('pdf') || file.mimetype === 'application/octet-stream';
        
        if (allowedExts.includes(ext) || isAllowedMime) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, PNG, and WEBP files are allowed'), false);
        }
    }
});

// Routes
router.post('/', protect, upload.single('zine_file'), zineController.uploadZine);
router.get('/', zineController.getApprovedZines);

module.exports = router;
