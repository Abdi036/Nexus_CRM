const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  getCustomers, 
  getCustomer, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer 
} = require('../controllers/customerController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Validation middleware
const customerValidation = [
  body('name').trim().notEmpty().withMessage('Customer name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('company').trim().notEmpty().withMessage('Company name is required')
];

// All routes require authentication
router.use(auth);

router.route('/')
  .get(getCustomers)
  .post(
    authorize('admin', 'sales_manager', 'sales_rep'),
    customerValidation,
    createCustomer
  );

router.route('/:id')
  .get(getCustomer)
  .put(
    authorize('admin', 'sales_manager', 'sales_rep'),
    updateCustomer
  )
  .delete(
    authorize('admin', 'sales_manager', 'sales_rep'),
    deleteCustomer
  );

module.exports = router;
