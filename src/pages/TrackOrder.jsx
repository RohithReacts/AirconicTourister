import React, { useState, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSearchParams, Link } from "react-router";
import {
  Package,
  Search,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import api from "../api/axios";

export default function TrackOrder() {
  useDocumentTitle("Track Order");
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get("id") || "";
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId) {
      handleTrackOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrackOrder = async (idToFetch) => {
    const id = idToFetch || orderId;
    if (!id.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      // We will try to fetch from myorders first if logged in
      const token = localStorage.getItem("token");
      let foundOrder = null;

      if (token) {
        try {
          const myOrdersRes = await api.get("/orders/myorders");
          const myOrders = myOrdersRes.data;
          foundOrder = myOrders.find((o) => o._id === id);
        } catch (err) {
          console.error("Error fetching myorders for tracking", err);
        }
      }

      if (!foundOrder) {
        // Fallback to calling single order endpoint if available
        const res = await api.get(`/orders/${id}`);
        foundOrder = res.data;
      }

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError("Order not found. Please check your Order ID.");
      }
    } catch (err) {
      console.error("Tracking Error:", err);
      setError(
        "Order not found or you don't have permission to view it. Make sure you are logged in if this is your order.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status, isActive) => {
    const className = `h-6 w-6 ${isActive ? "text-primary" : "text-muted-foreground/40"}`;
    switch (status) {
      case "Processing":
        return <Clock className={className} />;
      case "Shipped":
        return <Truck className={className} />;
      case "Delivered":
        return <CheckCircle2 className={className} />;
      case "Cancelled":
        return (
          <XCircle
            className={`h-6 w-6 ${isActive ? "text-red-500" : "text-muted-foreground/40"}`}
          />
        );
      default:
        return <Package className={className} />;
    }
  };

  const statusSteps = ["Processing", "Shipped", "Delivered"];

  const getStepStatus = (stepStatus) => {
    if (!order) return false;
    if (order.status === "Cancelled") return false;

    const currentIndex = statusSteps.indexOf(order.status);
    const stepIndex = statusSteps.indexOf(stepStatus);

    return currentIndex >= stepIndex;
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Track Your Order
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Enter your Order ID below to check the current status and tracking
          history of your shipment.
        </p>
      </div>

      <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden mb-8">
        <div className="p-1 border-b border-border/50 bg-muted/20" />
        <CardContent className="p-6 md:p-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrackOrder();
            }}
            className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
              <Input
                placeholder="Enter Order ID (e.g. 64b8f...)"
                className="pl-11 h-14 text-base font-medium rounded-xl border-2 focus-visible:ring-primary/20 bg-background"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="xl"
              className="h-14 px-8 rounded-xl font-bold text-base shadow-md w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Tracking...
                </div>
              ) : (
                "Track Order"
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl flex items-start gap-3 text-sm font-medium border border-red-100 dark:border-red-900/30 max-w-2xl mx-auto animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {order && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500 fade-in">
          <Card className="border-border/50 shadow-md">
            <div className="bg-muted/30 px-6 md:px-8 py-5 border-b border-border/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  Order Details
                </p>
                <h3 className="text-xl font-bold font-mono">#{order._id}</h3>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  Order Date
                </p>
                <p className="font-bold">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <CardContent className="p-6 md:p-10">
              {order.status === "Cancelled" ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-20 w-20 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">
                    Order Cancelled
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Your order has been cancelled and will not be shipped.
                  </p>
                </div>
              ) : (
                <div className="relative pt-8 pb-12">
                  <div className="absolute top-14 left-0 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                      style={{
                        width:
                          order.status === "Delivered"
                            ? "100%"
                            : order.status === "Shipped"
                              ? "50%"
                              : "0%",
                      }}
                    />
                  </div>

                  <div className="relative flex justify-between">
                    {statusSteps.map((step, idx) => {
                      const isActive = getStepStatus(step);
                      const isCurrent = order.status === step;

                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center gap-3 relative z-10"
                        >
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center border-4 ${
                              isActive
                                ? "bg-background border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                : "bg-background border-muted text-muted-foreground"
                            } transition-all duration-500`}
                          >
                            {getStatusIcon(step, isActive)}
                          </div>
                          <div className="text-center">
                            <p
                              className={`font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {step}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-primary font-medium mt-1 animate-pulse">
                                Current Status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Items
                </h4>
                <div className="space-y-4">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="h-16 w-16 bg-muted/30 rounded-lg flex items-center justify-center p-2 shrink-0 border border-border/50">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-sm shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                  <p className="text-muted-foreground font-medium">
                    Total Amount
                  </p>
                  <p className="text-xl font-extrabold text-primary">
                    ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Shipping Details
                </h4>
                <div className="bg-muted/20 p-4 rounded-xl border border-border/50 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Customer
                    </p>
                    <p className="font-medium">
                      {order.customerDetails?.firstName}{" "}
                      {order.customerDetails?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerDetails?.email}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-sm leading-relaxed">
                      {order.customerDetails?.address}
                      <br />
                      {order.customerDetails?.city},{" "}
                      {order.customerDetails?.state} -{" "}
                      {order.customerDetails?.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="outline" className="gap-2" asChild>
              <Link to="/my-orders">View All My Orders</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
