import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import CartEmpty from "./CartEmpty";

export default function Cart({
  handleUpdateClick,
  handleSaveClick,
  editingItem,
  newQuantity,
  setNewQuantity,
}) {
  const { cart, deleteItem, fetchCart, loading, error } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="info-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="info-container">
        <div className="error-cart">⚠️ {error}</div>
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
          <a href={`product/${item.productId._id}`}>
            <img
              src={item.productId?.src}
              alt={item.productId?.name}
              className="product-image"
            />
            </a>
            <div className="item-details">
              <a href={`product/${item.productId._id}`}>
              <h3>{item.productId?.item}</h3>
              </a>
              
              <div className="quantity-container">
                {renderQuantitySection(item)}
                <p
                  className="delete-btn"
                  onClick={() => deleteItem(item.productId._id)}
                >
                  Delete
                </p>
              </div>
              <p>
                <strong>
                  Rp.{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    item.productId?.price * item.quantity
                  )}
                </strong>
              </p>
            </div>
          
        </div>
      ))}
    </div>
  );
}
