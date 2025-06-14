import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./../../styles/product-details.css";
import checkmark from "./../../assets/checkmark.png";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = useParams();
  const { addToCart, alert } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");
  const {user} = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetch(`${API_URL}/api/coffee/${productId}`, {
          credentials: "include",
        });
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProductById();
  }, [productId]);

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
            {user && <div>
              {addedMessage && (
                <div className="added-message-details">
                  <img src={checkmark} />
                  <p>{addedMessage}</p>
                </div>
              )}
            </div>}
          </div>
        </div>
      </div>
      
      <div className="alert-container">
        {alert && <p className="alert">{alert}</p>}
      </div>
    </>
  );
}
