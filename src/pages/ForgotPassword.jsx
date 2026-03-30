import { useState } from "react";
import { Link } from "react-router";
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

export default function ForgotPassword() {
  useDocumentTitle("Forgot Password");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(
        res.data.message || "Password reset link sent to your email!",
      );
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again.",
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
          <h2 className="text-xl font-semibold font-poppins">
            Forgot Password
          </h2>
          <p className="text-sm text-muted-foreground font-poppins">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2 shadow-sm cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center border-t py-4">
          <div className="text-sm text-muted-foreground font-poppins font-medium text-center">
            Remember your password?{" "}
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
