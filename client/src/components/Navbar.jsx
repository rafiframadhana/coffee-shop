import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cartBlack from "./../assets/cart-black.png";
import cartWhite from "./../assets/cart-white.png";
import { useCart } from "../context/CartContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AuthMenu from "../pages/authentication/AuthMenu";
import { useAuth } from "../context/AuthContext";
import Tooltip from "@mui/material/Tooltip";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1224);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const itemQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header>
      <nav className={`navbar ${isHome ? "transparent" : "solid"}`}>
        <Link
          to="/"
          className="brand-name"
          style={{ color: isHome ? "#ffffff" : "black" }}
        >
          Coffee Culture
        </Link>

        {/* Hamburger */}
        <div className={`hamburger ${user && "logged-in"}`} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <CloseIcon
              sx={{ color: isHome ? "white" : "black" }}
              fontSize="large"
            />
          ) : (
            <MenuIcon
              sx={{ color: isHome ? "white" : "black" }}
              fontSize="large"
            />
          )}
        </div>

        <ul
          className={`nav-menu ${menuOpen ? "active" : ""} ${
            isHome ? "home" : "not-home"
          } ${user ? "logged-in" : "not-logged-in"}`}
        >
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About Us
            </Link>
          </li>
          <li>
            {isHome ? (
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            ) : (
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            )}
          </li>
          {isHome && (
            <li>
              <a href="#menu" onClick={() => setMenuOpen(false)}>
                Menu
              </a>
            </li>
          )}
          {isMobile && (
            <div className="auth-menu-navbar">
              <AuthMenu user={user} onLogout={logout} />
            </div>
          )}
        </ul>

        <div className="right-nav">
          {user && (
            <div className="cart">
              <Tooltip title="Cart" arrow>
                <Link to="/checkout">
                  <img
                    className="cart-img"
                    src={isHome ? cartWhite : cartBlack}
                    alt="cart"
                  />
                  {itemQuantity > 0 && (
                    <span
                      className={`cart-span ${isHome ? "home" : "not-home"}`}
                    >
                      {itemQuantity}
                    </span>
                  )}
                </Link>
              </Tooltip>
            </div>
          )}

          {!isMobile && (
            <div className="auth-menu-navbar">
              <AuthMenu user={user} onLogout={logout} />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
