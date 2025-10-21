import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./../../styles/admin.css";
import Sidebar from "./Sidebar";
import AddProduct from "./AddProduct";
import ViewProducts from "./ViewProducts";
import EditProduct from "./EditProduct";
import { useAuth } from "../../hooks/useAuthContext";
import { useEffect } from "react";
import UserManagement from "./UserManagement";

function Admin() {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/*");
      return;
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  return (
    <>
      <Sidebar />

      {location.pathname === "/admin" && (
        <div className="welcome-admin">
          <h1>{`Welcome, ${user.displayName}!`}</h1>
          <Link to="/">Back to main page...</Link>
        </div>
      )}

      <Routes>
        <Route path="add-product" element={<AddProduct />} />
        <Route path="view-products" element={<ViewProducts />} />
        <Route path="edit-product" element={<EditProduct />} />
        <Route path="user-management" element={<UserManagement />} />
      </Routes>
    </>
  );
}

export default Admin;
