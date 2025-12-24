const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  getLeads, 
  getLead, 
  createLead, 
  updateLead, 
  deleteLead,
  convertToCustomer 
} = require('../controllers/leadController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Validation middleware
const leadValidation = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('status').optional().isIn(['new', 'contacted', 'qualified', 'converted']).withMessage('Invalid status')
];

// All routes require authentication
router.use(auth);

router.route('/')
  .get(getLeads)
  .post(
    authorize('admin', 'sales_manager'),
    leadValidation,
    createLead
  );

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(
    authorize('admin', 'sales_manager'),
    deleteLead
  );

// Convert lead to customer
router.post('/:id/convert', convertToCustomer);

module.exports = router;
