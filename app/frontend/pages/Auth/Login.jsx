import { Head, useForm, Link } from "@inertiajs/react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, ArrowLeft, AlertCircle } from "lucide-react";
import {
  new_user_registration_path,
  user_session_path,
  root_path,
  user_github_omniauth_authorize_path,
  user_google_oauth2_omniauth_authorize_path,
} from "@/routes";

import { GitHub } from "@/components/icons/GitHub";
import { Google } from "@/components/icons/Google";
import FormAuthenticityField from "@/components/FormAuthenticityField";

export default function Login({ alert, notice }) {
  const { data, setData, post, processing, errors } = useForm({
    user: {
      login: "",
      password: "",
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(user_session_path(), {
      onSuccess: () => {
        setData({
          user: {
            login: "",
            password: "",
          },
        });
      },
      onError: (backendErrors) => {
        console.error("Login errors:", backendErrors);
      },
    });
  };

  return (
    <>
      <Head title="Log In - WereWere" />
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
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(alert || notice) && (
                <Alert
                  variant={alert ? "destructive" : "default"}
                  className="mb-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{alert || notice}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login">Email or Username</Label>
                  <Input
                    id="login"
                    type="text"
                    placeholder="your@email.com or your_username"
                    value={data.user.login}
                    onChange={(e) => setData("user.login", e.target.value)}
                    className={`focus:ring-orange-500 focus:border-orange-500 ${
                      errors.login
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  {errors.login && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.login}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.user.password}
                    onChange={(e) => setData("user.password", e.target.value)}
                    className={`focus:ring-orange-500 focus:border-orange-500 ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* General authentication errors */}
                {errors.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={processing}
                >
                  {processing ? "Signing In..." : "Sign In"}
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

              <div className="grid grid-cols-2 gap-4">
                <form
                  action={user_google_oauth2_omniauth_authorize_path()}
                  method="post"
                >
                  <FormAuthenticityField />
                  <button
                    className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-orange-500 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    type="submit"
                  >
                    <Google className="mr-2 h-4 w-4" />
                    Google
                  </button>
                </form>

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
              </div>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <Link
                  href={new_user_registration_path()}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

Login.propTypes = {};
