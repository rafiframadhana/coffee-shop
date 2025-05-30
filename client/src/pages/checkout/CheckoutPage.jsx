import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../styles/checkout.css";
import TransitionsModal from "./../../components/TransitionsModal.jsx";
import Cart from "./Cart";
import CheckoutDetails from "./CheckoutDetails";

export default function CheckoutPage() {
  const { cart, updateQuantity, clearCart, totalPrice } = useCart();
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [showButton, setShowButton] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setModalTitle("Cart Empty");
      setModalMessage(
        "Your cart is empty. Please add items before placing an order."
      );
      setButtonText("Close");
      setShowButton(true);
    } else {
      setModalTitle("Order Placed");
      setModalMessage(
        <>
          <span className="checkout-modal-title">
            Your order has been placed successfully!
          </span>
          <span className="checkout-modal-desc">
            You will be redirected to Homepage...
          </span>
        </>
      );
      setShowButton(false);
      clearCart();
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setModalOpen(true);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const price = Number(item.productId?.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return acc + price * quantity;
    }, 0);
  };

  const displayedTotal = totalPrice || calculateTotal();

  const handleUpdateClick = (id, currentQuantity) => {
    setEditingItem(id);
    setNewQuantity(currentQuantity);
  };

  const handleSaveClick = (id) => {
    if (newQuantity > 100) {
      setModalTitle("Quantity Limit Exceeded");
      setModalMessage(
        "You can only order up to 100 items per product. If you wish to place a bulk order, please contact us through the Contact section."
      );
      setButtonText("Close");
      setShowButton(true);
      setModalOpen(true);
      return;
    }
    updateQuantity(id, newQuantity);
    setEditingItem(null);
  };

  return (
    <div className="checkout-page">
      <h1>Review Your Order</h1>
      <div className="checkout-container">
        <Cart
          handleUpdateClick={handleUpdateClick}
          handleSaveClick={handleSaveClick}
          editingItem={editingItem}
          newQuantity={newQuantity}
          setNewQuantity={setNewQuantity}
        />
        <CheckoutDetails total={displayedTotal} handleSubmit={handleSubmit} />
      </div>
      <TransitionsModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        closeButton={buttonText}
        showButton={showButton}
      />
    </div>
  );
}
