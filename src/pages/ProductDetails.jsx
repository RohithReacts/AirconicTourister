import { useEffect, useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  ShoppingCart,
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useDocumentTitle(product?.title || "Product Details");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try to fetch all products and find the specific one
        // Handles case where /products/:id might not be implemented on backend
        const response = await api.get("/products");
        const allProducts = response.data.Products || [];
        const found = allProducts.find((p) => p._id === id);

        if (found) {
          setProduct(found);
        } else {
          toast.error("Product not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const addToCart = async () => {
    if (!product) return;
    setIsAdding(true);

    try {
      // Artificial delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get existing cart
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Check if product already in cart
      const existingProductIndex = existingCart.findIndex(
        (item) => item._id === product._id,
      );

      if (existingProductIndex >= 0) {
        existingCart[existingProductIndex].quantity =
          (existingCart[existingProductIndex].quantity || 1) + quantity;
      } else {
        existingCart.push({ ...product, quantity });
      }

      // Save cart
      localStorage.setItem("cart", JSON.stringify(existingCart));

      // Dispatch event so Navbar can update
      window.dispatchEvent(new Event("cart_update"));

      // Open cart panel instantly
      window.dispatchEvent(new Event("open_cart"));

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error(e);
      toast.error("Could not add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (product?.image) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 px-4 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = [
    product.image,
    product.image2,
    product.image3,
    product.image4,
    product.image5,
    product.image6,
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 mt-4 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button
          onClick={() => navigate("/")}
          className="hover:text-foreground transition-colors font-medium"
        >
          Home
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        <button
          onClick={() => navigate("/collection")}
          className="hover:text-foreground transition-colors font-medium"
        >
          Collection
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        {product.category && (
          <>
            <button
              onClick={() => {
                const category = product.category.toLowerCase();
                const route =
                  category === "hard-luggage"
                    ? "/luggage"
                    : category === "duffels" || category === "duffles"
                      ? "/duffles"
                      : `/${category}`;
                navigate(route);
              }}
              className="hover:text-foreground transition-colors cursor-pointer font-medium capitalize outline-none"
            >
              {product.category.replace("-", " ")}
            </button>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </>
        )}
        <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-[400px]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Image Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] p-8 md:p-12 border border-border/40 relative group overflow-hidden h-[400px] md:h-[500px]">
            <img
              src={activeImage || "https://placehold.co/600x600"}
              alt={product.title}
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          {/* Thumbnails Grid */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-2 bg-zinc-50 dark:bg-zinc-900/50 ${
                    activeImage === img
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border/40 hover:border-primary/50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} - ${index + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col pt-2 lg:pt-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
            {product.title}
          </h1>

          {/* Pricing Block */}
          <div className="flex flex-col gap-2 pb-8 border-b border-border/60 mb-8">
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-4xl font-semibold text-foreground tracking-tight">
                ₹ {Number(product.salePrice).toLocaleString("en-IN")}
              </span>
              {product.pricemrp > product.salePrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through decoration-muted-foreground/40 font-medium mb-1">
                    ₹ {Number(product.pricemrp).toLocaleString("en-IN")}
                  </span>
                  {product.discount > 0 && (
                    <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-extrabold px-2.5 py-1 rounded-md text-xs sm:text-sm border border-red-200 dark:border-red-800/50 mb-1.5 ml-1">
                      SAVE {product.discount}%
                    </span>
                  )}
                </>
              )}
            </div>
            <p className="text-sm text-gray-500 font-semibold tracking-wider mt-1">
              Price inclusive of all taxes
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10 bg-muted/30 p-6 rounded-2xl border border-border/40">
            {product.size && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Dimensions
                </span>
                <span className="font-semibold text-foreground">
                  {product.size}
                </span>
              </div>
            )}
            {product.color && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                  Color
                </span>
                <span className="font-semibold text-foreground capitalize">
                  {product.color}
                </span>
              </div>
            )}
            <div className="flex flex-col col-span-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                Warranty
              </span>
              <span className="font-semibold text-foreground">
                3 Years International Warranty
              </span>
            </div>
          </div>

          {/* Action Block */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-border/60 rounded-md px-1 h-10 bg-background w-full sm:w-[120px] shrink-0 transition-colors shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 hover:bg-muted rounded-md transition-colors text-foreground active:scale-95"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-6 text-center tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 hover:bg-muted rounded-md transition-colors text-foreground active:scale-95"
                disabled={product.stock <= quantity}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              className="font-extrabold rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-sm transition-all duration-300 w-full sm:w-[240px] h-12 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              disabled={product.stock <= 0 || isAdding}
              onClick={addToCart}
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="tracking-widest capitalize">ADDING...</span>
                </div>
              ) : (
                <span className="tracking-widest">
                  {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-8 justify-center items-center mt-5">
        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base md:text-lg lg:text-sm">
          {product.description || "No description available for this product."}
        </p>
      </div>
    </div>
  );
}
