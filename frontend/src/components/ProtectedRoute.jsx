import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, allowViewer = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowViewer && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
