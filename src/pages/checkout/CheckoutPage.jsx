import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import "./../../styles/Checkout.css";
import TransitionsModal from "./../../components/TransitionsModal.jsx";
import Cart from "./Cart";
import CheckoutDetails from "./CheckoutDetails";

export default function CheckoutPage() {
  const { cart, updateQuantity, clearCart } = useCart();
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("totalPrice", JSON.stringify(calculateTotal()));
  }, [cart]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setModalTitle("Cart Empty");
      setModalMessage(
        "Your cart is empty. Please add items before placing an order."
      );
    } else {
      setModalTitle("Order Placed");
      setModalMessage("Your order has been placed successfully!");

      localStorage.removeItem("cart");
      localStorage.removeItem("totalPrice");
      clearCart();
    }

    setModalOpen(true);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

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
        <CheckoutDetails
          calculateTotal={calculateTotal}
          handleSubmit={handleSubmit}
        />
      </div>
      <TransitionsModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
}
