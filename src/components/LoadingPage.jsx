import React from "react";
import brandLogo from "../assets/Brandlogo.webp";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex flex-col items-center justify-center bg-background rounded-xl">
      <div className="flex flex-col items-center gap-6 fade-in-0 animate-in zoom-in-95 duration-500">
        <div className="relative flex items-center justify-center">
          <img
            src={brandLogo}
            alt="Airconic Tourister"
            className="w-24 h-24 object-cover rounded-3xl shadow-sm border border-border/40"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          
        </div>
      </div>
    </div>
  );
}
