import { useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProducts";
import { useCart, useUpdateCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/format";
import { MAX_ORDER_QUANTITY } from "../../constants/config";
import "./../../styles/product-details.css";
import checkmark from "./../../assets/checkmark.png";
import { useAuth } from "../../hooks/useAuthContext";
import TransitionsModal from "./../../components/TransitionsModal.jsx";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // React Query hooks for data fetching
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: cart } = useCart();
  const updateCart = useUpdateCart();

  // Auth state
  const { user } = useAuth();

  // Local UI state
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Memoized quantity options (before early returns)
  const quantityOptions = useMemo(() => {
    return Array.from({ length: Math.min(10, MAX_ORDER_QUANTITY) }, (_, i) => i + 1).map((num) => (
      <option key={num} value={num}>
        {num}
      </option>
    ));
  }, []);

  // Memoized callbacks for performance (before early returns)
  const handleSelectQuantity = useCallback((event) => {
    setQuantity(parseInt(event.target.value));
  }, []);

  const showLoginModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleAddToCart = useCallback(async () => {
    // If not logged in, show login modal
    if (!user) {
      showLoginModal();
      return;
    }

    // Show success message immediately (optimistic UI)
    setAddedMessage("Added");
    setTimeout(() => {
      setAddedMessage("");
    }, 1000);

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
    }
  }, [user, cart, product, quantity, updateCart, showLoginModal]);

  // Handle loading state (after all hooks)
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
          <span className="error-icon">⚠️</span> {error.message || "Failed to load product"}
        </div>
      </div>
    );
  }

  // Handle product not found
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="product-details">
        <div className="left-column">
          <img src={product.src} alt={product.item} />
        </div>

        <div className="right-column">
          <h2>{product.item}</h2>
          <p>{product.contain}</p>
          <p className="price">
            <strong>
              Price: {formatCurrency(product.price)}
            </strong>
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <div className="quantity-and-button">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleSelectQuantity}
              >
                {quantityOptions}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={updateCart.isLoading}
            >
              Add to Cart
            </button>
            {user && (
              <div>
                {addedMessage && (
                  <div className="added-message-details">
                    <img src={checkmark} alt="Added to cart" />
                    <p>{addedMessage}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

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

      {/* Show loading overlay during cart update */}
      {updateCart.isLoading && (
        <div className="loading-overlay">
          <div className="spinner-box">
            <div className="spinner"></div>
          </div>
        </div>
      )}
    </>
  );
}
