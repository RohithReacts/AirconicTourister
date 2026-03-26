import { Link } from "react-router";
import brandLogo from "../assets/Brandlogo.webp";

export function BrandLogo({ className }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-14 w-14 items-center justify-center">
        <img
          src={brandLogo}
          alt="BrandLogo"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <span className="text-xl text-foreground font-semibold tracking-wide font-poppins">
        Airconic Tourister
      </span>
    </Link>
  );
}
