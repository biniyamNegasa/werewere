import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Info } from "lucide-react";

export default function SettingsPanel() {
  return (
    <div className="p-4 space-y-4">
      <Card className="border-orange-100 dark:border-orange-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card className="border-orange-100 dark:border-orange-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch id="push-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="message-sounds">Message Sounds</Label>
            <Switch id="message-sounds" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-100 dark:border-orange-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">Privacy & Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Blocked Users
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Two-Factor Authentication
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Active Sessions
          </Button>
        </CardContent>
      </Card>

      <Card className="border-orange-100 dark:border-orange-900/20">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-lg">About</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            <p>WereWere v1.0.0</p>
            <p className="mt-2">Fast, secure messaging for everyone.</p>
          </div>
          <Separator />
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Terms of Service
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            Privacy Policy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
