const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res, next) => {
  try {
    let query = {};

    // Sales reps can only see leads assigned to them
    if (req.user.role === 'sales_rep') {
      query.assignedTo = req.user.id;
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('convertedToCustomerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('convertedToCustomerId', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check access for sales rep
    if (req.user.role === 'sales_rep' && 
        lead.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this lead'
      });
    }

    res.json({
      success: true,
      lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private (Admin, Sales Manager)
exports.createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      status: status || 'new',
      assignedTo: assignedTo || null,
      createdBy: req.user.id
    });

    const populatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      lead: populatedLead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private (Admin, Sales Manager, or assigned Sales Rep)
exports.updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, assignedTo } = req.body;

    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check authorization for sales rep
    if (req.user.role === 'sales_rep' && 
        lead.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead'
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (company) updateFields.company = company;
    if (status) updateFields.status = status;
    
    // Only admin/manager can reassign
    if (assignedTo !== undefined && 
        (req.user.role === 'admin' || req.user.role === 'sales_manager')) {
      updateFields.assignedTo = assignedTo || null;
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin, Sales Manager)
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Convert lead to customer
// @route   POST /api/leads/:id/convert
// @access  Private
exports.convertToCustomer = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    if (lead.status === 'converted') {
      return res.status(400).json({
        success: false,
        message: 'Lead is already converted'
      });
    }

    // Create customer from lead
    const customer = await Customer.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      createdBy: req.user.id
    });

    // Update lead status
    lead.status = 'converted';
    lead.convertedToCustomerId = customer._id;
    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('convertedToCustomerId', 'name email');

    res.json({
      success: true,
      message: 'Lead converted to customer successfully',
      lead: updatedLead,
      customer
    });
  } catch (error) {
    next(error);
  }
};
