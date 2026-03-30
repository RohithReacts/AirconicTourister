import { useState, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, Trash2, CheckCircle2 } from "lucide-react";
import api from "../api/axios";

export default function Checkout() {
  useDocumentTitle("Checkout");
  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/user/address");
      setSavedAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0]._id);
        // Populate form with first saved address by default
        setFormData((prev) => ({
          ...prev,
          firstName: data[0].firstName,
          lastName: data[0].lastName,
          address: data[0].address,
          city: data[0].city,
          state: data[0].state,
          zipCode: data[0].zipCode,
        }));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (cart.length === 0) {
        toast.error("Your cart is empty.");
        navigate("/");
      } else {
        setCartItems(cart);
      }

      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        let firstName = "";
        let lastName = "";
        if (user.name) {
          const nameParts = user.name.trim().split(" ");
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(" ") || "";
        }
        setFormData((prev) => ({
          ...prev,
          firstName: firstName || prev.firstName,
          lastName: lastName || prev.lastName,
          email: user.email || prev.email,
        }));
        fetchAddresses();
      }
    } catch (e) {
      console.error(e);
      navigate("/");
    }
  }, [navigate]);

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr._id);
    setFormData((prev) => ({
      ...prev,
      firstName: addr.firstName,
      lastName: addr.lastName,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
    }));
    setShowAddressForm(false);
  };

  const handleDeleteAddress = async (e, addressId) => {
    e.stopPropagation();
    try {
      await api.delete(`/user/address/${addressId}`);
      setSavedAddresses((prev) =>
        prev.filter((addr) => addr._id !== addressId),
      );
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleSaveAddress = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      toast.error("Please fill in all address fields");
      return;
    }

    setIsSavingAddress(true);
    try {
      const { data } = await api.post("/user/address", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        label: "Saved Address",
      });
      setSavedAddresses(data);
      const newAddr = data[data.length - 1];
      setSelectedAddressId(newAddr._id);
      setShowAddressForm(false);
      toast.success("Address saved successfully");
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + (item.salePrice || 0) * (item.quantity || 1),
      0,
    );
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.03; // 3% tax
  const shipping = 150; // Flat ₹150 shipping
  const total = subtotal + tax + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        customerDetails: formData,
        orderItems: cartItems.map((item) => ({
          product: item._id, // Assume product has _id
          title: item.title,
          image: item.image,
          price: item.salePrice || item.price || 0,
          pricemrp: item.pricemrp || item.price || 0,
          discount: item.discount || 0,
          quantity: item.quantity || 1,
        })),
        totalAmount: total,
      };

      await api.post("/orders", orderData);

      toast.success(
        "Order placed successfully! Thank you for shopping with us.",
      );
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart_update"));
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <Card className="shadow-sm border-muted">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Shipping Details</CardTitle>
                {savedAddresses.length > 0 && !showAddressForm && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Saved Addresses Cards */}
                {savedAddresses.length > 0 && !showAddressForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => handleAddressSelect(addr)}
                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                          selectedAddressId === addr._id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-muted bg-white hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm">
                              {addr.label || "Address"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedAddressId === addr._id && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAddress(e, addr._id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <p className="font-semibold text-foreground">
                            {addr.firstName} {addr.lastName}
                          </p>
                          <p className="line-clamp-1">{addr.address}</p>
                          <p>
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shipping Form */}
                {(savedAddresses.length === 0 || showAddressForm) && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="zipCode">Pin Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        onClick={handleSaveAddress}
                        disabled={isSavingAddress}
                        className="flex-1 font-bold"
                      >
                        {isSavingAddress ? "Saving..." : "Save this Address"}
                      </Button>
                      {savedAddresses.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowAddressForm(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-bottom-6 duration-1000">
          <Card className="shadow-sm border-muted lg:sticky lg:top-28 bg-muted/10">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-lg shrink-0 border border-border/50 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm line-clamp-2 pr-2 leading-tight">
                          {item.title}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-auto">
                        <span className="text-muted-foreground font-medium">
                          Qty: {item.quantity || 1}
                        </span>
                        <span className="font-bold text-foreground">
                          ₹{" "}
                          {(
                            (item.salePrice || 0) * (item.quantity || 1)
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-5 border-t border-border/50 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    ₹ {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">
                    ₹ {shipping.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Estimated Tax (3%)
                  </span>
                  <span className="font-semibold">
                    ₹ {tax.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="my-4 border-t border-border/60"></div>
                <div className="flex justify-between items-center text-xl font-extrabold pb-2">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹ {total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <Button
                form="checkout-form"
                type="submit"
                size="lg"
                className="w-full mt-6 py-6 text-base font-bold shadow-md hover:scale-[1.02] transition-transform"
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
