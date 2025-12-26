require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const Interaction = require("../models/Interaction");
const Ticket = require("../models/Ticket");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

// Mock Users (matching frontend mock data)
const users = [
  {
    name: "Admin User",
    email: "admin@crm.com",
    role: "admin",
    password: "admin123",
  },
  {
    name: "John Manager",
    email: "manager@crm.com",
    role: "sales_manager",
    password: "manager123",
  },
  {
    name: "Sarah Sales",
    email: "sales@crm.com",
    role: "sales_rep",
    password: "sales123",
  },
  {
    name: "Emily Sales",
    email: "emily@crm.com",
    role: "sales_rep",
    password: "emily123",
  },
  {
    name: "Beki Support",
    email: "support1@crm.com",
    role: "support_agent",
    password: "support123",
  },
  {
    name: "Mike Support",
    email: "support2@crm.com",
    role: "support_agent",
    password: "support123",
  },
  {
    name: "Abdi Support",
    email: "support3@crm.com",
    role: "support_agent",
    password: "support123",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany();
    await Customer.deleteMany();
    await Lead.deleteMany();
    await Interaction.deleteMany();
    await Ticket.deleteMany();

    // Create users
    console.log("Creating users...");
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Map users by role for easy access
    const admin = createdUsers.find((u) => u.role === "admin");
    const manager = createdUsers.find((u) => u.role === "sales_manager");
    const salesReps = createdUsers.filter((u) => u.role === "sales_rep");
    const supportAgent = createdUsers.find((u) => u.role === "support_agent");

    // Create customers
    console.log("Creating customers...");
    const customersData = [
      {
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "+1-555-0101",
        company: "Acme Corp",
        createdBy: salesReps[0]._id,
      },
      {
        name: "Tech Innovations",
        email: "hello@techinnovations.com",
        phone: "+1-555-0102",
        company: "Tech Innovations Inc",
        createdBy: salesReps[0]._id,
      },
      {
        name: "Global Solutions",
        email: "info@globalsolutions.com",
        phone: "+1-555-0103",
        company: "Global Solutions LLC",
        createdBy: salesReps[1]._id,
      },
      {
        name: "Future Systems",
        email: "contact@futuresystems.com",
        phone: "+1-555-0104",
        company: "Future Systems",
        createdBy: salesReps[0]._id,
      },
    ];
    const createdCustomers = await Customer.create(customersData);
    console.log(`Created ${createdCustomers.length} customers`);

    // Create leads
    console.log("Creating leads...");
    const leadsData = [
      {
        name: "Startup Ventures",
        email: "info@startupventures.com",
        phone: "+1-555-0201",
        company: "Startup Ventures",
        status: "new",
        assignedTo: salesReps[0]._id,
        createdBy: manager._id,
      },
      {
        name: "Digital Agency",
        email: "hello@digitalagency.com",
        phone: "+1-555-0202",
        company: "Digital Agency Co",
        status: "contacted",
        assignedTo: salesReps[0]._id,
        createdBy: manager._id,
      },
      {
        name: "Enterprise Ltd",
        email: "contact@enterprise.com",
        phone: "+1-555-0203",
        company: "Enterprise Ltd",
        status: "qualified",
        assignedTo: salesReps[1]._id,
        createdBy: manager._id,
      },
      {
        name: "Cloud Services",
        email: "info@cloudservices.com",
        phone: "+1-555-0204",
        company: "Cloud Services Inc",
        status: "new",
        assignedTo: salesReps[1]._id,
        createdBy: manager._id,
      },
      {
        name: "Mobile First",
        email: "hello@mobilefirst.com",
        phone: "+1-555-0205",
        company: "Mobile First",
        status: "contacted",
        assignedTo: salesReps[0]._id,
        createdBy: manager._id,
      },
    ];
    const createdLeads = await Lead.create(leadsData);
    console.log(`Created ${createdLeads.length} leads`);

    // Create interactions
    console.log("Creating interactions...");
    const interactionsData = [
      {
        type: "call",
        notes: "Initial discovery call. Discussed their needs and budget.",
        linkedTo: "lead",
        linkedId: createdLeads[1]._id,
        linkedModel: "Lead",
        createdBy: salesReps[0]._id,
      },
      {
        type: "email",
        notes: "Sent proposal and pricing information.",
        linkedTo: "lead",
        linkedId: createdLeads[2]._id,
        linkedModel: "Lead",
        createdBy: salesReps[1]._id,
      },
      {
        type: "meeting",
        notes: "Quarterly business review. All going well.",
        linkedTo: "customer",
        linkedId: createdCustomers[0]._id,
        linkedModel: "Customer",
        createdBy: salesReps[0]._id,
      },
      {
        type: "call",
        notes: "Follow-up call to address concerns.",
        linkedTo: "customer",
        linkedId: createdCustomers[1]._id,
        linkedModel: "Customer",
        createdBy: salesReps[0]._id,
      },
      {
        type: "email",
        notes: "Sent demo invitation and calendar link.",
        linkedTo: "lead",
        linkedId: createdLeads[0]._id,
        linkedModel: "Lead",
        createdBy: salesReps[0]._id,
      },
    ];
    const createdInteractions = await Interaction.create(interactionsData);
    console.log(`Created ${createdInteractions.length} interactions`);

    // Create support tickets
    console.log("Creating support tickets...");
    const ticketsData = [
      {
        title: "Login issues on mobile app",
        description: "Customer cannot log in from their mobile device.",
        priority: "high",
        status: "open",
        customerId: createdCustomers[0]._id,
        assignedTo: supportAgent._id,
        createdBy: supportAgent._id,
      },
      {
        title: "Feature request: Export to CSV",
        description: "Customer wants to export their data to CSV format.",
        priority: "low",
        status: "in_progress",
        customerId: createdCustomers[1]._id,
        assignedTo: supportAgent._id,
        createdBy: supportAgent._id,
      },
      {
        title: "Billing discrepancy",
        description: "Customer was charged twice for the same invoice.",
        priority: "high",
        status: "in_progress",
        customerId: createdCustomers[2]._id,
        assignedTo: supportAgent._id,
        createdBy: supportAgent._id,
      },
      {
        title: "Need training on new features",
        description: "Customer needs training session for new dashboard.",
        priority: "medium",
        status: "open",
        customerId: createdCustomers[3]._id,
        assignedTo: supportAgent._id,
        createdBy: supportAgent._id,
      },
    ];
    const createdTickets = await Ticket.create(ticketsData);
    console.log(`Created ${createdTickets.length} support tickets`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDemo Accounts:");
    console.log("  Admin: admin@crm.com / admin123");
    console.log("  Manager: manager@crm.com / manager123");
    console.log("  Sales: sales@crm.com / sales123");
    console.log("  Support: support@crm.com / support123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
