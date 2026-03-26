import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axios";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Package,
  DollarSign,
  List,
  Image as ImageIcon,
  Settings2,
} from "lucide-react";
import { Link } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function AddProduct() {
  useDocumentTitle("Add Product");
  const [form, setForm] = useState({
    title: "",
    description: "",
    pricemrp: "",
    image: "",
    category: "",
    size: "",
    color: "",
    stock: "",
    salePrice: "",
    discount: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        pricemrp: Number(form.pricemrp) || 0,
        salePrice: Number(form.salePrice) || 0,
        discount: Number(form.discount) || 0,
        stock: Number(form.stock) || 0,
      };
      await api.post("/products/create", payload);
      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8">
          <Link
            to="/admin/products"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Products
          </Link>
          <div className="flex flex-col justify-center items-center sm:flex-row sm:items-center sm:justify-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Add New Product
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create a new listing in your store catalog.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Information */}

            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Premium Leather Backpack"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product in detail..."
                  className="min-h-[150px] resize-none"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </CardContent>

            {/* Pricing & Stock */}

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="pricemrp">MRP Price (₹)</Label>
                  <Input
                    id="pricemrp"
                    name="pricemrp"
                    type="number"
                    placeholder="0.00"
                    value={form.pricemrp}
                    onChange={handleChange}
                    required
                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input
                    id="salePrice"
                    name="salePrice"
                    type="number"
                    placeholder="0.00"
                    value={form.salePrice}
                    onChange={handleChange}
                    required
                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    placeholder="0"
                    value={form.discount}
                    onChange={handleChange}
                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Available Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </CardContent>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            {/* Organizations */}

            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g. Backpacks"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>

            {/* Media */}

            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>

            {/* Specifications */}

            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  name="size"
                  placeholder="e.g. Large / 15-inch"
                  value={form.size}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="e.g. Midnight Black"
                  value={form.color}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </div>
          <div className="flex gap-3 justify-end items-end-safe lg:col-span-3">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/products")}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button className="cursor-pointer" type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
