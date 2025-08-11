import { useForm, Head, Link } from "@inertiajs/react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { user_registration_path, root_path } from "@/routes";

export default function EditProfile({ user, notice }) {
  const { data, setData, patch, processing, errors, recentlySuccessful } =
    useForm({
      user: {
        username: user.username || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
      },
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(user_registration_path(), {
      preserveScroll: true,
      onSuccess: () => {
        setData((prevData) => ({
          ...prevData,
          password: "",
          password_confirmation: "",
        }));
      },
    });
  };

  return (
    <>
      <Head title="Edit Profile" />
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-2xl">
        <div className="mb-6">
          <Link
            href={root_path()}
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Profile</CardTitle>
            <CardDescription>
              Update your account details. To change your password, fill out the
              password fields.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={data.user.username}
                  onChange={(e) => setData("user.username", e.target.value)}
                  className={
                    errors.username
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  required
                />
                {errors.username && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.user.email}
                  onChange={(e) => setData("user.email", e.target.value)}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <hr />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="password">New Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.user.password}
                  onChange={(e) => setData("user.password", e.target.value)}
                  className={
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors.password && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Password Confirmation */}
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  Confirm New Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.user.password_confirmation}
                  onChange={(e) =>
                    setData("user.password_confirmation", e.target.value)
                  }
                  className={
                    errors.password_confirmation
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {recentlySuccessful && notice && (
                <Alert className="my-2 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{notice}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

EditProfile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  notice: PropTypes.string,
};
