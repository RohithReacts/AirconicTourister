import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import api from "../api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

function SignUp() {
  useDocumentTitle("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", formData);
      console.log(res, "data");

      toast.success("Account created successfully!");
      navigate("/signin");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-lg border-muted">
       
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">User Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Hello"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="transition-colors focus-visible:ring-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="transition-colors focus-visible:ring-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 cursor-pointer" />
                  ) : (
                    <Eye className="h-4 w-4 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6 shadow-sm cursor-pointer"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center">
          <div className="text-sm text-muted-foreground font-poppins font-medium text-center">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold font-poppins">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
