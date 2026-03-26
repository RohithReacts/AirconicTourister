import * as React from "react";
import { Link, useLocation } from "react-router";
import { Search, User, ShoppingBag, X, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandLogo } from "./BrandLogo";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const ListItem = React.forwardRef(
  ({ className, title, children, href, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            to={href}
            ref={ref}
            className={cn(
              "flex flex-col select-none gap-2 p-4 rounded-lg no-underline outline-none transition-all hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
              {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-slate-500 dark:text-slate-400">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

export function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isUserAdmin = currentUser?.role === "admin";
  const [cartItems, setCartItems] = React.useState([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [allProducts, setAllProducts] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);

  React.useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      import("@/api/axios").then((module) => {
        module.default
          .get("/products")
          .then((res) => {
            setAllProducts(res.data.Products || []);
          })
          .catch((e) => console.error(e));
      });
    }
  }, [isSearchOpen, allProducts.length]);

  React.useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const results = allProducts.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
      setSearchResults(results.slice(0, 6)); // showing up to 6 results
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  React.useEffect(() => {
    const fetchCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);
      } catch (e) {
        console.error("Error parsing cart", e);
      }
    };

    fetchCart();
    window.addEventListener("cart_update", fetchCart);

    // Listen for events to open cart manually
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener("open_cart", handleOpenCart);

    return () => {
      window.removeEventListener("cart_update", fetchCart);
      window.removeEventListener("open_cart", handleOpenCart);
    };
  }, []);

  const storeLinks = [
    { name: "Luggage", href: "/luggage" },
    { name: "Backpacks", href: "/backpacks" },
    { name: "Duffles", href: "/duffles" },
    { name: "Track Order", href: "/track-order" },
  ];

  const adminLinks = [];

  const currentLinks = isAdmin ? adminLinks : storeLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <BrandLogo className="scale-90 transform origin-left transition-transform hover:scale-95 duration-300" />
        </div>

        {/* Right: Navigation + Icons */}
        <div className="flex items-center gap-2 lg:gap-6">
          {/* Navigation Menu (Hidden on mobile) */}
          <div className="hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-1 xl:gap-2">
                {currentLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent text-[15px] font-medium text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
                      )}
                    >
                      <Link to={link.href}>{link.name}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-5 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-6 lg:ml-2">
            <ModeToggle />
            {!isAdmin && (
              <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <SheetTrigger asChild>
                  <button
                    className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-black dark:hover:bg-slate-800 dark:hover:text-white transition-all duration-300"
                    aria-label="Search"
                  >
                    <Search
                      className="h-[22px] w-[22px] cursor-pointer"
                      strokeWidth={2}
                    />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="top"
                  className="w-full flex flex-col pt-10 pb-6 items-center border-b shadow-md dark:border-border dark:bg-black/95 bg-white/95 backdrop-blur-xl"
                >
                  <div className="w-full max-w-3xl px-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                      <input
                        type="search"
                        autoFocus
                        placeholder="Search for backpacks, luggage, and more..."
                        className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-border/80 bg-muted/20 text-lg font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all shadow-sm dark:bg-zinc-900/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {searchQuery.trim().length > 1 && (
                    <div className="w-full max-w-5xl px-4 mt-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                          {searchResults.map((product) => (
                            <Link
                              key={product._id}
                              to={`/product/${product._id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex gap-4 p-3 rounded-2xl bg-card hover:bg-muted/50 border border-border/40 hover:border-border/80 transition-all shadow-sm group"
                            >
                              <div className="h-20 w-20 shrink-0 bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-border/40 flex items-center justify-center p-1">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <div className="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
                                <h4 className="font-semibold text-[15px] line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                  {product.title}
                                </h4>
                                <span className="font-extrabold text-foreground tracking-tight">
                                  ₹{" "}
                                  {Number(product.salePrice).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-in zoom-in-95 duration-500">
                          <Search className="h-12 w-12 mb-4 opacity-20" />
                          <p className="text-lg">
                            No results found for "{searchQuery}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            )}
            {/* User Account */}
            {localStorage.getItem("token") ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 group p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <div className="p-1">
                      <User className="h-5 w-5 text-slate-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 mt-2 shadow-xl border-border rounded-xl"
                >
                  <DropdownMenuLabel className="font-semibold px-3 py-2 text-sm text-foreground">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer font-medium hover:bg-muted/50 focus:bg-muted/50 py-2"
                  >
                    <Link to="/settings" className="w-full flex">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {!isUserAdmin && (
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer font-medium hover:bg-muted/50 focus:bg-muted/50 py-2"
                    >
                      <Link to="/my-orders" className="w-full flex">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    className="cursor-pointer font-bold text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30 py-2"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user_role");
                      window.location.href = "/signin";
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/signin" className="group relative">
                <div className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                  <User className="h-5 w-5 text-slate-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors" />
                </div>
              </Link>
            )}

            {/* Shopping Bag Icon (Hidden in Admin) */}
            {!isAdmin && (
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <button
                    className="flex h-10 w-10 relative items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all duration-300"
                    aria-label="Cart"
                  >
                    <ShoppingBag
                      className="h-[22px] w-[22px] cursor-pointer"
                      strokeWidth={2}
                    />
                    {cartItems.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black dark:bg-slate-100 text-[10px] font-bold text-white dark:text-slate-900 shadow-sm transform translate-x-1/4 -translate-y-1/4">
                        {cartItems.reduce(
                          (acc, item) => acc + (item.quantity || 1),
                          0,
                        )}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex flex-col w-full sm:max-w-lg bg-background"
                >
                  <SheetHeader className="pb-6">
                    <div className="flex items-center gap-3">
                      <SheetTitle className="text-2xl font-semibold tracking-tight">
                        Shopping Bag
                      </SheetTitle>
                    </div>
                  </SheetHeader>
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                      <ShoppingBag className="h-12 w-12 mb-4 opacity-50" />
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto mt-2 pr-4 -mr-4 flex flex-col gap-4">
                        {cartItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex gap-4 items-center bg-muted/20 hover:bg-muted/40 transition-colors p-3 rounded-2xl border border-border/30 group"
                          >
                            <div className="bg-white dark:bg-zinc-800 p-2 rounded-2xl shrink-0 shadow-sm border border-border/50">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-20 h-20 object-cover rounded-xl mix-blend-multiply dark:mix-blend-normal"
                              />
                            </div>
                            <div className="flex-1 py-1 flex flex-col justify-between h-full min-h-22">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-[15px] line-clamp-2 leading-tight pr-4">
                                  {item.title}
                                </h4>
                                <button
                                  onClick={() => {
                                    const newCart = cartItems.filter(
                                      (cartItem) => cartItem._id !== item._id,
                                    );
                                    setCartItems(newCart);
                                    localStorage.setItem(
                                      "cart",
                                      JSON.stringify(newCart),
                                    );
                                    window.dispatchEvent(
                                      new Event("cart_update"),
                                    );
                                  }}
                                  aria-label="Remove item"
                                  className="text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-full transition-all shrink-0"
                                >
                                  <X className="w-4 h-4" strokeWidth={2.5} />
                                </button>
                              </div>
                              <div className="flex justify-between items-end mt-3">
                                <span className="font-extrabold text-lg text-primary leading-none">
                                  ₹{" "}
                                  {(
                                    (item.salePrice || 0) * (item.quantity || 1)
                                  ).toLocaleString("en-IN")}
                                </span>
                                <div className="flex items-center bg-background border border-border/60 rounded-full shadow-sm px-1 py-1">
                                  <button
                                    onClick={() => {
                                      if ((item.quantity || 1) <= 1) return;
                                      const newCart = cartItems.map((c) =>
                                        c._id === item._id
                                          ? {
                                              ...c,
                                              quantity: (c.quantity || 1) - 1,
                                            }
                                          : c,
                                      );
                                      setCartItems(newCart);
                                      localStorage.setItem(
                                        "cart",
                                        JSON.stringify(newCart),
                                      );
                                      window.dispatchEvent(
                                        new Event("cart_update"),
                                      );
                                    }}
                                    className="p-1.5 hover:bg-muted rounded-full text-foreground/70 transition-colors"
                                  >
                                    <Minus
                                      className="w-3.5 h-3.5"
                                      strokeWidth={2.5}
                                    />
                                  </button>
                                  <span className="text-foreground w-6 text-center font-bold text-[13px] tabular-nums">
                                    {item.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() => {
                                      const newCart = cartItems.map((c) =>
                                        c._id === item._id
                                          ? {
                                              ...c,
                                              quantity: (c.quantity || 1) + 1,
                                            }
                                          : c,
                                      );
                                      setCartItems(newCart);
                                      localStorage.setItem(
                                        "cart",
                                        JSON.stringify(newCart),
                                      );
                                      window.dispatchEvent(
                                        new Event("cart_update"),
                                      );
                                    }}
                                    className="p-1.5 hover:bg-muted rounded-full text-foreground/70 transition-colors"
                                  >
                                    <Plus
                                      className="w-3.5 h-3.5"
                                      strokeWidth={2.5}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-6 mt-auto relative bg-background mb-2">
                        <div className="bg-muted/30 rounded-2xl p-5 border border-border/40">
                          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-3">
                            <span>Taxes & Shipping</span>
                            <span>Calculated at checkout</span>
                          </div>
                          <div className="flex justify-between items-center font-extrabold text-xl text-foreground pt-3 border-t border-border/60">
                            <span>Total</span>
                            <span>
                              ₹{" "}
                              {cartItems
                                .reduce(
                                  (acc, item) =>
                                    acc +
                                    (item.salePrice || 0) *
                                      (item.quantity || 1),
                                  0,
                                )
                                .toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                        <Button
                          asChild
                          size="xl"
                          className="flex mx-auto w-full mb-4 sm:w-80 mt-5 bg-foreground text-background py-4 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl text-lg tracking-wide cursor-pointer"
                        >
                          <Link
                            to="/checkout"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Checkout
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            )}

            {/* Mobile Navigation Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-black dark:hover:text-white transition-all duration-300"
                    aria-label="Menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <line x1="4" x2="20" y1="12" y2="12" />
                      <line x1="4" x2="20" y1="6" y2="6" />
                      <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left border-b pb-4 mb-4">
                    <BrandLogo className="scale-90 transform origin-left" />
                  </SheetHeader>

                  <nav className="flex flex-col gap-4">
                    {currentLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="text-lg font-medium px-2 py-1 hover:text-primary transition-colors flex items-center gap-3"
                      >
                        {link.icon && <link.icon size={20} />}
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
