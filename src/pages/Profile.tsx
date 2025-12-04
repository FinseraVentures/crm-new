import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/Breadcrumbs";

// Mock user data - replace with your backend API call
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Admin",
  phone: "+1 (555) 123-4567",
  profilePicture: "",
  notifications: {
    email: true,
    push: false,
    sms: true,
  },
};

const Profile = () => {
  return (
    <DashboardLayout>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
      />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userData.profilePicture}
                  alt={userData.name}
                />
                <AvatarFallback className="text-2xl">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant="secondary">{userData.role}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="email-notifications"
                className="flex flex-col gap-1 cursor-pointer"
              >
                <span className="font-medium">Email Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Receive notifications via email
                </span>
              </Label>
              <Switch
                id="email-notifications"
                checked={userData.notifications.email}
                onCheckedChange={(checked) => {
                  // Call your backend API to update notification settings
                  console.log("Update email notifications:", checked);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="push-notifications"
                className="flex flex-col gap-1 cursor-pointer"
              >
                <span className="font-medium">Push Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Receive push notifications in browser
                </span>
              </Label>
              <Switch
                id="push-notifications"
                checked={userData.notifications.push}
                onCheckedChange={(checked) => {
                  // Call your backend API to update notification settings
                  console.log("Update push notifications:", checked);
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label
                htmlFor="sms-notifications"
                className="flex flex-col gap-1 cursor-pointer"
              >
                <span className="font-medium">SMS Notifications</span>
                <span className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </span>
              </Label>
              <Switch
                id="sms-notifications"
                checked={userData.notifications.sms}
                onCheckedChange={(checked) => {
                  // Call your backend API to update notification settings
                  console.log("Update SMS notifications:", checked);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
