import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/api/axios";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialUser = () => {
    const userStr =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (userStr) {
      const data = JSON.parse(userStr);
      return {
        name: data.name || "",
        avatar: data.avatar || "",
      };
    }
    return { name: "", avatar: "" };
  };

  const [user, setUser] = useState(getInitialUser());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setUser({
          name: response.data.name || "",
          avatar: response.data.avatar || "",
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };
    fetchProfile();

    const handleUserUpdate = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser({
          name: userData.name || "",
          avatar: userData.avatar || "",
        });
      }
    };

    window.addEventListener("user_update", handleUserUpdate);
    return () => window.removeEventListener("user_update", handleUserUpdate);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Successfully signed out");
    navigate("/signin");
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="px-4 md:px-8 lg:px-12 flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            {location.pathname !== "/admin/products/create" && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    location.pathname === link.href ||
                    (link.href !== "/admin" &&
                      location.pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3 py-1.5 px-3 backdrop-blur-sm shadow-sm transition-all duration-500 group cursor-default">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {user.name || "Admin"}
              </p>
            
            </div>
            <Avatar className="h-11 w-11 rounded-xl border border-border/60 shadow-inner overflow-hidden transition-transform group-hover:scale-105 duration-300">
              <AvatarImage
                src={user.avatar}
                className="object-cover rounded-xl"
              />
              <AvatarFallback className="bg-slate-800 text-white rounded-xl text-xs font-bold">
                {user.name?.substring(0, 2).toUpperCase() || "AD"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
