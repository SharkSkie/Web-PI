const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const questionnaireController = require('../controllers/questionnaireController');

const router = express.Router();

router.post('/', protect, questionnaireController.submitQuestionnaire);
router.get('/result/:id', protect, questionnaireController.getResult);

module.exports = router;
