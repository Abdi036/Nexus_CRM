"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCRMStore } from "@/lib/crm-store";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, PhoneIcon, Mail, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InteractionType } from "@/lib/mock-data";

export default function InteractionsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { interactions, addInteraction, leads, customers } = useCRMStore();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "call" as InteractionType,
    notes: "",
    linkedTo: "lead" as "lead" | "customer",
    linkedId: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addInteraction({ ...formData, createdBy: user.id });
      toast({
        title: "Interaction Logged",
        description: "Interaction has been recorded successfully.",
      });
      setIsAddOpen(false);
      setFormData({ type: "call", notes: "", linkedTo: "lead", linkedId: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log interaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: InteractionType) => {
    switch (type) {
      case "call":
        return <PhoneIcon className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "meeting":
        return <Video className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: InteractionType) => {
    switch (type) {
      case "call":
        return "bg-blue-500/10 text-blue-500";
      case "email":
        return "bg-green-500/10 text-green-500";
      case "meeting":
        return "bg-purple-500/10 text-purple-500";
    }
  };

  const getLinkedName = (interaction: (typeof interactions)[0]) => {
    if (interaction.linkedName) return interaction.linkedName;

    if (interaction.linkedTo === "lead") {
      return (
        leads.find((l) => l.id === interaction.linkedId)?.name || "Unknown Lead"
      );
    }
    return (
      customers.find((c) => c.id === interaction.linkedId)?.name ||
      "Unknown Customer"
    );
  };

  const availableLeads =
    user.role === "sales_rep"
      ? leads.filter((l) => l.assignedTo === user.id)
      : leads;

  return (
    <div className="flex min-h-screen bg-transparent pl-64 backdrop-blur-[2px]">
      <AppSidebar />
      <main className="h-screen flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Interactions
              </h1>
              <p className="text-muted-foreground">
                Track all customer and lead communications
              </p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Interaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log New Interaction</DialogTitle>
                  <DialogDescription>
                    Record a call, email, or meeting with a lead or customer.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Interaction Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: InteractionType) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedTo">Linked To</Label>
                    <Select
                      value={formData.linkedTo}
                      onValueChange={(value: "lead" | "customer") =>
                        setFormData({
                          ...formData,
                          linkedTo: value,
                          linkedId: "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedId">
                      Select{" "}
                      {formData.linkedTo === "lead" ? "Lead" : "Customer"}
                    </Label>
                    <Select
                      value={formData.linkedId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, linkedId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select a ${formData.linkedTo}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.linkedTo === "lead"
                          ? availableLeads.map((lead) => (
                              <SelectItem key={lead.id} value={lead.id}>
                                {lead.name}
                              </SelectItem>
                            ))
                          : customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter details about this interaction..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      required
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Log Interaction
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
              <CardDescription>
                All recorded interactions with leads and customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Linked To</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interactions
                    .slice()
                    .reverse()
                    .map((interaction) => (
                      <TableRow key={interaction.id}>
                        <TableCell>
                          <Badge className={getTypeColor(interaction.type)}>
                            <span className="flex items-center gap-2">
                              {getTypeIcon(interaction.type)}
                              {interaction.type}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {getLinkedName(interaction)}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {interaction.linkedTo}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="line-clamp-2 text-sm">
                            {interaction.notes}
                          </p>
                        </TableCell>
                        <TableCell>
                          {interaction.createdAt.toLocaleDateString()}{" "}
                          {interaction.createdAt.toLocaleTimeString()}
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
  );
}
