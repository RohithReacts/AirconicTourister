import * as React from "react";
import { Link } from "react-router";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand & Description */}
          <div className="flex flex-col gap-5">
            <BrandLogo className="origin-left scale-90" />
            <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed pr-4">
              Discover the perfect travel companion with our premium selection
              of luggage, backpacks, and duffles. Designed for durability and
              style to elevate your journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5 lg:ml-8">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Shop
            </h3>
            <nav className="flex flex-col gap-3.5">
              <Link
                to="/luggage"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Luggage
              </Link>
              <Link
                to="/soft-luggage"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Soft Luggage
              </Link>
              <Link
                to="/backpacks"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Backpacks
              </Link>
              <Link
                to="/duffles"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Duffles
              </Link>
              <Link
                to="/accessories"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Accessories
              </Link>
              <Link
                to="/office"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Office
              </Link>
              <Link
                to="/kids"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Kids
              </Link>
              <Link
                to="/collection"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Collections
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Support
            </h3>
            <nav className="flex flex-col gap-3.5">
              <Link
                to="/faqs"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                FAQs
              </Link>
              <Link
                to="/shipping-and-returns"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Shipping & Returns
              </Link>
              <Link
                to="/track-order"
                className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-[15px] w-fit"
              >
                Order Tracking
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 text-[15px]">
                <MapPin className="h-5 w-5 text-slate-900 dark:text-slate-100 shrink-0 mt-0.5" />
                <span>
                  6-7-66, Raganna Darwaza, Main Road, Hyderabad - Warangal Hwy,
                  Brahmanawada, Hanamkonda, Telangana 506011
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[15px]">
                <Phone className="h-5 w-5 text-slate-900 dark:text-slate-100 shrink-0" />
                <span>8374200125</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[15px]">
                <Mail className="h-5 w-5 text-slate-900 dark:text-slate-100 shrink-0" />
                <span>Gujarathirohithkumar@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">
            &copy; {new Date().getFullYear()} Airconic Tourister. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="#"
              className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
