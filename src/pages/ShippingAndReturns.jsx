import React from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ShippingAndReturns() {
  useDocumentTitle("Shipping & Returns");
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Shipping & Returns
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to know about how we deliver your travel
          companions to your doorstep, and our hassle-free return policy.
        </p>
      </div>

      <div className="space-y-16">
        {/* Shipping Section */}
        <section className="animate-in slide-in-from-bottom-8 duration-500 fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Shipping Policy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Processing Time</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All orders are processed within 1-2 business days. Orders
                    are not shipped or delivered on weekends or holidays.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex gap-4">
                <Truck className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Delivery Estimates</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Standard shipping usually takes 3-5 business days. Expedited
                    shipping options (1-2 days) are available at checkout.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground">
            <h3 className="text-foreground font-bold text-xl mb-3">
              Shipping Rates & Cost
            </h3>
            <p className="mb-6">
              Shipping charges for your order will be calculated and displayed
              at checkout. We offer <strong>Free Standard Shipping</strong> on
              all domestic orders over ₹5,000. For orders under ₹5,000, a flat
              standard rate of ₹150 will be applied.
            </p>

            <h3 className="text-foreground font-bold text-xl mb-3">
              Order Tracking
            </h3>
            <p>
              Once your order has shipped, you will receive a confirmation email
              containing your tracking number(s). You can actively track your
              shipment status by visiting our Tracking page or navigating to "My
              Orders" via your account dashboard.
            </p>
          </div>
        </section>

        {/* Retuns Section */}
        <section className="animate-in slide-in-from-bottom-8 duration-800 fade-in mt-12 pt-12 border-t border-border/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Returns Policy</h2>
          </div>

          <Card className="border-border/50 shadow-sm bg-muted/10 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <ShieldCheck className="text-emerald-500 h-6 w-6" />
                    30-Day Money-Back Guarantee
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    We want you to be completely satisfied with your purchase.
                    If you are not absolutely completely satisfied with your
                    Airconic Tourister product, you may return it within{" "}
                    <strong>30 days of receipt</strong> for a full refund or
                    exchange.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        Items must be unused and in the same condition that you
                        received them.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        Items must be in the original packaging with all tags
                        attached.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        Proof of purchase or receipt is required.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-foreground font-bold text-xl mb-3">
                How to Return an Item
              </h3>
              <p>
                To initiate a return, please log into your account, go to "My
                Orders", and select the "Return" option next to the eligible
                item. Alternatively, you can contact our customer support team
                at Gujarathirohithkumar@gmail.com with your order number. We
                will provide you with a prepaid return shipping label via email.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-bold text-xl mb-3">
                Refunds Processing
              </h3>
              <p>
                Once your return is received and inspected, we will notify you
                of the approval or rejection of your refund. If approved, a
                credit will automatically be applied to your credit card or
                original method of payment within 5-7 business days.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-bold text-xl mb-3">
                Exchanges
              </h3>
              <p>
                We only replace items if they are defective or damaged upon
                arrival. If you need to exchange it for the same item or a
                different color/size, please initiate a standard return and
                place a new order.
              </p>
            </div>
            <div>
              <h3 className="text-foreground font-bold text-xl mb-3">
                Non-returnable Items
              </h3>
              <p>
                Monogrammed, personalized, and final sale items cannot be
                returned or exchanged unless there is a manufacturing defect.
                Gift cards are also strictly non-refundable.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
