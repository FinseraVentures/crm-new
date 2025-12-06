import { Search, Bell, User, Menu, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  onMobileMenuToggle?: () => void;
}

export function DashboardHeader({
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Search company…",
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.toLowerCase();

  const showSearch =
    pathname.startsWith("/dashboard/all-bookings") ||
    pathname.startsWith("/dashboard/payment-links") ||
    pathname.startsWith("/dashboard/payment-qrs") ||
    pathname.startsWith("/dashboard/trash");

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userSession");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");

    navigate("/login", { replace: true });
  };

  // Mock user data - replace with your backend API call
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    phone: "+1 (555) 123-4567", // Optional
    profilePicture: "",
  };

  const initials =
    userData.name
      .split(" ")
      .map((n) => n[0])
      .join("") || "U";

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-card px-3 md:px-6 flex items-center justify-between">
      {/* Mobile Menu Button */}
      {onMobileMenuToggle && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Search container - keeps actions aligned to the right */}
      <div className="flex-1 max-w-md relative z-40 hidden sm:block">
        {showSearch ? (
          <div className="relative z-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-10 bg-muted border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        {/* <Button variant="ghost" size="icon" className="relative"> */}
          <NotificationsDropdown />
          {/* <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" /> */}
        {/* </Button> */}

        {/* User Menu + HoverCard */}
        <HoverCard openDelay={200}>
          <DropdownMenu>
            <HoverCardTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData.profilePicture} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </HoverCardTrigger>

            {/* Hover user details card */}
            <HoverCardContent
              side="bottom"
              align="end"
              className="w-72 bg-popover z-50"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userData.profilePicture} />
                    <AvatarFallback className="text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {userData.name}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {userData.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground truncate">
                      {userData.email}
                    </span>
                  </div>
                  {userData.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {userData.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </HoverCardContent>

            {/* Dropdown actions */}
            <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </HoverCard>
      </div>
    </header>
  );
}
