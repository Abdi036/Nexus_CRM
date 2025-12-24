const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  getTickets, 
  getTicket, 
  createTicket, 
  updateTicket, 
  deleteTicket 
} = require('../controllers/ticketController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Validation middleware
const ticketValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['open', 'in_progress', 'closed']).withMessage('Invalid status'),
  body('customerId').notEmpty().withMessage('Customer ID is required')
];

// All routes require authentication
router.use(auth);

router.route('/')
  .get(getTickets)
  .post(ticketValidation, createTicket);

router.route('/:id')
  .get(getTicket)
  .put(updateTicket)
  .delete(
    authorize('admin', 'sales_manager'),
    deleteTicket
  );

module.exports = router;
