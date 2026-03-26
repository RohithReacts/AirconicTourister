import React from "react";
import { Link } from "react-router";
import { MoveLeft, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import notFoundImg from "@/assets/notfound.png";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center py-12">
      <div className="relative mb-12 max-w-lg w-full">
        <img
          src={notFoundImg}
          alt="404 Illustration"
          className="w-full h-auto object-contain mx-auto drop-shadow-2xl animate-in fade-in zoom-in duration-700"
        />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full">
          <div className="bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-border shadow-2xl inline-block">
            <p className="text-2xl md:text-3xl font-semibold tracking-tight">
              Oops! Page not found
            </p>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
        It looks like the page you're looking for has taken a vacation. Don't
        worry, even the best explorers get lost sometimes.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button
          asChild
          variant="default"
          size="lg"
          className="h-12 px-8 rounded-full"
        >
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 px-8 rounded-full"
        >
          <Link to="/luggage" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl opacity-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
            1
          </div>
          <p className="text-sm font-medium">Check the URL</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
            2
          </div>
          <p className="text-sm font-medium">Clear Cache</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
            3
          </div>
          <p className="text-sm font-medium">Contact Support</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
