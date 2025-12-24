const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  getInteractions, 
  getInteractionsByEntity,
  createInteraction 
} = require('../controllers/interactionController');
const auth = require('../middleware/auth');

// Validation middleware
const interactionValidation = [
  body('type').isIn(['call', 'email', 'meeting']).withMessage('Type must be call, email, or meeting'),
  body('notes').trim().notEmpty().withMessage('Notes are required'),
  body('linkedTo').isIn(['lead', 'customer']).withMessage('Must be linked to lead or customer'),
  body('linkedId').notEmpty().withMessage('Linked entity ID is required')
];

// All routes require authentication
router.use(auth);

router.route('/')
  .get(getInteractions)
  .post(interactionValidation, createInteraction);

// Get interactions by entity type and ID
router.get('/:linkedTo/:linkedId', getInteractionsByEntity);

module.exports = router;
