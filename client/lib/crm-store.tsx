"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  customersApi,
  leadsApi,
  interactionsApi,
  ticketsApi,
  usersApi,
  type Customer,
  type Lead,
  type Interaction,
  type Ticket,
  type User,
  type LeadStatus,
  type InteractionType,
  type TicketPriority,
  type TicketStatus,
} from "./api";

// Helper to get ID from object or string
const getId = (obj: { _id: string } | string | null | undefined): string | undefined => {
  if (!obj) return undefined;
  if (typeof obj === 'string') return obj;
  return obj._id;
};

// Transform API response to frontend format
const transformCustomer = (customer: Customer) => ({
  id: customer._id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
  company: customer.company,
  createdBy: getId(customer.createdBy) || '',
  createdAt: new Date(customer.createdAt),
});

const transformLead = (lead: Lead) => ({
  id: lead._id,
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  company: lead.company,
  status: lead.status,
  assignedTo: getId(lead.assignedTo),
  createdBy: getId(lead.createdBy) || '',
  convertedToCustomerId: lead.convertedToCustomerId || undefined,
  createdAt: new Date(lead.createdAt),
});

const transformInteraction = (interaction: Interaction) => ({
  id: interaction._id,
  type: interaction.type,
  notes: interaction.notes,
  linkedTo: interaction.linkedTo,
  linkedId: interaction.linkedId,
  createdBy: getId(interaction.createdBy) || '',
  createdAt: new Date(interaction.createdAt),
});

const transformTicket = (ticket: Ticket) => ({
  id: ticket._id,
  title: ticket.title,
  description: ticket.description,
  priority: ticket.priority,
  status: ticket.status,
  customerId: getId(ticket.customerId) || '',
  assignedTo: getId(ticket.assignedTo),
  createdBy: getId(ticket.createdBy) || '',
  createdAt: new Date(ticket.createdAt),
  updatedAt: new Date(ticket.updatedAt),
});

const transformUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl,
  createdAt: new Date(user.createdAt),
  password: '', // Password not returned from API
});

// Frontend types (matching original mock-data types)
interface FrontendCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: Date;
  createdBy: string;
}

