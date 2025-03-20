
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/components/ui/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updatePassword, error, clearError } = useAuth();
  const { toast } = useToast();

  // Extract the token from the URL parameters
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");

  // Validation for password match
  const passwordsMatch = password === confirmPassword;
  const passwordError = password && confirmPassword && !passwordsMatch 
    ? "Passwords do not match" 
    : null;

  // Validation for password strength
  const isPasswordStrong = password.length >= 8;
  const passwordStrengthError = password && !isPasswordStrong 
    ? "Password must be at least 8 characters long" 
    : null;

  useEffect(() => {
    // Verify we have the required tokens
    if (!accessToken || !refreshToken || type !== "recovery") {
      toast({
        title: "Invalid or expired link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive"
      });
      navigate("/forgot-password");
    }
  }, [accessToken, refreshToken, type, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validate passwords
    if (!passwordsMatch) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (!isPasswordStrong) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (accessToken && refreshToken) {
        await updatePassword(accessToken, refreshToken, password);
        setIsSuccess(true);
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Password update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Building className="w-6 h-6 text-primary mr-2" />
                <h1 className="text-xl font-bold">JobReferral</h1>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Password Changed!</CardTitle>
              <CardDescription>
                Your password has been updated successfully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  You can now use your new password to log in to your account.
                </p>
                <Link to="/login">
                  <Button className="w-full">
                    Go to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="py-6 px-4 border-t">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>© 2023 JobReferral. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building className="w-6 h-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">JobReferral</h1>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
            <CardDescription>
              Please enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  showPasswordToggle={true}
                />
                {passwordStrengthError && (
                  <p className="text-sm text-destructive mt-1">{passwordStrengthError}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  showPasswordToggle={true}
                />
                {passwordError && (
                  <p className="text-sm text-destructive mt-1">{passwordError}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !passwordsMatch || !isPasswordStrong}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="py-6 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2023 JobReferral. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ResetPassword;
