import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  matchPath,
} from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Home from "./pages/Home";
import Luggage from "./pages/Luggage";
import Backpacks from "./pages/Backpacks";
import Collection from "./pages/Collection";
import Duffles from "./pages/Duffles";
import Accessories from "./pages/Accessories";
import Office from "./pages/Office";
import Kids from "./pages/Kids";
import SoftLuggage from "./pages/SoftLuggage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Checkout from "./pages/Checkout";
import ProductList from "./admin/ProductList";
import EditProduct from "./admin/EditProduct";
import AddProduct from "./admin/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import TrackOrder from "./pages/TrackOrder";
import ShippingAndReturns from "./pages/ShippingAndReturns";
import FAQs from "./pages/FAQs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AccountSettings from "./admin/AccountSettings";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminOrders from "./admin/AdminOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

function GlobalLayout() {
  const location = useLocation();

  // Specific routes where you want to hide the navbar
  const excludedRoutes = [
    "/signin",
    "/signup",
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
      <main className="flex-1">
        <Outlet />
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
        path: "/checkout",
        element: <Checkout />,
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
