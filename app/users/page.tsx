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
import { Plus, Trash2, Edit, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { UserRole } from "@/lib/mock-data"

export default function UsersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { users, addUser, updateUser, deleteUser } = useCRMStore()
  const { toast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "sales_rep" as UserRole,
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router])

  if (!user || user.role !== "admin") return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateUser(editingId, formData)
      toast({ title: "User Updated", description: "User information has been updated." })
      setEditingId(null)
    } else {
      addUser(formData)
      toast({ title: "User Created", description: "New user has been added to the system." })
      setIsAddOpen(false)
    }
    setFormData({ name: "", email: "", password: "", role: "sales_rep" })
  }

  const handleEdit = (editUser: (typeof users)[0]) => {
    setFormData({
      name: editUser.name,
      email: editUser.email,
      password: editUser.password,
      role: editUser.role,
    })
    setEditingId(editUser.id)
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    if (id === user.id) {
      toast({ title: "Cannot Delete", description: "You cannot delete your own account.", variant: "destructive" })
      return
    }
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(id)
      toast({ title: "User Deleted", description: "User has been removed from the system." })
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-500"
      case "sales_manager":
        return "bg-purple-500/10 text-purple-500"
      case "sales_rep":
        return "bg-blue-500/10 text-blue-500"
      case "support_agent":
        return "bg-green-500/10 text-green-500"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage system users and roles</p>
            </div>
            <Dialog
              open={isAddOpen}
              onOpenChange={(open) => {
                setIsAddOpen(open)
                if (!open) {
                  setEditingId(null)
                  setFormData({ name: "", email: "", password: "", role: "sales_rep" })
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit User" : "Add New User"}</DialogTitle>
                  <DialogDescription>
                    {editingId ? "Update user information below." : "Create a new user account."}
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
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sales_manager">Sales Manager</SelectItem>
                        <SelectItem value="sales_rep">Sales Representative</SelectItem>
                        <SelectItem value="support_agent">Support Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingId ? "Update User" : "Create User"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>All users with access to the CRM system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((tableUser) => (
                    <TableRow key={tableUser.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tableUser.role === "admin" && <Shield className="h-4 w-4 text-red-500" />}
                          <span className="font-medium">{tableUser.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tableUser.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(tableUser.role)}>{tableUser.role.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>{tableUser.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(tableUser)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tableUser.id)}
                            disabled={tableUser.id === user.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
