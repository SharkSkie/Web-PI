const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/zines', protect, admin, adminController.getAllZines);
router.put('/zines/:id', protect, admin, adminController.updateZineStatus);
router.delete('/zines/:id', protect, admin, adminController.deleteZine);

module.exports = router;
