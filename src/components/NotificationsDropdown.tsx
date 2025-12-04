import { Bell, Check, Clock, CreditCard, FileText, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "booking" | "payment" | "invoice" | "user" | "trash";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Booking Created",
    description: "Booking #BK-2024-001 has been successfully created for Acme Corp.",
    time: "2 minutes ago",
    read: false,
    type: "booking",
  },
  {
    id: "2",
    title: "Payment Received",
    description: "₹25,000 received from TechStart Solutions via UPI.",
    time: "15 minutes ago",
    read: false,
    type: "payment",
  },
  {
    id: "3",
    title: "Invoice Generated",
    description: "Proforma Invoice #INV-2024-045 has been generated.",
    time: "1 hour ago",
    read: false,
    type: "invoice",
  },
  {
    id: "4",
    title: "New User Registered",
    description: "Rahul Sharma has joined the platform.",
    time: "3 hours ago",
    read: true,
    type: "user",
  },
  {
    id: "5",
    title: "Booking Moved to Trash",
    description: "Booking #BK-2024-089 has been moved to trash.",
    time: "5 hours ago",
    read: true,
    type: "trash",
  },
  {
    id: "6",
    title: "Payment Link Created",
    description: "New payment link created for Global Industries.",
    time: "Yesterday",
    read: true,
    type: "payment",
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "booking":
      return <Clock className={iconClass} />;
    case "payment":
      return <CreditCard className={iconClass} />;
    case "invoice":
      return <FileText className={iconClass} />;
    case "user":
      return <User className={iconClass} />;
    case "trash":
      return <Trash2 className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getNotificationIconBg = (type: Notification["type"]) => {
  switch (type) {
    case "booking":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    case "payment":
      return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    case "invoice":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
    case "user":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    case "trash":
      return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center animate-pulse"
              aria-hidden="true"
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="end"
        sideOffset={8}
        role="dialog"
        aria-label="Notifications"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
              aria-label="Mark all notifications as read"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[340px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-border" role="list" aria-label="Notification list">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex gap-3 ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    aria-label={`${notification.title}. ${notification.description}. ${notification.time}${
                      !notification.read ? ". Unread" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getNotificationIconBg(
                        notification.type
                      )}`}
                      aria-hidden="true"
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm truncate ${
                            !notification.read
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span
                            className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <div className="border-t border-border px-4 py-2">
          <Button
            variant="ghost"
            className="w-full text-sm text-muted-foreground hover:text-foreground"
            size="sm"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
