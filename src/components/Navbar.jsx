import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cartBlack from "./../assets/cart-black.png";
import cartWhite from "./../assets/cart-white.png";
import { useCart } from "../context/CartContext";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { cart } = useCart();

  const [itemQuantity, setItemQuantity] = useState(() => {
    return JSON.parse(localStorage.getItem("cartItemCount")) || 0;
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cartQuantityArr = cart.map((item) => item.quantity);
    const newQuantity = cartQuantityArr.reduce((a, b) => a + b, 0);

    setItemQuantity(newQuantity);
    localStorage.setItem("cartItemCount", JSON.stringify(newQuantity));
  }, [cart]);

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
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
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
          }`}
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
        </ul>

        <div className="cart">
          <Link to="/checkout">
            <img
              className="cart-img"
              src={isHome ? cartWhite : cartBlack}
              alt="cart"
            />
            {itemQuantity > 0 && (
              <span className={`cart-span ${isHome ? "home" : "not-home"}`}>
                {itemQuantity}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
