const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

router.get('/stats', getStats);

module.exports = router;
