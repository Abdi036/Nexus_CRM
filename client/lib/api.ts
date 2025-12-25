// API Service Layer for CRM Application

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Type definitions
export type UserRole = 'admin' | 'sales_manager' | 'sales_rep' | 'support_agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdBy: { _id: string; name: string; email: string } | string;
  createdAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: LeadStatus;
  assignedTo?: { _id: string; name: string; email: string } | string | null;
  createdBy: { _id: string; name: string; email: string } | string;
  convertedToCustomerId?: string | null;
  createdAt: string;
}

export type InteractionType = 'call' | 'email' | 'meeting';

export interface Interaction {
  _id: string;
  type: InteractionType;
  notes: string;
  linkedTo: 'lead' | 'customer';
  linkedId: string;
  createdBy: { _id: string; name: string; email: string } | string;
  createdAt: string;
}

export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketStatus = 'open' | 'in_progress' | 'closed';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  customerId: { _id: string; name: string; email: string; company?: string } | string;
  assignedTo?: { _id: string; name: string; email: string } | string | null;
  createdBy: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

// Helper function to get auth token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('crm_token');
  }
  return null;
};

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const data = await apiCall<{ success: boolean; token: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    if (data.success && data.token) {
      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('crm_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (data: { name: string; email: string; password: string; role?: UserRole }) => {
    const response = await apiCall<{ success: boolean; token: string; user: User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    if (response.success && response.token) {
      localStorage.setItem('crm_token', response.token);
      localStorage.setItem('crm_user', JSON.stringify(response.user));
    }
    return response;
  },

  getMe: async () => {
    return apiCall<{ success: boolean; user: User }>('/auth/me');
  },

  updateProfile: async (data: { name?: string; password?: string; avatarUrl?: string }) => {
    const response = await apiCall<{ success: boolean; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (response.success) {
      localStorage.setItem('crm_user', JSON.stringify(response.user));
    }
    return response;
  },

  forgotPassword: async (email: string) => {
    return apiCall<{ success: boolean; message: string; resetUrl?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiCall<{ success: boolean; message: string; token?: string; user?: User }>(
      '/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      }
    );
    if (response.success && response.token && response.user) {
      localStorage.setItem('crm_token', response.token);
      localStorage.setItem('crm_user', JSON.stringify(response.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
  },
};

// Users API (Admin only)
export const usersApi = {
  getAll: async () => {
    return apiCall<{ success: boolean; users: User[] }>('/users');
  },

  create: async (data: { name: string; email: string; password: string; role: UserRole }) => {
    return apiCall<{ success: boolean; user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ name: string; email: string; password: string; role: UserRole }>) => {
    return apiCall<{ success: boolean; user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Customers API
export const customersApi = {
  getAll: async () => {
    return apiCall<{ success: boolean; customers: Customer[] }>('/customers');
  },

  getOne: async (id: string) => {
    return apiCall<{ success: boolean; customer: Customer }>(`/customers/${id}`);
  },

  create: async (data: { name: string; email: string; phone: string; company: string }) => {
    return apiCall<{ success: boolean; customer: Customer }>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ name: string; email: string; phone: string; company: string }>) => {
    return apiCall<{ success: boolean; customer: Customer }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Leads API
export const leadsApi = {
  getAll: async () => {
    return apiCall<{ success: boolean; leads: Lead[] }>('/leads');
  },

  getOne: async (id: string) => {
    return apiCall<{ success: boolean; lead: Lead }>(`/leads/${id}`);
  },

  create: async (data: { 
    name: string; 
    email: string; 
    phone: string; 
    company: string; 
    status?: LeadStatus;
    assignedTo?: string;
  }) => {
    return apiCall<{ success: boolean; lead: Lead }>('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ 
    name: string; 
    email: string; 
    phone: string; 
    company: string;
    status: LeadStatus;
    assignedTo: string | null;
  }>) => {
    return apiCall<{ success: boolean; lead: Lead }>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/leads/${id}`, {
      method: 'DELETE',
    });
  },

  convertToCustomer: async (id: string) => {
    return apiCall<{ success: boolean; lead: Lead; customer: Customer }>(`/leads/${id}/convert`, {
      method: 'POST',
    });
  },
};

// Interactions API
export const interactionsApi = {
  getAll: async () => {
    return apiCall<{ success: boolean; interactions: Interaction[] }>('/interactions');
  },

  create: async (data: { 
    type: InteractionType; 
    notes: string; 
    linkedTo: 'lead' | 'customer';
    linkedId: string;
  }) => {
    return apiCall<{ success: boolean; interaction: Interaction }>('/interactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Tickets API
export const ticketsApi = {
  getAll: async () => {
    return apiCall<{ success: boolean; tickets: Ticket[] }>('/tickets');
  },

  getOne: async (id: string) => {
    return apiCall<{ success: boolean; ticket: Ticket }>(`/tickets/${id}`);
  },

  create: async (data: { 
    title: string; 
    description: string; 
    priority?: TicketPriority;
    status?: TicketStatus;
    customerId: string;
    assignedTo?: string;
  }) => {
    return apiCall<{ success: boolean; ticket: Ticket }>('/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<{ 
    title: string; 
    description: string; 
    priority: TicketPriority;
    status: TicketStatus;
    customerId: string;
    assignedTo: string | null;
  }>) => {
    return apiCall<{ success: boolean; ticket: Ticket }>(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall<{ success: boolean; message: string }>(`/tickets/${id}`, {
      method: 'DELETE',
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    return apiCall<{ 
      success: boolean; 
      stats: {
        customers: { total: number };
        leads: { 
          total: number;
          byStatus: { new: number; contacted: number; qualified: number; converted: number };
        };
        tickets: {
          total: number;
          byStatus: { open: number; in_progress: number; closed: number };
          byPriority: { high: number; medium: number; low: number };
          highPriorityOpen: number;
        };
        interactions: {
          total: number;
          recent: number;
          byType: { call: number; email: number; meeting: number };
        };
        users?: {
          total: number;
          byRole: { admin: number; sales_manager: number; sales_rep: number; support_agent: number };
        };
      };
    }>('/dashboard/stats');
  },
};
