import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  // const { user } = useAuth();
  const { auth } = useAuth();
  return auth?.token ? <Outlet /> : <Navigate to="/" />;
}
