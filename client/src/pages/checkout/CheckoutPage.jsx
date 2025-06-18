import { useCart } from "../../context/CartContext";
import { useRef, useState } from "react";
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
  const navToProductsPage = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setModalTitle("Cart Empty");
      setModalMessage(
        "Your cart is empty. Please add items before placing an order."
      );
      setButtonText("Close");
      navToProductsPage.current = null;
    } else {
      setModalTitle("Order Placed");
      setModalMessage("Your order has been placed successfully!");
      setButtonText("View More Products");
      navToProductsPage.current = () => {
        navigate("/products");
      };
      clearCart();
    }
    setShowButton(true);
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
        extraFunction={navToProductsPage.current}
      />
    </div>
  );
}
