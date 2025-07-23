import { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { new_user_registration_path, user_session_path } from "@/routes"; // Route helpers

export default function Login({ alert, notice }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    user: {
      email: "",
      password: "",
      remember_me: false, // For Devise's "remember me" functionality
    },
  });

  // Display flash messages (alert/notice) from Devise
  useEffect(() => {
    if (alert) {
      console.warn("Login Alert:", alert); // Replace with shadcn Toast later
    }
    if (notice) {
      console.log("Login Notice:", notice); // Replace with shadcn Toast later
    }
  }, [alert, notice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(user_session_path(), {
      onSuccess: () => {
        reset(); // Clear form on successful login
      },
      onError: (backendErrors) => {
        // Devise often sends a single 'error' or 'alert' message,
        // not per-field errors for login failures.
        // useForm will automatically populate its 'errors' state if it receives a hash.
        console.error("Login errors:", backendErrors);
      },
    });
  };

  return (
    <>
      <Head title="Log In" />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Log In</CardTitle>
            <CardDescription>
              Enter your email and password to log in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={data.user.email}
                  onChange={(e) => setData("user.email", e.target.value)}
                  required
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.user.password}
                  onChange={(e) => setData("user.password", e.target.value)}
                  required
                />
                {errors.password && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="remember_me"
                  type="checkbox"
                  checked={data.user.remember_me}
                  onChange={(e) =>
                    setData("user.remember_me", e.target.checked)
                  }
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <Label htmlFor="remember_me">Remember me</Label>
              </div>
              {/* General authentication errors (e.g., "Invalid Email or password.") */}
              {errors.error && (
                <p className="text-destructive text-sm mt-1">{errors.error}</p>
              )}
              {/* Devise often puts a generic error in a top-level `alert` flash message */}
              {alert && (
                <p className="text-destructive text-sm mt-1">{alert}</p>
              )}

              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? "Logging In..." : "Log In"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href={new_user_registration_path()} className="underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

Login.propTypes = {
  alert: PropTypes.string, // Devise alert message
  notice: PropTypes.string, // Devise notice message
};
