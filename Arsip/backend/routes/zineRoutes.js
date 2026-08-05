const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');
const zineController = require('../controllers/zineController');

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
router.post('/', protect, upload.single('zine_file'), zineController.uploadZine);
router.get('/', zineController.getApprovedZines);

module.exports = router;
