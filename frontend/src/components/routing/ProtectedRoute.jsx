import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute - User:", user);
  console.log("ProtectedRoute - Loading:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("Redirecting to login because user is null");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
