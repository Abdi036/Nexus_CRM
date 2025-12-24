const User = require('../models/User');
const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Interaction = require('../models/Interaction');
const Ticket = require('../models/Ticket');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Base stats accessible to all
    const totalCustomers = await Customer.countDocuments();

    let leadQuery = {};
    let ticketQuery = {};

    // Filter based on role
    if (userRole === 'sales_rep') {
      leadQuery.assignedTo = userId;
    }
    if (userRole === 'support_agent') {
      ticketQuery.assignedTo = userId;
    }

    // Lead statistics
    const totalLeads = await Lead.countDocuments(leadQuery);
    const newLeads = await Lead.countDocuments({ ...leadQuery, status: 'new' });
    const contactedLeads = await Lead.countDocuments({ ...leadQuery, status: 'contacted' });
    const qualifiedLeads = await Lead.countDocuments({ ...leadQuery, status: 'qualified' });
    const convertedLeads = await Lead.countDocuments({ ...leadQuery, status: 'converted' });

    // Ticket statistics
    const totalTickets = await Ticket.countDocuments(ticketQuery);
    const openTickets = await Ticket.countDocuments({ ...ticketQuery, status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ ...ticketQuery, status: 'in_progress' });
    const closedTickets = await Ticket.countDocuments({ ...ticketQuery, status: 'closed' });
    const highPriorityTickets = await Ticket.countDocuments({ 
      ...ticketQuery, 
      priority: 'high', 
      status: { $ne: 'closed' } 
    });
    const mediumPriorityTickets = await Ticket.countDocuments({ ...ticketQuery, priority: 'medium' });
    const lowPriorityTickets = await Ticket.countDocuments({ ...ticketQuery, priority: 'low' });

    // Interaction statistics
    const totalInteractions = await Interaction.countDocuments();
    const callInteractions = await Interaction.countDocuments({ type: 'call' });
    const emailInteractions = await Interaction.countDocuments({ type: 'email' });
    const meetingInteractions = await Interaction.countDocuments({ type: 'meeting' });

    // Recent interactions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentInteractions = await Interaction.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // User statistics (admin only)
    let userStats = null;
    if (userRole === 'admin') {
      const totalUsers = await User.countDocuments();
      const adminUsers = await User.countDocuments({ role: 'admin' });
      const managerUsers = await User.countDocuments({ role: 'sales_manager' });
      const salesRepUsers = await User.countDocuments({ role: 'sales_rep' });
      const supportAgentUsers = await User.countDocuments({ role: 'support_agent' });

      userStats = {
        total: totalUsers,
        byRole: {
          admin: adminUsers,
          sales_manager: managerUsers,
          sales_rep: salesRepUsers,
          support_agent: supportAgentUsers
        }
      };
    }

    res.json({
      success: true,
      stats: {
        customers: {
          total: totalCustomers
        },
        leads: {
          total: totalLeads,
          byStatus: {
            new: newLeads,
            contacted: contactedLeads,
            qualified: qualifiedLeads,
            converted: convertedLeads
          }
        },
        tickets: {
          total: totalTickets,
          byStatus: {
            open: openTickets,
            in_progress: inProgressTickets,
            closed: closedTickets
          },
          byPriority: {
            high: highPriorityTickets,
            medium: mediumPriorityTickets,
            low: lowPriorityTickets
          },
          highPriorityOpen: highPriorityTickets
        },
        interactions: {
          total: totalInteractions,
          recent: recentInteractions,
          byType: {
            call: callInteractions,
            email: emailInteractions,
            meeting: meetingInteractions
          }
        },
        users: userStats
      }
    });
  } catch (error) {
    next(error);
  }
};
