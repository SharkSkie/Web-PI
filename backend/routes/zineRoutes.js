const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const zineController = require('../controllers/zineController');

const router = express.Router();

// Always use memoryStorage — Cloudinary uploads from buffer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
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
