import { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import axios from "axios";
import { z } from "zod";
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
import {
  MessageCircle,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import {
  users_validate_username_path as validate_username_users_path,
  user_registration_path,
  root_path,
  new_user_session_path,
  user_github_omniauth_authorize_path,
} from "@/routes";

import { GitHub } from "@/components/icons/GitHub";
import FormAuthenticityField from "@/components/FormAuthenticityField";

const registrationSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required." })
      .min(3, { error: "Username must be at least 3 characters long." })
      .max(20, { error: "Username must be no more than 20 characters long." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        error: "Username can only contain letters, numbers, and underscores.",
      }),
    email: z.email({ error: "Please enter a valid email address." }),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, { error: "Password must be at least 8 characters long." }),
    password_confirmation: z.string({
      required_error: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export default function Register() {
  const {
    data,
    setData,
    post,
    processing,
    errors: serverErrors,
    clearErrors,
  } = useForm({
    user: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState({
    loading: false,
    message: "",
    isAvailable: false,
  });

  useEffect(() => {
    const username = data.user.username.trim();
    if (username.length < 3) {
      setUsernameStatus({ loading: false, message: "", isAvailable: false });
      return;
    }

    setUsernameStatus({ ...usernameStatus, loading: true });
    const timer = setTimeout(() => {
      axios
        .get(validate_username_users_path({ username }), {
          headers: { "X-Inertia": false },
        })
        .then((response) => {
          if (response.data.is_taken) {
            setUsernameStatus({
              loading: false,
              message: "Username is already taken.",
              isAvailable: false,
            });
          } else {
            setUsernameStatus({
              loading: false,
              message: "Username is available!",
              isAvailable: true,
            });
            clearErrors("user.username");
          }
        })
        .catch(() => {
          setUsernameStatus({
            loading: false,
            message: "Could not validate username.",
            isAvailable: false,
          });
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [data.user.username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});
    clearErrors();

    const validationResult = registrationSchema.safeParse(data.user);

    if (!validationResult.success) {
      const flattenedErrors = z.flattenError(validationResult.error);
      setFormErrors(flattenedErrors.fieldErrors);
      return;
    }

    post(user_registration_path(), {
      onError: (backendErrors) => {
        console.error("Registration errors from server:", backendErrors);
      },
    });
  };

  const getError = (fieldName) => {
    return formErrors[fieldName]?.[0] || serverErrors[`user.${fieldName}`];
  };

  return (
    <>
      <Head title="Sign Up - WereWere" />
      <div className="min-h-screen bg-gradient-to-br from-background to-orange-50 dark:to-orange-950/20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href={root_path()}
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">WereWere</h1>
            </div>
          </div>

          <Card className="border-orange-100 dark:border-orange-900/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join WereWere</CardTitle>
              <CardDescription>
                Create your account to start connecting instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Use `noValidate` to prevent default browser validation, relying solely on Zod. */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Username with real-time validation */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="your_username"
                    value={data.user.username}
                    onChange={(e) => setData("user.username", e.target.value)}
                    className={`focus:ring-orange-500 ${
                      getError("username")
                        ? "border-red-500 focus:border-red-500"
                        : usernameStatus.isAvailable
                          ? "border-green-500 focus:border-green-500"
                          : "focus:border-orange-500"
                    }`}
                    required
                  />
                  {usernameStatus.loading && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Checking...
                    </p>
                  )}
                  {usernameStatus.message && !usernameStatus.loading && (
                    <p
                      className={`text-sm flex items-center mt-1 ${
                        usernameStatus.isAvailable
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {usernameStatus.isAvailable ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <AlertCircle className="w-4 h-4 mr-1" />
                      )}
                      {usernameStatus.message}
                    </p>
                  )}
                  {getError("username") && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getError("username")}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={data.user.email}
                    onChange={(e) => setData("user.email", e.target.value)}
                    className={`focus:ring-orange-500 focus:border-orange-500 ${
                      getError("email")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    required
                  />
                  {getError("email") && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getError("email")}
                    </p>
                  )}
                </div>

                {/* Password with Show/Hide Toggle */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={data.user.password}
                      onChange={(e) => setData("user.password", e.target.value)}
                      className={`focus:ring-orange-500 focus:border-orange-500 ${
                        getError("password")
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {getError("password") && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getError("password")}
                    </p>
                  )}
                </div>

                {/* Password Confirmation */}
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    value={data.user.password_confirmation}
                    onChange={(e) =>
                      setData("user.password_confirmation", e.target.value)
                    }
                    className={`focus:ring-orange-500 focus:border-orange-500 ${
                      getError("password_confirmation")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                    required
                  />
                  {getError("password_confirmation") && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {getError("password_confirmation")}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={processing}
                >
                  {processing ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <form
                action={user_github_omniauth_authorize_path()}
                method="post"
              >
                <FormAuthenticityField />
                <button
                  className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-orange-500 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  type="submit"
                >
                  <GitHub className="mr-2 h-4 w-4" />
                  GitHub
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  href={new_user_session_path()}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
