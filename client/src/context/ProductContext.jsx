import { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext();

// eslint-disable-next-line react/prop-types
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/coffee`, {
          credentials: "include",
        });
        const response = await res.json();
        // Handle new standardized response format { success, message, data }
        setProducts(response.data || response);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]); // Added API_URL to deps

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductsContext);
