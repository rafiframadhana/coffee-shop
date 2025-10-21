import { useState, createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// eslint-disable-next-line react/prop-types
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [alert, setAlert] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart , setAddingToCart ] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
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
      const response = await res.json();

      // Handle standardized response format { success, message, data }
      const data = response.data || response;
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
        "Please log in to add products to your cart."
      );
      return;
    }

    if (!product._id) {
      console.error("Invalid product: missing _id");
      return;
    }

    try {
      setAddingToCart(true);
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

      if (!response.ok) throw new Error("Failed to update cart");

      await fetchCart();
      const result = await response.json();

      // Handle standardized response format { success, message, data }
      const data = result.data || result;
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
    } finally{
      setAddingToCart(false);
    }
  };

  const deleteItem = async (id) => {
    const updatedCart = cart.filter(
      (item) => (item.productId._id || item.productId) !== id
    );
    setCart(updatedCart);

    try {
      await fetch(`${API_URL}/api/cart/item/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item.productId._id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCart(updatedCart);

    try {
      await fetch(`${API_URL}/api/cart/item/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const clearCart = async () => {
    setCart([]);

    try {
      await fetch(`${API_URL}/api/cart`, {
        method: "DELETE",
        credentials: "include",
      });
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
        addingToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  return useContext(CartContext);
};
