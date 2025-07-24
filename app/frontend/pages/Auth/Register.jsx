import { Head, useForm, Link } from "@inertiajs/react";
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
import { MessageCircle, ArrowLeft } from "lucide-react";
import {
  new_user_session_path,
  user_registration_path,
  root_path,
} from "@/routes";
import { useToast } from "@/hooks/useToast";

export default function Register({ errors: initialErrors }) {
  const { toast } = useToast();
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
        toast({
          title: "Welcome to WereWere!",
          description: "Your account has been created successfully.",
        });
      },
      onError: (backendErrors) => {
        console.error("Registration errors:", backendErrors);
      },
    });
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={data.user.email}
                    onChange={(e) => setData("user.email", e.target.value)}
                    className="focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.user.password}
                    onChange={(e) => setData("user.password", e.target.value)}
                    className="focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  {errors.password && (
                    <p className="text-destructive text-sm">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.user.password_confirmation}
                    onChange={(e) =>
                      setData("user.password_confirmation", e.target.value)
                    }
                    className="focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                  {errors.password_confirmation && (
                    <p className="text-destructive text-sm">
                      {errors.password_confirmation}
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

Register.propTypes = {
  errors: PropTypes.object,
};
