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
import { new_user_session_path, user_registration_path } from "@/routes";

export default function Register({ errors: initialErrors }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    user: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(user_registration_path(), {
      onSuccess: () => {
        reset();
      },
      onError: (backendErrors) => {
        // useForm's 'errors' state is automatically populated here.
        // backendErrors will now be in the correct { field: "message" } format.
        console.error("Registration errors:", backendErrors);
      },
    });
  };

  return (
    <>
      <Head title="Sign Up" />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your email below to create your account.
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
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.user.password_confirmation}
                  onChange={(e) =>
                    setData("user.password_confirmation", e.target.value)
                  }
                  required
                />
                {errors.password_confirmation && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? "Signing Up..." : "Sign Up"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href={new_user_session_path()} className="underline">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

Register.propTypes = {
  errors: PropTypes.object, // This prop is now the formatted errors from flash
};
