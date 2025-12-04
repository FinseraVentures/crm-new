import { NavLink } from "@/components/NavLink";
import { hasRouteAccess, getUserRole } from "@/lib/rbac";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Link2,
  QrCode,
  FileText,
  Users,
  Settings,
  Trash2,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const allMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "New Booking", url: "/dashboard/new-booking", icon: PlusCircle },
  { title: "All Bookings", url: "/dashboard/all-bookings", icon: BookOpen },
  { title: "Payment Links", url: "/dashboard/payment-link", icon: Link2 },
  { title: "Payment QR", url: "/dashboard/payment-qr", icon: QrCode },
  { title: "Proforma Invoices", url: "/dashboard/proforma-invoice", icon: FileText },
  { title: "Manage Users", url: "/dashboard/manage-users", icon: Users },
  {
    title: "Manage Services",
    url: "/dashboard/manage-services",
    icon: Settings,
  },
  { title: "Trash", url: "/dashboard/trash", icon: Trash2 },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  isMobile?: boolean;
  onMobileNavClick?: () => void;
}

export function DashboardSidebar({ collapsed, onCollapsedChange, isMobile = false, onMobileNavClick }: DashboardSidebarProps) {
  // Filter menu items based on user role
  const userRole = getUserRole();
  const menuItems = allMenuItems.filter((item) => hasRouteAccess(item.url, userRole));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isMobile ? "z-40 w-64" : "z-30",
        !isMobile && (collapsed ? "w-20" : "w-64")
      )}
    >
      {/* Logo & Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Finsera <span className="text-sidebar-primary">CRM</span>
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                end={item.url === "/"}
                onClick={() => isMobile && onMobileNavClick?.()}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200",
                  collapsed && "justify-center px-2"
                )}
                activeClassName="bg-sidebar-accent/80 text-sidebar-foreground before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-sidebar-primary before:rounded-r-full"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
