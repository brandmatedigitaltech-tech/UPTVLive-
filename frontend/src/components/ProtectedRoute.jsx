import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ ONLY CHECK TOKEN (NOT ROLE)
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ ALLOW BOTH ADMIN + WRITER
  return children;
};

export default ProtectedRoute;