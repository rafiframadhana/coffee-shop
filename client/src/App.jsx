import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import About from "./pages/about/About.jsx";
import Products from "./pages/products/Products.jsx";
import ProductDetails from "./pages/product-details/ProductDetails.jsx";
import Contact from "./pages/contact/Contact.jsx";
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx";
import AutoScrollTop from "./components/AutoScrollTop.jsx";
import NotFound from "./pages/extra/NotFound.jsx";
import Admin from "./pages/admin/Admin.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import Authentication from "./pages/authentication/Authentication.jsx";
import RegistrationForm from "./pages/authentication/RegistrationForm.jsx";
import LoginForm from "./pages/authentication/LoginForm.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import UserProfile from "./pages/profile/UserProfile.jsx";

function App() {
  const location = useLocation();
  const [isAdminPage, setIsAdminPage] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsAdminPage(location.pathname.startsWith("/admin"));
  }, [location.pathname]);

  return (
    <>
      <AutoScrollTop />
      {!isAdminPage && (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/contact" element={<Contact />} />
            {user && (
              <>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/profile" element={<UserProfile />} />
              </>
            )}
            {!user && (
              <Route path="/auth" element={<Authentication />}>
                <Route path="register" element={<RegistrationForm />} />
                <Route path="login" element={<LoginForm />} />
              </Route>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </>
      )}

      {isAdminPage && (
        <>
          <Routes>
            <Route path="/admin/*" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;