interface FrontendLead {
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

interface FrontendInteraction {
  id: string;
  type: InteractionType;
  notes: string;
  linkedTo: "lead" | "customer";
  linkedId: string;
  createdBy: string;
  createdAt: Date;
}

interface FrontendTicket {
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

interface FrontendUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "sales_manager" | "sales_rep" | "support_agent";
  password: string;
  createdAt: Date;
  avatarUrl?: string;
}

interface CRMStoreContextType {
  // Customers
  customers: FrontendCustomer[];
  addCustomer: (customer: Omit<FrontendCustomer, "id" | "createdAt">) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<FrontendCustomer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Leads
  leads: FrontendLead[];
  addLead: (lead: Omit<FrontendLead, "id" | "createdAt">) => Promise<void>;
  updateLead: (id: string, lead: Partial<FrontendLead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertLeadToCustomer: (leadId: string, createdBy: string) => Promise<void>;

  // Interactions
  interactions: FrontendInteraction[];
  addInteraction: (interaction: Omit<FrontendInteraction, "id" | "createdAt">) => Promise<void>;

  // Support Tickets
  tickets: FrontendTicket[];
  addTicket: (ticket: Omit<FrontendTicket, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTicket: (id: string, ticket: Partial<FrontendTicket>) => Promise<void>;

  // Users
  users: FrontendUser[];
  addUser: (user: Omit<FrontendUser, "id" | "createdAt">) => Promise<void>;
  updateUser: (id: string, user: Partial<FrontendUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Loading states
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const CRMStoreContext = createContext<CRMStoreContextType | undefined>(undefined);

export function CRMStoreProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<FrontendCustomer[]>([]);
  const [leads, setLeads] = useState<FrontendLead[]>([]);
  const [interactions, setInteractions] = useState<FrontendInteraction[]>([]);
  const [tickets, setTickets] = useState<FrontendTicket[]>([]);
  const [users, setUsers] = useState<FrontendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [customersRes, leadsRes, interactionsRes, ticketsRes] = await Promise.all([
        customersApi.getAll().catch(() => ({ success: false, customers: [] })),
        leadsApi.getAll().catch(() => ({ success: false, leads: [] })),
        interactionsApi.getAll().catch(() => ({ success: false, interactions: [] })),
        ticketsApi.getAll().catch(() => ({ success: false, tickets: [] })),
      ]);

      if (customersRes.success && customersRes.customers) {
        setCustomers(customersRes.customers.map(transformCustomer));
      }
      if (leadsRes.success && leadsRes.leads) {
        setLeads(leadsRes.leads.map(transformLead));
      }
      if (interactionsRes.success && interactionsRes.interactions) {
        setInteractions(interactionsRes.interactions.map(transformInteraction));
      }
      if (ticketsRes.success && ticketsRes.tickets) {
        setTickets(ticketsRes.tickets.map(transformTicket));
      }

      // Try to fetch users (may fail if not admin)
      try {
        const usersRes = await usersApi.getAll();
        if (usersRes.success && usersRes.users) {
          setUsers(usersRes.users.map(transformUser));
        }
      } catch {
        // Non-admin users can't fetch users list
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    if (token) {
      refreshData();
    } else {
      setIsLoading(false);
    }
  }, [refreshData]);

  // Customer operations
  const addCustomer = async (customer: Omit<FrontendCustomer, "id" | "createdAt">) => {
    try {
      const response = await customersApi.create({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
      });
      if (response.success && response.customer) {
        setCustomers(prev => [...prev, transformCustomer(response.customer)]);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<FrontendCustomer>) => {
    try {
      const response = await customersApi.update(id, updates);
      if (response.success && response.customer) {
        setCustomers(prev => 
          prev.map(c => c.id === id ? transformCustomer(response.customer) : c)
        );
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const response = await customersApi.delete(id);
      if (response.success) {
        setCustomers(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  };

  // Lead operations
  const addLead = async (lead: Omit<FrontendLead, "id" | "createdAt">) => {
    try {
      const response = await leadsApi.create({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: lead.status,
        assignedTo: lead.assignedTo,
      });
      if (response.success && response.lead) {
        setLeads(prev => [...prev, transformLead(response.lead)]);
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      throw error;
    }
  };

  const updateLead = async (id: string, updates: Partial<FrontendLead>) => {
    try {
      const response = await leadsApi.update(id, {
        ...updates,
        assignedTo: updates.assignedTo || null,
      });
      if (response.success && response.lead) {
        setLeads(prev => 
          prev.map(l => l.id === id ? transformLead(response.lead) : l)
        );
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const response = await leadsApi.delete(id);
      if (response.success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  };

  const convertLeadToCustomer = async (leadId: string, _createdBy: string) => {
    try {
      const response = await leadsApi.convertToCustomer(leadId);
      if (response.success) {
        if (response.customer) {
          setCustomers(prev => [...prev, transformCustomer(response.customer)]);
        }
        if (response.lead) {
          setLeads(prev => 
            prev.map(l => l.id === leadId ? transformLead(response.lead) : l)
          );
        }
      }
    } catch (error) {
      console.error("Error converting lead:", error);
      throw error;
    }
  };

  // Interaction operations
  const addInteraction = async (interaction: Omit<FrontendInteraction, "id" | "createdAt">) => {
    try {
      const response = await interactionsApi.create({
        type: interaction.type,
        notes: interaction.notes,
        linkedTo: interaction.linkedTo,
        linkedId: interaction.linkedId,
      });
      if (response.success && response.interaction) {
        setInteractions(prev => [...prev, transformInteraction(response.interaction)]);
      }
    } catch (error) {
      console.error("Error adding interaction:", error);
      throw error;
    }
  };

  // Ticket operations
  const addTicket = async (ticket: Omit<FrontendTicket, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await ticketsApi.create({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        customerId: ticket.customerId,
        assignedTo: ticket.assignedTo,
      });
      if (response.success && response.ticket) {
        setTickets(prev => [...prev, transformTicket(response.ticket)]);
      }
    } catch (error) {
      console.error("Error adding ticket:", error);
      throw error;
    }
  };

  const updateTicket = async (id: string, updates: Partial<FrontendTicket>) => {
    try {
      const response = await ticketsApi.update(id, {
        ...updates,
        assignedTo: updates.assignedTo || null,
      });
      if (response.success && response.ticket) {
        setTickets(prev => 
          prev.map(t => t.id === id ? transformTicket(response.ticket) : t)
        );
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }
  };

  // User operations
  const addUser = async (user: Omit<FrontendUser, "id" | "createdAt">) => {
    try {
      const response = await usersApi.create({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      });
      if (response.success && response.user) {
        setUsers(prev => [...prev, transformUser(response.user)]);
      }
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  };

  const updateUser = async (id: string, updates: Partial<FrontendUser>) => {
    try {
      const response = await usersApi.update(id, updates);
      if (response.success && response.user) {
        setUsers(prev => 
          prev.map(u => u.id === id ? transformUser(response.user) : u)
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await usersApi.delete(id);
      if (response.success) {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  return (
    <CRMStoreContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        leads,
        addLead,
        updateLead,
        deleteLead,
        convertLeadToCustomer,
        interactions,
        addInteraction,
        tickets,
        addTicket,
        updateTicket,
        users,
        addUser,
        updateUser,
        deleteUser,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </CRMStoreContext.Provider>
  );
}

export function useCRMStore() {
  const context = useContext(CRMStoreContext);
  if (context === undefined) {
    throw new Error("useCRMStore must be used within a CRMStoreProvider");
  }
  return context;
}
