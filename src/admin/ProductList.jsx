import { useEffect, useState, useRef } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axios";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Upload } from "lucide-react";
import Papa from "papaparse";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProductList() {
  useDocumentTitle("Product Inventory");
  const [products, setProducts] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Search & Pagination & Import states
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Derived state for filtering and pagination
  const filteredProducts = products.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      // Backend returns { message, Products }
      setProducts(response.data.Products || []);
      setSelectedIds([]); // clear selection when refetching
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/delete/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { data } = results;
        try {
          // Add them one by one
          toast.success(`Starting import for ${data.length} products...`);
          for (const item of data) {
            const payload = {
              title: item.title || "Imported Product",
              description: item.description || "Imported Description",
              pricemrp: Number(item.pricemrp) || 0,
              salePrice: Number(item.salePrice) || 0,
              discount: Number(item.discount) || 0,
              stock: Number(item.stock) || 0,
              category: item.category || "Uncategorized",
              image: item.image || "https://placehold.co/400x400",
              size: item.size || "",
              color: item.color || "",
            };
            await api.post("/products/create", payload);
          }
          toast.success(`Successfully imported ${data.length} products`);
          fetchProducts();
        } catch (error) {
          console.error("Import error:", error);
          toast.error("An error occurred during import");
        } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      },
      error: () => {
        toast.error("Failed to parse CSV file");
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(paginatedProducts.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const bulkDeleteProducts = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.all(
        selectedIds.map((id) => api.delete(`/products/delete/${id}`)),
      );
      toast.success(`Successfully deleted ${selectedIds.length} products`);
      fetchProducts();
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete some products");
      fetchProducts();
    } finally {
      setIsBulkDeleting(false);
      setIsBulkDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your store inventory and details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                className="flex items-center gap-2 cursor-pointer w-full sm:w-auto"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">
                  Delete ({selectedIds.length})
                </span>
                <span className="sm:hidden">{selectedIds.length}</span>
              </Button>
            )}

            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImport}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
            >
              <Upload size={18} />
              <span>{isImporting ? "Importing..." : "Import CSV"}</span>
            </Button>

            <Link to="/admin/products/create" className="w-full sm:w-auto">
              <Button className="flex items-center gap-2 rounded-lg cursor-pointer w-full">
                <Plus size={18} />
                <span className="hidden sm:inline">New Product</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-12 pl-4">
                  <Checkbox
                    checked={
                      selectedIds.length > 0 &&
                      paginatedProducts.length > 0 &&
                      paginatedProducts.every((p) =>
                        selectedIds.includes(p._id),
                      )
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Product
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  MRP
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Discount
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Price
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Stock
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-20 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Check your search term or add more products."
                          : "Start by adding your first product to the catalog."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    className="hover:bg-muted/30 border-border transition-colors"
                  >
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={selectedIds.includes(product._id)}
                        onCheckedChange={(checked) =>
                          handleSelect(product._id, checked)
                        }
                        aria-label={`Select ${product.title}`}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-12 w-12 object-cover rounded-lg border border-border bg-muted shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground line-clamp-1">
                            {product.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.size} • {product.color}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground uppercase text-xs font-bold tracking-wider">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-muted-foreground line-through decoration-muted-foreground/50">
                      ₹{Number(product.pricemrp).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold">
                        {product.discount} % OFF
                      </span>
                    </TableCell>
                    <TableCell className="font-bold tracking-wider text-foreground">
                      ₹{Number(product.salePrice).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded text-sm font-semibold",
                          product.stock > 10
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-600"
                            : product.stock > 0
                              ? "bg-gray-500/50 text-white dark:text-black"
                              : "bg-red-500/10 text-red-600 dark:text-red-600",
                        )}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      <div className="flex justify-end gap-1">
                        <Link to={`/admin/products/edit/${product._id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <Pencil size={18} />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => confirmDelete(product)}
                        >
                          <Trash2 size={18} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(idx + 1);
                  }}
                  isActive={currentPage === idx + 1}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product{" "}
              <span className="font-bold text-foreground">
                "{productToDelete?.title}"
              </span>{" "}
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProduct(productToDelete?._id)}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Products</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to permanently delete{" "}
              <span className="font-bold text-foreground">
                {selectedIds.length}
              </span>{" "}
              products from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={bulkDeleteProducts}
              disabled={isBulkDeleting}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              {isBulkDeleting ? "Deleting..." : "Delete Selected"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
