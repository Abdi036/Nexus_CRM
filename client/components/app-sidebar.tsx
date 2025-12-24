"use client";

import {
  LayoutDashboard,
  Users,
  UserPlus,
  Phone,
  Ticket,
  Settings,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "sales_manager", "sales_rep", "support_agent"],
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
      roles: ["admin", "sales_manager", "sales_rep", "support_agent"],
    },
    {
      name: "Leads",
      href: "/leads",
      icon: UserPlus,
      roles: ["admin", "sales_manager", "sales_rep"],
    },
    {
      name: "Interactions",
      href: "/interactions",
      icon: Phone,
      roles: ["admin", "sales_manager", "sales_rep"],
    },
    {
      name: "Support Tickets",
      href: "/tickets",
      icon: Ticket,
      roles: ["admin", "sales_manager", "support_agent"],
    },
    { name: "Users", href: "/users", icon: Settings, roles: ["admin"] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar/90 backdrop-blur shadow-xl shadow-emerald-500/10">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">Nexus CRM</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/profile"
          className="mb-3 block rounded-lg px-2 py-2 transition hover:bg-sidebar-accent/60"
        >
          <p className="text-sm font-medium text-sidebar-foreground">
            {user.name}
          </p>
          <p className="text-xs text-sidebar-foreground/60">
            {user.role.replace("_", " ")}
          </p>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
