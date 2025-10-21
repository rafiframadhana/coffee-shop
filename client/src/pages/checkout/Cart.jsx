import { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useCart, useDeleteCartItem } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/format";
import { Link } from "react-router-dom";
import CartEmpty from "./CartEmpty";

export default function Cart({
  handleUpdateClick,
  handleSaveClick,
  editingItem,
  newQuantity,
  setNewQuantity,
}) {
  // React Query hooks for cart data and mutations
  const { data: cartData, isLoading, error } = useCart();
  const deleteItemMutation = useDeleteCartItem();

  // Extract cart items from React Query data
  const cart = useMemo(() => cartData?.items || [], [cartData]);

  // Memoized delete handler with optimistic update (BEFORE early returns)
  const handleDelete = useCallback(
    (productId) => {
      deleteItemMutation.mutate(productId);
    },
    [deleteItemMutation]
  );

  // Handle loading state (AFTER all hooks)
  if (isLoading) {
    return (
      <div className="info-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="info-container">
        <div className="error-cart">⚠️ {error.message || "Failed to load cart"}</div>
      </div>
    );
  }

  const renderQuantitySection = (item) => {
    return editingItem === item.productId._id ? (
      <div key={item.productId._id} className="input-save-qty">
        <label>
          Qty:
          <input
            className="quantity-input"
            type="number"
            min="1"
            value={newQuantity}
            onChange={(e) => setNewQuantity(Number(e.target.value))}
          />
        </label>
        <p
          onClick={() => handleSaveClick(item.productId._id)}
          className="save-btn"
        >
          Save
        </p>
      </div>
    ) : (
      <>
        <p>Qty: <strong>{item.quantity}</strong></p>
        <p
          onClick={() => handleUpdateClick(item.productId._id, item.quantity)}
          className="update-btn"
        >
          Update
        </p>
      </>
    );
  };

  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      {cart.length === 0 && <CartEmpty />}
      {cart.map((item) => (
        <div className="order-item" key={item.productId._id}>
          <Link to={`/product/${item.productId._id}`}>
            <img
              src={item.productId?.src}
              alt={item.productId?.item}
              className="product-image"
            />
          </Link>
          <div className="item-details">
            <Link to={`/product/${item.productId._id}`}>
              <h3>{item.productId?.item}</h3>
            </Link>

            <div className="quantity-container">
              {renderQuantitySection(item)}
              <p
                className="delete-btn"
                onClick={() => handleDelete(item.productId._id)}
              >
                Delete
              </p>
            </div>
            <p>
              <strong>
                {formatCurrency(item.productId?.price * item.quantity)}
              </strong>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

Cart.propTypes = {
  handleUpdateClick: PropTypes.func.isRequired,
  handleSaveClick: PropTypes.func.isRequired,
  editingItem: PropTypes.string,
  newQuantity: PropTypes.number.isRequired,
  setNewQuantity: PropTypes.func.isRequired,
};
