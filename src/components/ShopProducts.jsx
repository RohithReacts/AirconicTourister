import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ReusableCarousel } from "@/components/ReusableCarousel";
import { ShoppingBag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ShopProducts({
  title = "Shop Products",
  subtitle = "Our favorite picks for the season",
  tabs = [],
  className,
}) {
  if (!tabs?.length) return null;

  return (
    <section className={cn("py-16 md:py-24 bg-background", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-wide mb-2 text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground mb-8 text-md lg:text-md font-medium">
          {subtitle}
        </p>

        <Tabs defaultValue={tabs[0]?.value} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
            <TabsList className="bg-transparent h-auto p-0 flex space-x-8 border-b border-border/60 w-full sm:w-auto rounded-none justify-start">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-0 py-3 text-base md:text-lg font-bold text-muted-foreground hover:text-foreground transition-colors border-x-0 border-t-0 border-b-4 border-transparent data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-blue-600 data-[state=active]:text-foreground rounded-none!"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Link to="/luggage">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full sm:w-auto rounded-md shrink-0 px-8 py-6 text-sm md:text-base cursor-pointer"
              >
                SHOP NOW
              </Button>
            </Link>
          </div>

          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="mt-0 outline-none animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-500 ease-out"
            >
              <ReusableCarousel
                items={tab.items}
                opts={{ align: "start", loop: false, dragFree: true }}
                itemClassName="basis-auto"
                className="w-full"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export function ProductCard({
  id,
  image,
  title,
  badge,
  buttonText,
  icon,
  isCollection,
  className,
  price,
  mrp,
  color,
  link,
}) {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleIconClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) return;

    setIsAdding(true);

    try {
      // Artificial delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get existing cart
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Check if product already in cart
      const existingProductIndex = existingCart.findIndex(
        (item) => item._id === id,
      );

      const productToAdd = {
        _id: id,
        title,
        image,
        salePrice: price || 0,
        pricemrp: mrp || 0,
        color: color || "",
      };

      if (existingProductIndex >= 0) {
        existingCart[existingProductIndex].quantity =
          (existingCart[existingProductIndex].quantity || 1) + 1;
      } else {
        existingCart.push({ ...productToAdd, quantity: 1 });
      }

      // Save cart
      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Dispatch event so Navbar can update
      window.dispatchEvent(new Event("cart_update"));

      // Open cart panel instantly
      window.dispatchEvent(new Event("open_cart"));

      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const cardContent = (
    <div
      className={cn(
        "flex flex-col gap-3 w-[180px] sm:w-[220px] md:w-[280px]",
        className,
      )}
    >
      <div className="relative aspect-4/4.5 rounded-2xl overflow-hidden bg-muted group cursor-pointer border border-border/40 shrink-0">
        <img
          src={image}
          alt={title || "Product"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Badge */}
        {badge && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 text-red-600 font-extrabold text-xs md:text-sm tracking-tight z-10 drop-shadow-sm">
            {badge}
          </div>
        )}

        {/* Collection specific styling */}
        {isCollection && title && (
          <div className="absolute top-4 left-4 md:top-5 md:left-5 text-white font-bold text-base md:text-lg z-10 drop-shadow-md">
            {title}
          </div>
        )}

        {/* Bottom Button/Icon */}
        {buttonText && (
          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/95 text-black hover:bg-white font-extrabold px-4 py-3 md:px-5 md:py-4 rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-xs md:text-sm"
            >
              {buttonText}
            </Button>
          </div>
        )}

        {icon && (
          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-10">
            <button
              onClick={handleIconClick}
              disabled={isAdding}
              className={cn(
                "bg-white/95 text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all group/btn flex items-center justify-center gap-2",
                isAdding
                  ? "rounded-md px-3 py-2 md:px-4 md:py-2.5"
                  : "p-2 md:p-3 rounded-b-full",
              )}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                  <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">
                    Quick To Cart
                  </span>
                </>
              ) : (
                <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-black transition-colors" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Title Below Image */}
      {!isCollection && title && (
        <div className="flex flex-col gap-1 px-1">
          <h3
            className="font-semibold text-base md:text-lg text-foreground line-clamp-1"
            title={title}
          >
            {title}
          </h3>
          {color && (
            <span className="text-sm text-muted-foreground capitalize leading-snug">
              {color}
            </span>
          )}
          {price !== undefined && (
            <div className="flex items-end gap-2 mt-0.5">
              <span className="text-lg lg:text-lg md:text-xl font-semibold text-foreground tracking-tight leading-none">
                ₹ {Number(price).toLocaleString("en-IN")}
              </span>
              {mrp > price && (
                <span className="text-sm mb-0.5 font-semibold text-muted-foreground line-through decoration-muted-foreground/50 leading-none">
                  ₹ {Number(mrp).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const navigateUrl = id ? `/product/${id}` : link;

  if (navigateUrl) {
    return (
      <Link
        to={navigateUrl}
        className="block outline-none hover:opacity-95 transition-opacity"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
