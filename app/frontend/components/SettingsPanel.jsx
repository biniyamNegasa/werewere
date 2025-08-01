import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User, Trash2 } from "lucide-react";
import { edit_user_registration_path, user_registration_path } from "@/routes";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

export default function SettingsPanel() {
  const handleDeleteAccount = () => {
    router.delete(user_registration_path(), {
      onSuccess: () => {
        toast.success("Your account has been successfully deleted.");
      },
      onError: (errors) => {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(
          `Failed to delete account: ${errorMessages || "Please try again."}`,
        );
      },
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
      <Card className="border-orange-100 dark:border-orange-900/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-orange-500" />
            <CardTitle className="text-xl font-semibold">
              Account Settings
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground pt-1">
            Manage your profile information and account data.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Edit Profile Section */}
          <div>
            <h3 className="text-lg font-medium">Edit Profile</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Update your username, email, and other profile details.
            </p>
            <Link
              href={edit_user_registration_path()}
              className={buttonVariants({
                variant: "outline",
                className: "w-full sm:w-auto justify-start",
              })}
            >
              Edit Your Profile
            </Link>
          </div>

          <Separator />

          {/* Delete Account Section (Danger Zone) */}
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
            <h3 className="text-lg font-medium text-destructive flex items-center">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Account
            </h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Permanently delete your account and all associated data. Your name
              in past conversations will be changed to "deleted account". This
              action cannot be undone.
            </p>

            {/* AlertDialog provides a confirmation step for this destructive action. */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Request Account Deletion
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers. Your
                    name in existing chats will be anonymized to "deleted
                    account".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
