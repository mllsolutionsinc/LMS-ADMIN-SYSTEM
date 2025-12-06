const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerTutor, getTutors } = require('../controllers/tutorController');

// Protect routes with authentication
router.post('/register', authMiddleware, registerTutor);
router.get('/', authMiddleware, getTutors);

module.exports = router;