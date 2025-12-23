"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import {
  type Customer,
  type Lead,
  type Interaction,
  type SupportTicket,
  type User,
  mockCustomers,
  mockLeads,
  mockInteractions,
  mockTickets,
  mockUsers,
} from "./mock-data"

interface CRMStoreContextType {
  // Customers
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Leads
  leads: Lead[]
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
  convertLeadToCustomer: (leadId: string, createdBy: string) => void

  // Interactions
  interactions: Interaction[]
  addInteraction: (interaction: Omit<Interaction, "id" | "createdAt">) => void

  // Support Tickets
  tickets: SupportTicket[]
  addTicket: (ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">) => void
  updateTicket: (id: string, ticket: Partial<SupportTicket>) => void

  // Users
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
}

const CRMStoreContext = createContext<CRMStoreContextType | undefined>(undefined)

export function CRMStoreProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions)
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [users, setUsers] = useState<User[]>(mockUsers)

  // Customer operations
  const addCustomer = (customer: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customer,
      id: `c${Date.now()}`,
      createdAt: new Date(),
    }
    setCustomers([...customers, newCustomer])
  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  // Lead operations
  const addLead = (lead: Omit<Lead, "id" | "createdAt">) => {
    const newLead: Lead = {
      ...lead,
      id: `l${Date.now()}`,
      createdAt: new Date(),
    }
    setLeads([...leads, newLead])
  }

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const deleteLead = (id: string) => {
    setLeads(leads.filter((l) => l.id !== id))
  }

  const convertLeadToCustomer = (leadId: string, createdBy: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (lead) {
      const newCustomer: Customer = {
        id: `c${Date.now()}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        createdAt: new Date(),
        createdBy,
      }
      setCustomers([...customers, newCustomer])
      updateLead(leadId, { status: "converted", convertedToCustomerId: newCustomer.id })
    }
  }

  // Interaction operations
  const addInteraction = (interaction: Omit<Interaction, "id" | "createdAt">) => {
    const newInteraction: Interaction = {
      ...interaction,
      id: `i${Date.now()}`,
      createdAt: new Date(),
    }
    setInteractions([...interactions, newInteraction])
  }

  // Ticket operations
  const addTicket = (ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `t${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTickets([...tickets, newTicket])
  }

  const updateTicket = (id: string, updates: Partial<SupportTicket>) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)))
  }

  // User operations
  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: `u${Date.now()}`,
      createdAt: new Date(),
    }
    setUsers([...users, newUser])
  }

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

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
      }}
    >
      {children}
    </CRMStoreContext.Provider>
  )
}

export function useCRMStore() {
  const context = useContext(CRMStoreContext)
  if (context === undefined) {
    throw new Error("useCRMStore must be used within a CRMStoreProvider")
  }
  return context
}
