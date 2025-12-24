"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCRMStore } from "@/lib/crm-store";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Users,
  UserPlus,
  Phone,
  Ticket,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { customers, leads, interactions, tickets, users } = useCRMStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const filteredLeads = useMemo(() => {
    if (!user) return [];
    if (user.role === "sales_rep") {
      return leads.filter((l) => l.assignedTo === user.id);
    }
    return leads;
  }, [leads, user]);

  const filteredTickets = useMemo(() => {
    if (!user) return [];
    if (user.role === "support_agent") {
      return tickets.filter((t) => t.assignedTo === user.id);
    }
    return tickets;
  }, [tickets, user]);

  const chartData = useMemo(() => {
    // Lead status distribution
    const leadsByStatus = [
      {
        status: "New",
        count: filteredLeads.filter((l) => l.status === "new").length,
        fill: "hsl(var(--chart-1))",
      },
      {
        status: "Contacted",
        count: filteredLeads.filter((l) => l.status === "contacted").length,
        fill: "hsl(var(--chart-2))",
      },
      {
        status: "Qualified",
        count: filteredLeads.filter((l) => l.status === "qualified").length,
        fill: "hsl(var(--chart-3))",
      },
      {
        status: "Converted",
        count: filteredLeads.filter((l) => l.status === "converted").length,
        fill: "hsl(var(--chart-4))",
      },
    ];

    // Ticket priority distribution
    const ticketsByPriority = [
      {
        priority: "Low",
        count: filteredTickets.filter((t) => t.priority === "low").length,
        fill: "hsl(var(--chart-2))",
      },
      {
        priority: "Medium",
        count: filteredTickets.filter((t) => t.priority === "medium").length,
        fill: "hsl(var(--chart-3))",
      },
      {
        priority: "High",
        count: filteredTickets.filter((t) => t.priority === "high").length,
        fill: "hsl(var(--chart-1))",
      },
    ];

    // Ticket status distribution
    const ticketsByStatus = [
      {
        status: "Open",
        count: filteredTickets.filter((t) => t.status === "open").length,
        fill: "hsl(var(--chart-1))",
      },
      {
        status: "In Progress",
        count: filteredTickets.filter((t) => t.status === "in_progress").length,
        fill: "hsl(var(--chart-3))",
      },
      {
        status: "Closed",
        count: filteredTickets.filter((t) => t.status === "closed").length,
        fill: "hsl(var(--chart-4))",
      },
    ];

    // Interactions by type
    const interactionsByType = [
      {
        type: "Call",
        count: interactions.filter((i) => i.type === "call").length,
        fill: "hsl(var(--chart-1))",
      },
      {
        type: "Email",
        count: interactions.filter((i) => i.type === "email").length,
        fill: "hsl(var(--chart-2))",
      },
      {
        type: "Meeting",
        count: interactions.filter((i) => i.type === "meeting").length,
        fill: "hsl(var(--chart-3))",
      },
    ];

    // Users by role (admin only)
    const usersByRole = [
      {
        role: "Admin",
        count: users.filter((u) => u.role === "admin").length,
        fill: "hsl(var(--chart-1))",
      },
      {
        role: "Manager",
        count: users.filter((u) => u.role === "sales_manager").length,
        fill: "hsl(var(--chart-2))",
      },
      {
        role: "Sales Rep",
        count: users.filter((u) => u.role === "sales_rep").length,
        fill: "hsl(var(--chart-3))",
      },
      {
        role: "Support",
        count: users.filter((u) => u.role === "support_agent").length,
        fill: "hsl(var(--chart-4))",
      },
    ];

    // Monthly activity trend (last 6 months mock)
    const monthlyActivity = [
      { month: "Jul", leads: 8, customers: 5, interactions: 12 },
      { month: "Aug", leads: 12, customers: 7, interactions: 18 },
      { month: "Sep", leads: 10, customers: 6, interactions: 15 },
      { month: "Oct", leads: 15, customers: 9, interactions: 22 },
      { month: "Nov", leads: 18, customers: 11, interactions: 28 },
      {
        month: "Dec",
        leads: filteredLeads.length,
        customers: customers.length,
        interactions: interactions.length,
      },
    ];

    return {
      leadsByStatus,
      ticketsByPriority,
      ticketsByStatus,
      interactionsByType,
      usersByRole,
      monthlyActivity,
    };
  }, [filteredLeads, filteredTickets, interactions, customers, users]);

  if (!user) return null;

  const stats = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: Users,
      description: "Active customers in system",
      show: ["admin", "sales_manager", "sales_rep", "support_agent"],
    },
    {
      title: user.role === "sales_rep" ? "My Leads" : "Total Leads",
      value: filteredLeads.length,
      icon: UserPlus,
      description:
        user.role === "sales_rep" ? "Assigned to you" : "All leads in pipeline",
      show: ["admin", "sales_manager", "sales_rep"],
    },
    {
      title: "New Leads",
      value: filteredLeads.filter((l) => l.status === "new").length,
      icon: TrendingUp,
      description: "Awaiting contact",
      show: ["admin", "sales_manager", "sales_rep"],
    },
    {
      title: user.role === "support_agent" ? "My Tickets" : "Open Tickets",
      value: filteredTickets.filter((t) => t.status === "open").length,
      icon: Ticket,
      description:
        user.role === "support_agent"
          ? "Assigned to you"
          : "Requiring attention",
      show: ["admin", "sales_manager", "support_agent"],
    },
    {
      title: "High Priority",
      value: filteredTickets.filter(
        (t) => t.priority === "high" && t.status !== "closed"
      ).length,
      icon: AlertCircle,
      description: "Urgent tickets",
      show: ["admin", "sales_manager", "support_agent"],
    },
    {
      title: "Recent Interactions",
      value: interactions.slice(-7).length,
      icon: Phone,
      description: "Last 7 days",
      show: ["admin", "sales_manager", "sales_rep"],
    },
  ];

  const filteredStats = stats.filter((stat) => stat.show.includes(user.role));

  const adminCharts = (
    <>
      <Card className="border-2 border-red-500">
        <CardHeader>
          <CardTitle>User Distribution</CardTitle>
          <CardDescription>Users by role in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              role: {
                label: "Role",
              },
              count: {
                label: "Users",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <BarChart data={chartData.usersByRole}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-1))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity Trend</CardTitle>
          <CardDescription>
            Leads, customers, and interactions over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              month: {
                label: "Month",
              },
              leads: {
                label: "Leads",
                color: "hsl(var(--chart-1))",
              },
              customers: {
                label: "Customers",
                color: "hsl(var(--chart-2))",
              },
              interactions: {
                label: "Interactions",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-75"
          >
            <LineChart data={chartData.monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="interactions"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Priority Distribution</CardTitle>
          <CardDescription>Support tickets by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              priority: {
                label: "Priority",
              },
              count: {
                label: "Tickets",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <PieChart>
              <Pie
                data={chartData.ticketsByPriority}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.priority}: ${entry.count}`}
                outerRadius={80}
                fill="hsl(var(--chart-1))"
                dataKey="count"
              >
                {chartData.ticketsByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Status Overview</CardTitle>
          <CardDescription>Current status of all leads</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              status: {
                label: "Status",
              },
              count: {
                label: "Leads",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <BarChart data={chartData.leadsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-1))"
                radius={[8, 8, 0, 0]}
              >
                {chartData.leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );

  const salesManagerCharts = (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lead Status Distribution</CardTitle>
          <CardDescription>Overview of lead pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              status: {
                label: "Status",
              },
              count: {
                label: "Leads",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <PieChart>
              <Pie
                data={chartData.leadsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.status}: ${entry.count}`}
                outerRadius={80}
                fill="hsl(var(--chart-1))"
                dataKey="count"
              >
                {chartData.leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interaction Types</CardTitle>
          <CardDescription>Breakdown of team interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              type: {
                label: "Type",
              },
              count: {
                label: "Interactions",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <BarChart data={chartData.interactionsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-1))"
                radius={[8, 8, 0, 0]}
              >
                {chartData.interactionsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Performance over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              month: {
                label: "Month",
              },
              leads: {
                label: "Leads",
                color: "hsl(var(--chart-1))",
              },
              customers: {
                label: "Customers",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-75"
          >
            <LineChart data={chartData.monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Ticket Status</CardTitle>
          <CardDescription>Current ticket workload</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              status: {
                label: "Status",
              },
              count: {
                label: "Tickets",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <PieChart>
              <Pie
                data={chartData.ticketsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.status}: ${entry.count}`}
                outerRadius={80}
                fill="hsl(var(--chart-1))"
                dataKey="count"
              >
                {chartData.ticketsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );

  const salesRepCharts = (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Lead Pipeline</CardTitle>
          <CardDescription>Status of your assigned leads</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              status: {
                label: "Status",
              },
              count: {
                label: "Leads",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <BarChart data={chartData.leadsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-1))"
                radius={[8, 8, 0, 0]}
              >
                {chartData.leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Interactions</CardTitle>
          <CardDescription>Types of customer interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              type: {
                label: "Type",
              },
              count: {
                label: "Interactions",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <PieChart>
              <Pie
                data={chartData.interactionsByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.type}: ${entry.count}`}
                outerRadius={80}
                fill="hsl(var(--chart-1))"
                dataKey="count"
              >
                {chartData.interactionsByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
          <CardDescription>
            Your activity over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              month: {
                label: "Month",
              },
              leads: {
                label: "Leads",
                color: "hsl(var(--chart-1))",
              },
              interactions: {
                label: "Interactions",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-75"
          >
            <LineChart data={chartData.monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="interactions"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );

  const supportAgentCharts = (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Ticket Status</CardTitle>
          <CardDescription>Overview of your assigned tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              status: {
                label: "Status",
              },
              count: {
                label: "Tickets",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <PieChart>
              <Pie
                data={chartData.ticketsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.status}: ${entry.count}`}
                outerRadius={80}
                fill="hsl(var(--chart-1))"
                dataKey="count"
              >
                {chartData.ticketsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ticket Priority Breakdown</CardTitle>
          <CardDescription>Your tickets by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              priority: {
                label: "Priority",
              },
              count: {
                label: "Tickets",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-75"
          >
            <BarChart data={chartData.ticketsByPriority}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-1))"
                radius={[8, 8, 0, 0]}
              >
                {chartData.ticketsByPriority.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="flex min-h-screen bg-transparent pl-64 backdrop-blur-[2px]">
      <AppSidebar />
      <main className="h-screen flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {filteredStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {user.role === "admin" && adminCharts}
            {user.role === "sales_manager" && salesManagerCharts}
            {user.role === "sales_rep" && salesRepCharts}
            {user.role === "support_agent" && supportAgentCharts}
          </div>
        </div>
      </main>
    </div>
  );
}
