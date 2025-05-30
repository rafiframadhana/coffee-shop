import { useState, createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [localQuantity, setLocalQuantity] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      return parsedCart.reduce((total, item) => total + item.quantity, 0);
    }
    return 0;
  });
  const [alert, setAlert] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();

      setCart(data.items || []);
      setTotalPrice(data.totalPrice || 0);
    } catch (err) {
      console.error("Error loading cart:", err);
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity) => {
    if (!user) {
      setAlert(
        "Please log in to add products to your cart. Redirecting to login page..."
      );
      setTimeout(() => setAlert(""), 4500);
      setTimeout(() => navigate("/auth/login"), 5000);
      return;
    }

    if (!product._id) {
      console.error("Invalid product: missing _id");
      setAlert("Cannot add item to cart: product ID missing");
      return;
    }

    try {
      setLocalQuantity((prev) => prev + quantity);
      const updatedCart = [...cart];
      const existingItemIndex = updatedCart.findIndex(
        (item) => (item.productId._id || item.productId) === product._id
      );

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart.push({
          productId: product._id,
          quantity,
        });
      }

      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: updatedCart }),
      });

      if (!response.ok) {
        setLocalQuantity((prev) => prev - quantity);
        throw new Error("Failed to update cart");
      }

      await fetchCart();
      const data = await response.json();

      setCart(
        data.items.map((item) => ({
          productId: item.productId._id || item.productId,
          quantity: item.quantity,
        }))
      );
      setTotalPrice(data.totalPrice);
    } catch (err) {
      console.error("Failed to sync cart:", err);
      setAlert("Failed to update cart. Please try again.");
    }
  };

  const deleteItem = async (id) => {
    const itemToDelete = cart.find(
      (item) => (item.productId._id || item.productId) === id
    );
    if (itemToDelete) {
      setLocalQuantity((prev) => prev - itemToDelete.quantity);
    }
    const updatedCart = cart.filter(
      (item) => (item.productId._id || item.productId) !== id
    );
    setCart(updatedCart);

    try {
      const response = await fetch(`${API_URL}/api/cart/item/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        setLocalQuantity((prev) => prev + (itemToDelete?.quantity || 0));
        throw new Error("Failed to delete item");
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const item = cart.find((item) => item.productId._id === productId);
    const oldQuantity = item?.quantity || 0;
    setLocalQuantity((prev) => prev - oldQuantity + newQuantity);

    const updatedCart = cart.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCart(updatedCart);

    try {
      const response = await fetch(`${API_URL}/api/cart/item/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        setLocalQuantity((prev) => prev - newQuantity + oldQuantity);
        throw new Error("Failed to update quantity");
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const clearCart = async () => {
    setLocalQuantity(0);
    setCart([]);

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        deleteItem,
        updateQuantity,
        clearCart,
        totalPrice,
        alert,
        loading,
        error,
        fetchCart,
        localQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
