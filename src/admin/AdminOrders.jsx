import React, { useState, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MoreHorizontal,
  Search,
  Eye,
  Download,
  Package,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import api from "../api/axios";

export default function AdminOrders() {
  useDocumentTitle("Admin Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = `${order.customerDetails?.firstName || ""} ${
      order.customerDetails?.lastName || ""
    }`;
    return (
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Processing":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
          >
            Processing
          </Badge>
        );
      case "Shipped":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
          >
            Shipped
          </Badge>
        );
      case "Delivered":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
          >
            Delivered
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      setOrders(
        orders.map((o) => (o._id === id ? { ...o, status: newStatus } : o)),
      );
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
      )
    ) {
      try {
        await api.delete(`/orders/${id}`);
        setOrders(orders.filter((o) => o._id !== id));
        toast.success("Order deleted successfully");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order");
      }
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track customer orders across your store.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border/50">
          <CardTitle className="text-lg font-semibold">All Orders</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or customer..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold px-6">Order ID</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right px-6 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="group cursor-pointer hover:bg-muted/30"
                  >
                    <TableCell className="font-medium px-6">
                      {order._id.substring(0, 10)}...
                    </TableCell>
                    <TableCell>
                      {order.customerDetails?.firstName}{" "}
                      {order.customerDetails?.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 border-border shadow-xl rounded-xl"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer gap-2"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />{" "}
                            View Details
                          </DropdownMenuItem>

                          <div className="border-t border-border/60 my-1"></div>

                          <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Update Status
                          </div>
                          <DropdownMenuItem
                            className="cursor-pointer font-medium text-xs"
                            onClick={() =>
                              updateOrderStatus(order._id, "Processing")
                            }
                          >
                            Mark Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer font-medium text-xs"
                            onClick={() =>
                              updateOrderStatus(order._id, "Shipped")
                            }
                          >
                            Mark Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer font-medium text-xs"
                            onClick={() =>
                              updateOrderStatus(order._id, "Delivered")
                            }
                          >
                            Mark Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer font-medium text-xs text-red-500 focus:text-red-500"
                            onClick={() =>
                              updateOrderStatus(order._id, "Cancelled")
                            }
                          >
                            Mark Cancelled
                          </DropdownMenuItem>

                          <div className="border-t border-border/60 my-1"></div>

                          <DropdownMenuItem
                            className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No orders found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border shadow-2xl">
          <DialogHeader className="border-b border-border/50 pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              Order Details
              {selectedOrder && getStatusBadge(selectedOrder.status)}
            </DialogTitle>
            <DialogDescription>
              Viewing complete information for {selectedOrder?._id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 p-4 bg-muted/30 rounded-xl border border-border/50">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Customer
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedOrder.customerDetails?.firstName}{" "}
                    {selectedOrder.customerDetails?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedOrder.customerDetails?.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Order Date
                  </p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Total Amount
                  </p>
                  <p className="font-bold text-primary text-xl">
                    ₹{selectedOrder.totalAmount?.toLocaleString("en-IN") || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                    Total Items
                  </p>
                  <p className="font-medium text-foreground">
                    {selectedOrder.orderItems?.length || 0} Item(s)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted/10 rounded-xl border border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Shipping Address
                </p>
                <p className="text-sm">
                  {selectedOrder.customerDetails?.address},{" "}
                  {selectedOrder.customerDetails?.city},{" "}
                  {selectedOrder.customerDetails?.state} -{" "}
                  {selectedOrder.customerDetails?.zipCode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Purchased Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 border border-border/60 rounded-lg bg-background"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center shrink-0 p-1">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground/50" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          {item.pricemrp && item.discount ? (
                            <p className="text-[10px] text-green-600 font-medium mt-0.5 tracking-wide">
                              MRP: ₹{item.pricemrp.toLocaleString("en-IN")} |
                              SAVE {item.discount}%
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <p className="font-medium text-sm">
                        ₹
                        {(
                          (item.price || 0) * (item.quantity || 1)
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/50 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleDownloadReceipt(selectedOrder)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" /> Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
