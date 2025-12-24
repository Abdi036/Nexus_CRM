const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Validation middleware
const userValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'sales_manager', 'sales_rep', 'support_agent']).withMessage('Invalid role')
];

// All routes require admin access
router.use(auth);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(userValidation, createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
