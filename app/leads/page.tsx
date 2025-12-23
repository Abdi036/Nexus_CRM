"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCRMStore } from "@/lib/crm-store"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, PhoneIcon, Building, Trash2, Edit, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { LeadStatus } from "@/lib/mock-data"

export default function LeadsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { leads, addLead, updateLead, deleteLead, convertLeadToCustomer, users } = useCRMStore()
  const { toast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new" as LeadStatus,
    assignedTo: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!user) return null

  const filteredLeads = user.role === "sales_rep" ? leads.filter((l) => l.assignedTo === user.id) : leads

  const salesReps = users.filter((u) => u.role === "sales_rep")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateLead(editingId, formData)
      toast({ title: "Lead Updated", description: "Lead information has been updated." })
      setEditingId(null)
    } else {
      addLead({ ...formData, createdBy: user.id })
      toast({ title: "Lead Added", description: "New lead has been added to the pipeline." })
      setIsAddOpen(false)
    }
    setFormData({ name: "", email: "", phone: "", company: "", status: "new", assignedTo: "" })
  }

  const handleEdit = (lead: (typeof leads)[0]) => {
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      assignedTo: lead.assignedTo || "",
    })
    setEditingId(lead.id)
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id)
      toast({ title: "Lead Deleted", description: "Lead has been removed from the system." })
    }
  }

  const handleConvert = (leadId: string, leadName: string) => {
    if (confirm(`Convert "${leadName}" to a customer?`)) {
      convertLeadToCustomer(leadId, user.id)
      toast({ title: "Lead Converted", description: "Lead has been successfully converted to a customer." })
    }
  }

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-500"
      case "contacted":
        return "bg-yellow-500/10 text-yellow-500"
      case "qualified":
        return "bg-green-500/10 text-green-500"
      case "converted":
        return "bg-purple-500/10 text-purple-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Leads</h1>
              <p className="text-muted-foreground">
                {user.role === "sales_rep" ? "Manage your assigned leads" : "Manage your lead pipeline"}
              </p>
            </div>
            {(user.role === "admin" || user.role === "sales_manager") && (
              <Dialog
                open={isAddOpen}
                onOpenChange={(open) => {
                  setIsAddOpen(open)
                  if (!open) {
                    setEditingId(null)
                    setFormData({ name: "", email: "", phone: "", company: "", status: "new", assignedTo: "" })
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Lead" : "Add New Lead"}</DialogTitle>
                    <DialogDescription>
                      {editingId ? "Update lead information below." : "Enter lead details below."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: LeadStatus) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assign To</Label>
                      <Select
                        value={formData.assignedTo}
                        onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sales rep" />
                        </SelectTrigger>
                        <SelectContent>
                          {salesReps.map((rep) => (
                            <SelectItem key={rep.id} value={rep.id}>
                              {rep.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingId ? "Update Lead" : "Add Lead"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{user.role === "sales_rep" ? "My Leads" : "All Leads"}</CardTitle>
              <CardDescription>Track and manage your sales pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => {
                    const assignedUser = users.find((u) => u.id === lead.assignedTo)
                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {lead.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <PhoneIcon className="h-3 w-3 text-muted-foreground" />
                              {lead.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {lead.company}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        </TableCell>
                        <TableCell>{assignedUser?.name || "Unassigned"}</TableCell>
                        <TableCell>{lead.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {lead.status !== "converted" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConvert(lead.id, lead.name)}
                                title="Convert to Customer"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            {(user.role === "admin" ||
                              user.role === "sales_manager" ||
                              (user.role === "sales_rep" && lead.assignedTo === user.id)) && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(lead)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {(user.role === "admin" || user.role === "sales_manager") && (
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(lead.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
