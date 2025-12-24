const Interaction = require('../models/Interaction');

// @desc    Get all interactions
// @route   GET /api/interactions
// @access  Private
exports.getInteractions = async (req, res, next) => {
  try {
    const interactions = await Interaction.find()
      .populate('createdBy', 'name email')
      .populate({
        path: 'linkedId',
        select: 'name email company'
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: interactions.length,
      interactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interactions by entity
// @route   GET /api/interactions/:linkedTo/:linkedId
// @access  Private
exports.getInteractionsByEntity = async (req, res, next) => {
  try {
    const { linkedTo, linkedId } = req.params;

    if (!['lead', 'customer'].includes(linkedTo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type. Must be "lead" or "customer"'
      });
    }

    const interactions = await Interaction.find({
      linkedTo,
      linkedId
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: interactions.length,
      interactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create interaction
// @route   POST /api/interactions
// @access  Private
exports.createInteraction = async (req, res, next) => {
  try {
    const { type, notes, linkedTo, linkedId } = req.body;

    if (!['lead', 'customer'].includes(linkedTo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type. Must be "lead" or "customer"'
      });
    }

    const interaction = await Interaction.create({
      type,
      notes,
      linkedTo,
      linkedId,
      createdBy: req.user.id
    });

    const populatedInteraction = await Interaction.findById(interaction._id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'linkedId',
        select: 'name email company'
      });

    res.status(201).json({
      success: true,
      interaction: populatedInteraction
    });
  } catch (error) {
    next(error);
  }
};
