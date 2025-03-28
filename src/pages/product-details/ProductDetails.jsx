import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import "./../../styles/ProductDetails.css";
import checkmark from "./../../assets/checkmark.png";

export default function ProductDetails() {
  const { products, loading, error } = useProducts();
  const { productId } = useParams();
  const product = products.find((p) => p.id === parseInt(productId));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <div className="error-box">
          <span className="error-icon">⚠️</span> {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  function handleSelectQuantity(event) {
    setQuantity(parseInt(event.target.value));
  }

  function handleAddToCart() {
    addToCart(product, quantity);
    setAddedMessage("Added");

    setTimeout(() => {
      setAddedMessage("");
    }, 1000);
  }

  return (
    <div className="product-details">
      <div className="left-column">
        <img src={product.src} alt={product.name} />
      </div>

      <div className="right-column">
        <h2>{product.name}</h2>
        <p>{product.contain}</p>
        <p className="price">
          <strong>
            Price: Rp. {new Intl.NumberFormat("id-ID").format(product.price)}
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
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
            </select>
          </div>

          <button onClick={handleAddToCart}>Add to Cart</button>
          <div>
            {addedMessage && (
              <div className="added-message-details">
                <img src={checkmark} />
                <p>{addedMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
