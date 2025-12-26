// Mock Data for CRM System

export type UserRole =
  | "admin"
  | "sales_manager"
  | "sales_rep"
  | "support_agent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string; // In real app, this would be hashed
  createdAt: Date;
  avatarUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: Date;
  createdBy: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "converted";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: Date;
  createdBy: string;
  convertedToCustomerId?: string;
}

export type InteractionType = "call" | "email" | "meeting";

export interface Interaction {
  id: string;
  type: InteractionType;
  notes: string;
  linkedTo: "lead" | "customer";
  linkedId: string;
  createdBy: string;
  createdAt: Date;
}

export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus = "open" | "in_progress" | "closed";

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  customerId: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@crm.com",
    role: "admin",
    password: "admin123",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "John Manager",
    email: "manager@crm.com",
    role: "sales_manager",
    password: "manager123",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Sarah Sales",
    email: "sales@crm.com",
    role: "sales_rep",
    password: "sales123",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Mike Support",
    email: "support@crm.com",
    role: "support_agent",
    password: "support123",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "Emily Sales",
    email: "emily@crm.com",
    role: "sales_rep",
    password: "emily123",
    createdAt: new Date("2024-01-01"),
  },
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1-555-0101",
    company: "Acme Corp",
    createdAt: new Date("2024-02-15"),
    createdBy: "3",
  },
  {
    id: "c2",
    name: "Tech Innovations",
    email: "hello@techinnovations.com",
    phone: "+1-555-0102",
    company: "Tech Innovations Inc",
    createdAt: new Date("2024-03-01"),
    createdBy: "3",
  },
  {
    id: "c3",
    name: "Global Solutions",
    email: "info@globalsolutions.com",
    phone: "+1-555-0103",
    company: "Global Solutions LLC",
    createdAt: new Date("2024-03-10"),
    createdBy: "5",
  },
  {
    id: "c4",
    name: "Future Systems",
    email: "contact@futuresystems.com",
    phone: "+1-555-0104",
    company: "Future Systems",
    createdAt: new Date("2024-04-01"),
    createdBy: "3",
  },
];

// Mock Leads
export const mockLeads: Lead[] = [
  {
    id: "l1",
    name: "Startup Ventures",
    email: "info@startupventures.com",
    phone: "+1-555-0201",
    company: "Startup Ventures",
    status: "new",
    assignedTo: "3",
    createdAt: new Date("2024-12-01"),
    createdBy: "2",
  },
  {
    id: "l2",
    name: "Digital Agency",
    email: "hello@digitalagency.com",
    phone: "+1-555-0202",
    company: "Digital Agency Co",
    status: "contacted",
    assignedTo: "3",
    createdAt: new Date("2024-12-05"),
    createdBy: "2",
  },
  {
    id: "l3",
    name: "Enterprise Ltd",
    email: "contact@enterprise.com",
    phone: "+1-555-0203",
    company: "Enterprise Ltd",
    status: "qualified",
    assignedTo: "5",
    createdAt: new Date("2024-12-10"),
    createdBy: "2",
  },
  {
    id: "l4",
    name: "Cloud Services",
    email: "info@cloudservices.com",
    phone: "+1-555-0204",
    company: "Cloud Services Inc",
    status: "new",
    assignedTo: "5",
    createdAt: new Date("2024-12-15"),
    createdBy: "2",
  },
  {
    id: "l5",
    name: "Mobile First",
    email: "hello@mobilefirst.com",
    phone: "+1-555-0205",
    company: "Mobile First",
    status: "contacted",
    assignedTo: "3",
    createdAt: new Date("2024-12-18"),
    createdBy: "2",
  },
];

// Mock Interactions
export const mockInteractions: Interaction[] = [
  {
    id: "i1",
    type: "call",
    notes: "Initial discovery call. Discussed their needs and budget.",
    linkedTo: "lead",
    linkedId: "l2",
    createdBy: "3",
    createdAt: new Date("2024-12-06"),
  },
  {
    id: "i2",
    type: "email",
    notes: "Sent proposal and pricing information.",
    linkedTo: "lead",
    linkedId: "l3",
    createdBy: "5",
    createdAt: new Date("2024-12-11"),
  },
  {
    id: "i3",
    type: "meeting",
    notes: "Quarterly business review. All going well.",
    linkedTo: "customer",
    linkedId: "c1",
    createdBy: "3",
    createdAt: new Date("2024-12-12"),
  },
  {
    id: "i4",
    type: "call",
    notes: "Follow-up call to address concerns.",
    linkedTo: "customer",
    linkedId: "c2",
    createdBy: "3",
    createdAt: new Date("2024-12-14"),
  },
  {
    id: "i5",
    type: "email",
    notes: "Sent demo invitation and calendar link.",
    linkedTo: "lead",
    linkedId: "l1",
    createdBy: "3",
    createdAt: new Date("2024-12-02"),
  },
];

// Mock Support Tickets
export const mockTickets: SupportTicket[] = [
  {
    id: "t1",
    title: "Login issues on mobile app",
    description: "Customer cannot log in from their mobile device.",
    priority: "high",
    status: "open",
    customerId: "c1",
    assignedTo: "4",
    createdBy: "4",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "t2",
    title: "Feature request: Export to CSV",
    description: "Customer wants to export their data to CSV format.",
    priority: "low",
    status: "in_progress",
    customerId: "c2",
    assignedTo: "4",
    createdBy: "4",
    createdAt: new Date("2024-12-18"),
    updatedAt: new Date("2024-12-19"),
  },
  {
    id: "t3",
    title: "Billing discrepancy",
    description: "Customer was charged twice for the same invoice.",
    priority: "high",
    status: "in_progress",
    customerId: "c3",
    assignedTo: "4",
    createdBy: "4",
    createdAt: new Date("2024-12-21"),
    updatedAt: new Date("2024-12-21"),
  },
  {
    id: "t4",
    title: "Need training on new features",
    description: "Customer needs training session for new dashboard.",
    priority: "medium",
    status: "open",
    customerId: "c4",
    assignedTo: "4",
    createdBy: "4",
    createdAt: new Date("2024-12-19"),
    updatedAt: new Date("2024-12-19"),
  },
];
