const Ticket = require('../models/Ticket');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
exports.getTickets = async (req, res, next) => {
  try {
    let query = {};

    // Support agents can only see tickets assigned to them
    if (req.user.role === 'support_agent') {
      query.assignedTo = req.user.id;
    }

    const tickets = await Ticket.find(query)
      .populate('customerId', 'name email company')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customerId', 'name email company phone')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check access for support agent
    if (req.user.role === 'support_agent' && 
        ticket.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, priority, status, customerId, assignedTo } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      status: status || 'open',
      customerId,
      assignedTo: assignedTo || null,
      createdBy: req.user.id
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('customerId', 'name email company')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      ticket: populatedTicket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
exports.updateTicket = async (req, res, next) => {
  try {
    const { title, description, priority, status, customerId, assignedTo } = req.body;

    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Support agents can only update tickets assigned to them
    if (req.user.role === 'support_agent' && 
        ticket.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ticket'
      });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (priority) updateFields.priority = priority;
    if (status) updateFields.status = status;
    if (customerId) updateFields.customerId = customerId;
    
    // Only admin/manager can reassign
    if (assignedTo !== undefined && 
        (req.user.role === 'admin' || req.user.role === 'sales_manager')) {
      updateFields.assignedTo = assignedTo || null;
    }

    ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('customerId', 'name email company')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin, Manager only)
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
