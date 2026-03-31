import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  matchPath,
} from "react-router";
import React, { Suspense, lazy, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

const Home = lazy(() => import("./pages/Home"));
const Luggage = lazy(() => import("./pages/Luggage"));
const Backpacks = lazy(() => import("./pages/Backpacks"));
const Collection = lazy(() => import("./pages/Collection"));
const Duffles = lazy(() => import("./pages/Duffles"));
const Accessories = lazy(() => import("./pages/Accessories"));
const Office = lazy(() => import("./pages/Office"));
const Kids = lazy(() => import("./pages/Kids"));
const SoftLuggage = lazy(() => import("./pages/SoftLuggage"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductList = lazy(() => import("./admin/ProductList"));
const EditProduct = lazy(() => import("./admin/EditProduct"));
const AddProduct = lazy(() => import("./admin/AddProduct"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const ShippingAndReturns = lazy(() => import("./pages/ShippingAndReturns"));
const FAQs = lazy(() => import("./pages/FAQs"));
const AccountSettings = lazy(() => import("./admin/AccountSettings"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./admin/AdminOrders"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AdminLayout from "./admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingPage from "./components/LoadingPage";

function GlobalLayout() {
  const location = useLocation();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <LoadingPage />
      </div>
    );
  }

  // Specific routes where you want to hide the navbar
  const excludedRoutes = [
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password/:token",
    "/settings",
    "/admin/products/create",
    "/admin/products/edit/:id",
    "/admin/products/update/:id",
  ];

  const showNavbar = !excludedRoutes.some((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {showNavbar && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<LoadingPage />}>
          <Outlet />
        </Suspense>
      </main>
      {showNavbar && <Footer />}
      <Toaster />
    </div>
  );
}

function RootLayout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/luggage",
        element: <Luggage />,
      },
      {
        path: "/backpacks",
        element: <Backpacks />,
      },
      {
        path: "/collection",
        element: <Collection />,
      },
      {
        path: "/duffles",
        element: <Duffles />,
      },
      {
        path: "/accessories",
        element: <Accessories />,
      },
      {
        path: "/office",
        element: <Office />,
      },
      {
        path: "/kids",
        element: <Kids />,
      },
      {
        path: "/soft-luggage",
        element: <SoftLuggage />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/track-order",
        element: <TrackOrder />,
      },
      {
        path: "/shipping-and-returns",
        element: <ShippingAndReturns />,
      },
      {
        path: "/faqs",
        element: <FAQs />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        element: <ProtectedRoute />, // General auth guard
        children: [
          {
            path: "/settings",
            element: <AccountSettings />,
          },
          {
            path: "/my-orders",
            element: <MyOrders />,
          },
          {
            path: "/checkout",
            element: <Checkout />,
          },
        ],
      },
      {
        element: <ProtectedRoute adminOnly={true} />, // Admin-only guard
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: "orders",
                element: <AdminOrders />,
              },
              {
                path: "products",
                element: <ProductList />,
              },
              {
                path: "products/create",
                element: <AddProduct />,
              },
              {
                path: "products/edit/:id",
                element: <EditProduct />,
              },
              {
                path: "products/update/:id",
                element: <EditProduct />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
