import React, { useState, useRef } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Lock,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import api from "@/api/axios";
import defaultAvatar from "@/assets/default-avatar.png";

export default function AccountSettings() {
  useDocumentTitle("Account Settings");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setProfile({
          name: response.data.name || "",
          email: response.data.email || "",
          avatar: response.data.avatar || "",
          role: response.data.role || "customer",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Successfully signed out");
    navigate("/signin");
  };

  const handleRoleUpdate = async (newRole) => {
    setLoading(true);
    try {
      // In a real app, you would have an endpoint like:
      // await api.put("/user/role", { role: newRole });

      // Simulating backend delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update state
      setProfile((prev) => ({ ...prev, role: newRole }));

      // Update localStorage so ProtectedRoute and Navbar pick it up
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.role = newRole;
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(
        `Role updated to ${newRole === "admin" ? "Verified Admin" : "Standard User"}`,
      );

      // Reload to ensure all components (Navbar, etc.) refresh their auth state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/user/profile", profile);

      // Sync with localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          name: profile.name,
          avatar: profile.avatar,
        }),
      );

      // Trigger Navbar update
      window.dispatchEvent(new Event("user_update"));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setLoading(true);
    try {
      await api.put("/user/password", {
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      toast.success("Password updated successfully");
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await api.delete("/user/deactivate");
      toast.success("Account deactivated");
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error deactivating account:", error);
      toast.error(
        error.response?.data?.message || "Failed to deactivate account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-10">
          {profile.role === "admin" ? (
            <Link
              to="/admin"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Store
            </Link>
          )}

          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg">
              Manage your profile, security preferences, and account status.
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="bg-muted/50 p-1 border border-border">
              <TabsTrigger value="profile" className="gap-2 px-6">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2 px-6">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="danger"
                className="gap-2 px-6 text-red-400 data-[state=active]:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Avatar Sidebar */}
              <Card className="bg-card border-border shadow-xl overflow-hidden md:col-span-1">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">Profile Photo</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 pt-4">
                  <div className="relative group">
                    <Avatar className="h-36 w-36 rounded-2xl border-2 border-border ring-4 ring-black/50 overflow-hidden shadow-2xl">
                      <AvatarImage
                        src={
                          profile.avatar ||
                          (profile.role !== "admin" ? defaultAvatar : "")
                        }
                        alt={profile.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted text-2xl font-bold">
                        {profile.name?.substring(0, 2).toUpperCase() || "RK"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="w-full space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Account Status
                      </span>
                    </div>

                    {profile.role === "admin" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 group/status transition-colors hover:bg-blue-500/15">
                          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover/status:scale-110 transition-transform">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold text-blue-400">
                              Verified Admin
                            </p>
                            <p className="text-[10px] text-blue-500/70 font-medium tracking-tight">
                              Full System Control
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRoleUpdate("customer")}
                          disabled={loading}
                          className="w-full text-[10px] h-7 text-muted-foreground hover:text-foreground hover:bg-white/5 border border-dashed border-border"
                        >
                          Step down to User
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border group/status transition-colors hover:bg-muted">
                        <div className="p-2 rounded-lg bg-muted-foreground/20 text-muted-foreground group-hover/status:scale-110 transition-transform">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-bold text-foreground">
                            Standard User
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium tracking-tight">
                            Customer Account
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-muted-foreground text-center pt-1">
                      Joined as a {profile.role || "customer"}
                    </p>
                  </div>
                </CardContent>
                <p className="text-[11px] text-muted-foreground text-center">
                  User information is synced across the application.
                </p>
              </Card>

              {/* Profile Form */}
              <Card className="bg-card border-border shadow-xl md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Update your account details and how others see you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-muted-foreground">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="bg-background border-border focus:ring-1 focus:ring-zinc-700 h-11"
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-muted-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          readOnly
                          className="bg-background border-border text-muted-foreground h-11 pr-10 cursor-not-allowed"
                          placeholder="your.email@example.com"
                        />
                        <ShieldCheck className="absolute right-3 top-3 h-5 w-5 text-zinc-600" />
                      </div>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1 ml-1">
                        <AlertCircle className="h-3 w-3" />
                        Email verification is required to change this.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="text-muted-foreground">
                        Avatar URL
                      </Label>
                      <Input
                        id="avatar"
                        value={profile.avatar}
                        onChange={(e) =>
                          setProfile({ ...profile, avatar: e.target.value })
                        }
                        className="bg-background border-border focus:ring-1 focus:ring-zinc-700 h-11"
                        placeholder="https://example.com/your-photo.jpg"
                      />
                      <p className="text-[11px] text-muted-foreground ml-1">
                        Provide a URL to your profile image.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/50 flex justify-end">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 px-8 rounded-lg transition-all active:scale-[0.98]"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="outline-none">
            <Card className="bg-card border-border shadow-xl max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  Password & Security
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage your password and secure your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-background border-border h-11"
                      placeholder="••••••••"
                      value={password.currentPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Separator className="bg-muted" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="bg-background border-border h-11"
                        placeholder="••••••••"
                        value={password.newPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="bg-background border-border h-11"
                        placeholder="••••••••"
                        value={password.confirmPassword}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
                    >
                      Update Password
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      Password must be at least 8 characters long and include
                      numbers or symbols.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="outline-none">
            <Card className="bg-red-950/10 border-red-900/30 shadow-xl max-w-2xl mx-auto overflow-hidden">
              <div className="h-1 bg-red-600 w-full" />
              <CardHeader>
                <CardTitle className="text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Delete Account
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Permanently remove your account and all associated data. This
                  action is irreversible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-border text-sm text-muted-foreground">
                  Deleting your account will:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Remove your administrative access</li>
                    <li>Delete all your personal preferences</li>
                    <li>Remove your profile from the system</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="bg-red-950/20 border-t border-red-900/20 p-6 flex justify-between items-center">
                <div className="text-xs text-muted-foreground max-w-[200px]">
                  Please be certain. This cannot be undone.
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-300 hover:bg-red-200 h-11 px-6 shadow-lg shadow-red-900/20 dark:bg-red-900 dark:hover:bg-red-800 cursor-pointer"
                    >
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-500">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-muted hover:bg-muted-foreground/20 border-border text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeactivate}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Yes, Deactivate
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
