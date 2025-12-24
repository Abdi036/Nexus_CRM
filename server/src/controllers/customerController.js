const Customer = require('../models/Customer');
const Interaction = require('../models/Interaction');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get interactions count
    const interactionsCount = await Interaction.countDocuments({
      linkedTo: 'customer',
      linkedId: customer._id
    });

    res.json({
      success: true,
      customer: {
        ...customer.toObject(),
        interactionsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private (Admin, Sales Manager, Sales Rep)
exports.createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private (Admin, Sales Manager, Sales Rep)
exports.updateCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company } = req.body;

    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin, Sales Manager, Sales Rep)
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    // Optionally delete related interactions
    await Interaction.deleteMany({
      linkedTo: 'customer',
      linkedId: req.params.id
    });

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
