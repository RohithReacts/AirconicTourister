import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Link } from "react-router";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ProductCard } from "@/components/ShopProducts";
import { Loader2, ChevronRight, ChevronDown } from "lucide-react";
import bannerImage from "@/assets/banner3.webp"; // Generic banner image
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export default function Duffles() {
  useDocumentTitle("Duffles");
  const [products, setProducts] = useState([]);
  const [allFetchedProducts, setAllFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("duffles");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        const allProducts = response.data.Products || [];
        setAllFetchedProducts(allProducts);
        const dufflesProducts = allProducts.filter((p) => {
          const cat = p.category?.toLowerCase() || "";
          return cat === "duffles" || cat === "duffels" || cat === "duffle";
        });
        setProducts(dufflesProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const currentProductsList =
    viewMode === "all" ? allFetchedProducts : products;

  const uniqueSizes = [
    ...new Set(
      currentProductsList
        .map((p) => p.size?.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
  const uniqueColors = [
    ...new Set(
      currentProductsList
        .map((p) => p.color?.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];

  const filteredProducts = currentProductsList.filter((p) => {
    const sizeMatch =
      selectedSizes.length === 0 ||
      selectedSizes.includes(p.size?.trim().toLowerCase());
    const colorMatch =
      selectedColors.length === 0 ||
      selectedColors.includes(p.color?.trim().toLowerCase());
    return sizeMatch && colorMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return (a.salePrice || 0) - (b.salePrice || 0);
    if (sortBy === "price-desc") return (b.salePrice || 0) - (a.salePrice || 0);
    return 0;
  });

  const handleSizeChange = (size, isChecked) => {
    if (isChecked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    }
  };

  const handleColorChange = (color, isChecked) => {
    if (isChecked) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    }
  };

  return (
    <div className="animate-in fade-in duration-500 w-full mb-12">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[30vh] lg:h-[20vh] min-h-[250px] md:h-[400px] mb-12">
        <img
          src={bannerImage}
          alt="Duffles Collection"
          className="w-full h-full object-cover brightness-[0.5]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-100">
            <p className="text-sm font-bold tracking-[0.2em] text-white/90 uppercase mb-3 drop-shadow-md">
              COLLECTION
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-xl">
              {viewMode === "all" ? "All Products" : "Duffles"}
            </h1>
            <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Explore our exclusive collection of high-quality duffle bags
              designed for versatility and style.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2 mt-2">
          <Link
            to="/"
            className="hover:text-foreground transition-colors font-medium"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          <Link
            to="/collection"
            className="hover:text-foreground transition-colors cursor-pointer font-medium capitalize"
          >
            Collection
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          <span className="text-foreground font-semibold">Duffles</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8 items-start pb-12">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <div className="bg-card border border-border/60 rounded-xl p-4 shadow-sm md:sticky top-24">
              <h2 className="font-bold text-lg mb-4">Filters</h2>
              {/* Size Filter */}
              <div className="w-full border-t border-border/60 pt-4 mb-4">
                <h3 className="font-semibold text-foreground mb-3">Size</h3>
                <div className="flex flex-col gap-4 py-2 px-1 pb-2">
                  {uniqueSizes.length > 0 ? (
                    uniqueSizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center space-x-3 py-1"
                      >
                        <Checkbox
                          id={`size-${size}`}
                          checked={selectedSizes.includes(size)}
                          onCheckedChange={(checked) =>
                            handleSizeChange(size, checked)
                          }
                        />
                        <label
                          htmlFor={`size-${size}`}
                          className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {size}
                        </label>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No sizes available
                    </span>
                  )}
                </div>
              </div>

              {/* Color Filter */}
              <div className="w-full border-t border-border/60 pt-4 pb-2">
                <h3 className="font-semibold text-foreground mb-3">Color</h3>
                <div className="flex flex-col gap-4 py-2 px-1 pb-2">
                  {uniqueColors.length > 0 ? (
                    uniqueColors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center space-x-3 py-1"
                      >
                        <Checkbox
                          id={`color-${color}`}
                          checked={selectedColors.includes(color)}
                          onCheckedChange={(checked) =>
                            handleColorChange(color, checked)
                          }
                        />
                        <label
                          htmlFor={`color-${color}`}
                          className="text-sm font-medium leading-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors capitalize"
                        >
                          {color}
                        </label>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No colors available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Sort Controls */}
            {!loading && filteredProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 animate-in fade-in duration-700">
                <p className="text-muted-foreground font-medium text-sm">
                  Showing {filteredProducts.length} products
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Sort By:
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between border border-border bg-card text-foreground text-sm font-semibold rounded-lg px-4 py-2 hover:bg-muted/50 transition-colors shadow-sm min-w-[190px] outline-none focus:ring-2 focus:ring-primary/40">
                      <span>
                        {viewMode === "all" &&
                          sortBy === "default" &&
                          "All Products"}
                        {viewMode === "duffles" &&
                          sortBy === "default" &&
                          "Featured"}
                        {sortBy === "price-asc" && "Price: Low to High"}
                        {sortBy === "price-desc" && "Price: High to Low"}
                      </span>
                      <ChevronDown className="ml-2 w-4 h-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-[190px] rounded-xl shadow-xl mt-2 border-border/60"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setViewMode("all");
                          setSortBy("default");
                          setSelectedSizes([]);
                          setSelectedColors([]);
                        }}
                        className={`cursor-pointer  ${viewMode === "all" && sortBy === "default" ? "bg-primary/10 text-primary font-bold" : "font-medium"}`}
                      >
                        All Products
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setViewMode("duffles");
                          setSortBy("default");
                        }}
                        className={`cursor-pointer ${viewMode === "duffles" && sortBy === "default" ? "bg-primary/10 text-primary font-bold" : "font-medium"}`}
                      >
                        Featured
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("price-asc")}
                        className={`cursor-pointer ${sortBy === "price-asc" ? "bg-primary/10 text-primary font-bold" : "font-medium"}`}
                      >
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSortBy("price-desc")}
                        className={`cursor-pointer ${sortBy === "price-desc" ? "bg-primary/10 text-primary font-bold" : "font-medium"}`}
                      >
                        Price: High to Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-32 min-h-[40vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    title={product.title}
                    badge={
                      product.discount > 0 ? `Save ${product.discount}%` : null
                    }
                    icon={true}
                    image={product.image || "https://placehold.co/400x400"}
                    price={product.salePrice}
                    mrp={product.pricemrp}
                    color={product.color}
                    className="w-full sm:w-full md:w-full min-w-fit md:min-w-0"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-border/50 animate-in zoom-in-95 duration-700">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No Duffles Found
                </h3>
                <p className="text-muted-foreground">
                  We couldn't find any duffle bags in this category right now.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
