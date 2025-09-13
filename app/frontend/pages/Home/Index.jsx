import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, Zap } from "lucide-react";
import { new_user_registration_path, new_user_session_path } from "@/routes";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <>
      <Head title="WereWere - Connect Instantly" />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-orange-50 dark:to-orange-950/20">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">WereWere</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href={new_user_session_path()}>
                <Button
                  variant="ghost"
                  className="hover:bg-orange-100 dark:hover:bg-orange-900/20"
                >
                  Log In
                </Button>
              </Link>
              <Link href={new_user_registration_path()}>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Connect <span className="text-orange-500">Instantly</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Fast, and simple messaging. Stay connected with friends, family,
              and colleagues with WereWere's lightning-fast chat platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href={new_user_registration_path()}>
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href={new_user_session_path()}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-900/20 px-8 py-3 text-lg bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-16">
              <Card className="border-orange-100 dark:border-orange-900/20">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg">Lightning Fast</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Messages delivered instantly with real-time synchronization
                    across all your devices.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-orange-100 dark:border-orange-900/20">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-orange-500" />
                  </div>
                  <CardTitle className="text-lg">Cross Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access your messages from web, mobile, or desktop -
                    seamlessly synchronized.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-orange-100 dark:border-orange-900/20 mt-16">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 WereWere. Built for instant connections.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
