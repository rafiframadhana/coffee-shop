import ScrollToTop from "./../../components/ScrollToTop.jsx";
import "./../../styles/products.css";
import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import checkmark from "./../../assets/checkmark.png";
import { useProducts } from "../../hooks/useProducts";
import { useCart, useUpdateCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuthContext";
import TransitionsModal from "./../../components/TransitionsModal.jsx";
import { formatCurrency } from "../../utils/format";
import { MAX_ORDER_QUANTITY } from "../../config/constants";

export default function Product() {
  // React Query hooks for data fetching
  const { data: products = [], isLoading, error } = useProducts();
  const { data: cart } = useCart();
  const updateCart = useUpdateCart();

  // Auth state
  const { user } = useAuth();
  const navigate = useNavigate();

  // Local UI state
  const [quantities, setQuantities] = useState({});
  const [addedMessage, setAddedMessage] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  // Memoized callbacks for performance (BEFORE early returns)
  const handleSelectQuantity = useCallback((event, productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: parseInt(event.target.value),
    }));
  }, []);

  const addToCartMessage = useCallback((productId) => {
    setAddedMessage((prevMessage) => ({
      ...prevMessage,
      [productId]: "Added",
    }));

    setTimeout(() => {
      setAddedMessage((prevMessage) => ({
        ...prevMessage,
        [productId]: "",
      }));
    }, 1000);
  }, []);

  const showLoginModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleAddToCart = useCallback(async (product) => {
    // If not logged in, show login modal
    if (!user) {
      showLoginModal();
      return;
    }

    // Show success message immediately (optimistic UI)
    addToCartMessage(product._id);

    // Get quantity from state or default to 1
    const quantity = quantities[product._id] || 1;

    try {
      // Get current cart items
      const currentItems = cart?.items || [];

      // Check if product already exists in cart
      // Note: productId can be either an object (populated) or a string (ID only)
      const existingItemIndex = currentItems.findIndex(
        (item) => (item.productId?._id || item.productId) === product._id
      );

      // Always ensure we're sending clean data with ONLY productId and quantity
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity - rebuild the entire array with clean data
        updatedItems = currentItems.map((item, index) => ({
          productId: item.productId?._id || item.productId,
          quantity: index === existingItemIndex ? item.quantity + quantity : item.quantity
        }));
      } else {
        // Add new item to cart - ensure all items have clean data
        updatedItems = [
          ...currentItems.map(item => ({
            productId: item.productId?._id || item.productId,
            quantity: item.quantity
          })),
          {
            productId: product._id,
            quantity,
          },
        ];
      }

      // Update cart using React Query mutation with optimistic updates
      await updateCart.mutateAsync(updatedItems);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Error handling is done in the mutation itself
    }
  }, [user, quantities, cart, updateCart, showLoginModal, addToCartMessage]);

  // Memoize quantity options to avoid recreating on every render
  const quantityOptions = useMemo(() => {
    return Array.from({ length: Math.min(10, MAX_ORDER_QUANTITY) }, (_, i) => i + 1).map((num) => (
      <option key={num} value={num}>
        {num}
      </option>
    ));
  }, []);

  // Memoize product list to optimize rendering
  const listOfProduct = useMemo(() => {
    return products.map((product) => (
      <div className="products-item" key={product._id}>
        <Link to={`/product/${product._id}`} className="product-link">
          <img src={product.src} alt={product.item} />
          <h3>{product.item}</h3>
          <p>{product.contain}</p>
        </Link>
        <div className="flex-box">
          <p className="products-price">
            {formatCurrency(product.price)}
          </p>
          <select
            className="quantity-select"
            value={quantities[product._id] || 1}
            onChange={(e) => handleSelectQuantity(e, product._id)}
          >
            {quantityOptions}
          </select>
        </div>

        <div className="btn-message-container">
          <button
            className="products-btn"
            onClick={() => handleAddToCart(product)}
            disabled={updateCart.isLoading}
          >
            Add To Cart
          </button>

          {addedMessage[product._id] && (
            <div className="added-message">
              <img src={checkmark} alt="Added to cart" />
              <p>{addedMessage[product._id]}</p>
            </div>
          )}
        </div>
      </div>
    ));
  }, [products, quantities, addedMessage, updateCart.isLoading, handleSelectQuantity, handleAddToCart, quantityOptions]);

  // Handle loading state (AFTER all hooks)
  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="error-message">
        <div className="error-box">
          <span className="error-icon">⚠️</span> {error.message || "Failed to load products"}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show loading overlay during cart update */}
      {updateCart.isLoading && (
        <div className="loading-overlay">
          <div className="spinner-box">
            <div className="spinner"></div>
          </div>
        </div>
      )}

      <section className="products" id="products" style={{ marginTop: "40px" }}>
        <h2>Explore Our Coffee Brews</h2>
        <div className="products-grid">{listOfProduct}</div>
      </section>

      {/* Login modal for unauthenticated users */}
      <TransitionsModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        title="Alert"
        message="Please log in to add products to your cart."
        closeButton="Proceed"
        showButton={true}
        extraFunction={() => navigate("/auth/login")}
      />

      <ScrollToTop />
    </>
  );
}
