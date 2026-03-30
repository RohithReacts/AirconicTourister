import React, { useState, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  Package,
  Download,
  Search,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Printer,
} from "lucide-react";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MyOrders() {
  useDocumentTitle("My Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/myorders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch my orders:", error);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4 mr-1 text-blue-500" />;
      case "Shipped":
        return <Truck className="h-4 w-4 mr-1 text-amber-500" />;
      case "Delivered":
        return <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" />;
      case "Cancelled":
        return <XCircle className="h-4 w-4 mr-1 text-red-500" />;
      default:
        return <Package className="h-4 w-4 mr-1" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 px-3 py-1"
          >
            {getStatusIcon("Processing")} Processing
          </Badge>
        );
      case "Shipped":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-3 py-1"
          >
            {getStatusIcon("Shipped")} Shipped
          </Badge>
        );
      case "Delivered":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-3 py-1"
          >
            {getStatusIcon("Delivered")} Delivered
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1"
          >
            {getStatusIcon("Cancelled")} Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="px-3 py-1">
            {status}
          </Badge>
        );
    }
  };

  const handleDownloadReceipt = (order) => {
    if (!order) return;

    const customer = order.customerDetails;
    const items = order.orderItems;

    let receiptContent = `=======================================\n`;
    receiptContent += `         AIRCONIC TOURISTER\n`;
    receiptContent += `         ORDER RECEIPT\n`;
    receiptContent += `=======================================\n\n`;
    receiptContent += `Order ID: ${order._id}\n`;
    receiptContent += `Date: ${new Date(order.createdAt).toLocaleString()}\n`;
    receiptContent += `Status: ${order.status}\n\n`;

    receiptContent += `CUSTOMER DETAILS:\n`;
    receiptContent += `Name: ${customer?.firstName || ""} ${customer?.lastName || ""}\n`;
    receiptContent += `Email: ${customer?.email || ""}\n`;
    receiptContent += `Address: ${customer?.address || ""}, ${customer?.city || ""}, ${customer?.state || ""} - ${customer?.zipCode || ""}\n\n`;

    receiptContent += `ORDER ITEMS:\n`;
    receiptContent += `---------------------------------------\n`;

    let subtotal = 0;
    let totalMrp = 0;

    if (items && items.length > 0) {
      items.forEach((item, index) => {
        const itemQty = item.quantity || 1;
        const itemSubtotal = (item.price || 0) * itemQty;
        const itemMrpTotal = (item.pricemrp || item.price || 0) * itemQty;

        subtotal += itemSubtotal;
        totalMrp += itemMrpTotal;

        receiptContent += `${index + 1}. ${item.title}\n`;
        let saveText = "";
        if (item.pricemrp && item.discount) {
          saveText = ` (MRP: ₹${item.pricemrp.toLocaleString("en-IN")} SAVE ${item.discount}%)`;
        }
        receiptContent += `   Qty: ${item.quantity} x ₹${(item.price || 0).toLocaleString("en-IN")}${saveText}\n`;
        receiptContent += `   Item Total: ₹${itemSubtotal.toLocaleString("en-IN")}\n`;
        receiptContent += `---------------------------------------\n`;
      });
    } else {
      receiptContent += `No items found.\n`;
      receiptContent += `---------------------------------------\n`;
    }

    const tax = subtotal * 0.03;
    const shipping = 150;
    const totalSavings = totalMrp - subtotal;

    receiptContent += `\nSubtotal: ₹${subtotal.toLocaleString("en-IN")}\n`;
    receiptContent += `Shipping: ₹${shipping.toLocaleString("en-IN")}\n`;
    receiptContent += `Estimated Tax (3%): ₹${tax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;

    if (totalSavings > 0) {
      receiptContent += `---------------------------------------\n`;
      receiptContent += `Total MRP: ₹${totalMrp.toLocaleString("en-IN")}\n`;
      receiptContent += `Total Discount: -₹${totalSavings.toLocaleString("en-IN")}\n`;
    }

    receiptContent += `---------------------------------------\n`;
    receiptContent += `TOTAL AMOUNT: ₹${(order.totalAmount || 0).toLocaleString("en-IN")}\n`;

    if (totalSavings > 0) {
      receiptContent += `\n🎉 YOU SAVED ₹${totalSavings.toLocaleString("en-IN")} ON THIS ORDER! 🎉\n`;
    }

    receiptContent += `=======================================\n`;
    receiptContent += `Thank you for shopping with us!\n`;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${order._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Receipt downloaded successfully!");
  };

  const handlePrintBill = (order) => {
    if (!order) return;

    const customer = order.customerDetails;
    const items = order.orderItems;

    let subtotal = 0;
    let totalMrp = 0;

    const itemsHtml =
      items && items.length > 0
        ? items
            .map((item, index) => {
              const itemQty = item.quantity || 1;
              const itemSubtotal = (item.price || 0) * itemQty;
              const itemMrpTotal = (item.pricemrp || item.price || 0) * itemQty;

              subtotal += itemSubtotal;
              totalMrp += itemMrpTotal;

              let saveText = "";
              if (item.pricemrp && item.discount) {
                saveText = `<br/><small style="color: #16a34a;">(MRP: ₹${item.pricemrp.toLocaleString("en-IN")} SAVE ${item.discount}%)</small>`;
              }

              return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.title}${saveText}</td>
          <td>${item.quantity}</td>
          <td>₹${(item.price || 0).toLocaleString("en-IN")}</td>
          <td>₹${itemSubtotal.toLocaleString("en-IN")}</td>
        </tr>
      `;
            })
            .join("")
        : '<tr><td colspan="5" style="text-align: center;">No items found.</td></tr>';

    const tax = subtotal * 0.03;
    const shipping = 150;
    const totalSavings = totalMrp - subtotal;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups for this site to print the bill.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Order Bill - ${order._id}</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .header h1 { margin: 0; color: #111; font-size: 28px; letter-spacing: 1px; }
            .header p { margin: 5px 0 0; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
            .flex-container { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .details-box { background: #f9f9f9; padding: 20px; border-radius: 8px; width: 45%; }
            .details-box h3 { margin-top: 0; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #444; }
            .details-box p { margin: 5px 0; font-size: 14px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 14px; color: #334155; border-bottom: 2px solid #cbd5e1; }
            .items td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; vertical-align: top; }
            .totals-container { display: flex; justify-content: flex-end; }
            .totals-box { width: 300px; }
            .totals-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .totals-row.grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #eee; padding-top: 15px; margin-top: 10px; }
            .savings { color: #16a34a; font-weight: bold; text-align: right; margin-top: 15px; font-size: 14px; }
            .footer { text-align: center; margin-top: 50px; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { padding: 0; }
              .details-box { background: transparent; border: 1px solid #eee; break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AIRCONIC TOURISTER</h1>
            <p>Tax Invoice / Bill of Supply</p>
          </div>
          
          <div class="flex-container">
            <div class="details-box">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            
            <div class="details-box">
              <h3>Billed To</h3>
              <p><strong>Name:</strong> ${customer?.firstName || ""} ${customer?.lastName || ""}</p>
              <p><strong>Email:</strong> ${customer?.email || ""}</p>
              <p><strong>Address:</strong> ${customer?.address || ""}, ${customer?.city || ""}</p>
              <p>${customer?.state || ""} - ${customer?.zipCode || ""}</p>
            </div>
          </div>
          
          <table class="items">
            <thead>
              <tr>
                <th width="5%">#</th>
                <th width="50%">Item Description</th>
                <th width="10%">Qty</th>
                <th width="15%">Unit Price</th>
                <th width="20%">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="totals-container">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div class="totals-row">
                <span>Shipping:</span>
                <span>₹${shipping.toLocaleString("en-IN")}</span>
              </div>
              <div class="totals-row">
                <span>Estimated Tax (3%):</span>
                <span>₹${tax.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              <div class="totals-row grand-total">
                <span>Total Amount:</span>
                <span>₹${(order.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>
              
              ${
                totalSavings > 0
                  ? `
                <div class="savings">
                  You saved ₹${totalSavings.toLocaleString("en-IN")} on this order!
                </div>
              `
                  : ""
              }
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated document. No signature is required.</p>
            <p>Thank you for shopping with Airconic Tourister!</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          My Orders
        </h1>
        <p className="text-muted-foreground text-lg">
          View your order history, track shipments, and download receipts.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground animate-pulse">
            Loading your orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border border-border/50 shadow-sm bg-muted/10">
          <Package
            className="h-20 w-20 text-muted-foreground/30 mb-6"
            strokeWidth={1.5}
          />
          <h2 className="text-2xl font-bold mb-2">No orders found</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven't placed any orders with us yet. When you do, they will
            appear here.
          </p>
          <Button asChild size="lg" className="font-bold tracking-wide">
            <Link to="/">Start Shopping</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="overflow-hidden shadow-sm border-border/50 transition-all hover:shadow-md animate-in slide-in-from-bottom-4 duration-500"
            >
              <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">
                      Order{" "}
                      <span className="text-muted-foreground font-mono">
                        #{order._id.substring(0, 8).toUpperCase()}
                      </span>
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="text-left sm:text-right flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
                      Total Amount
                    </p>
                    <p className="font-semibold text-lg tracking-wide text-primary">
                      ₹ {(order.totalAmount || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="gap-2 shrink-0 font-semibold shadow-sm"
                      asChild
                    >
                      <Link to={`/track-order?id=${order._id}`}>
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">Track</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 shrink-0 bg-background shadow-sm"
                      onClick={() => handleDownloadReceipt(order)}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Receipt</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 shrink-0 bg-background shadow-sm"
                      onClick={() => handlePrintBill(order)}
                    >
                      <Printer className="h-4 w-4" />
                      <span className="hidden sm:inline">Print</span>
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex gap-6 p-6 items-center">
                      <div className="h-24 w-24 bg-muted/20 rounded-xl border border-border/50 flex items-center justify-center p-2 shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground/30" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1 mb-1"
                        >
                          {item.title}
                        </Link>

                        {item.pricemrp && item.discount ? (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-foreground">
                              ₹{(item.price || 0).toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              ₹{item.pricemrp.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {item.discount}% OFF
                            </span>
                          </div>
                        ) : (
                          <p className="font-bold text-foreground mb-2">
                            ₹{(item.price || 0).toLocaleString("en-IN")}
                          </p>
                        )}

                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        className="hidden sm:flex"
                        asChild
                      >
                        <Link to={`/product/${item.product}`}>Buy Again</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
