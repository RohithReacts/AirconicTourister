import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { BrandLogo } from "@/components/BrandLogo";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  useDocumentTitle("Reset Password");
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. The link may have expired.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-lg border-muted">
        <CardHeader className="space-y-2 text-center flex flex-col items-center">
          <BrandLogo className="mb-4" />
          <h2 className="text-xl font-semibold font-poppins">Reset Password</h2>
          <p className="text-sm text-muted-foreground font-poppins">
            Enter your new password below.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2 shadow-sm cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center border-t py-4">
          <div className="text-sm text-muted-foreground font-poppins font-medium text-center">
            Back to{" "}
            <Link
              to="/signin"
              className="font-semibold font-poppins text-primary"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
