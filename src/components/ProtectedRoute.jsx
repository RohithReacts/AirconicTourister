import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!token) {
    // Redirect to signin if no token is found
    return <Navigate to="/signin" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    // Redirect to home if adminOnly is true but user is not an admin
    return <Navigate to="/" replace />;
  }

  // Render the protected content (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
