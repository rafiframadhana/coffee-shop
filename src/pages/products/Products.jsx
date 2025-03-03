import { products } from "./../../data/data.js";
import ScrollToTop from "./../../components/ScrollToTop.jsx";
import "./../../styles/Products.css";
import { useCart } from "../../context/CartContext.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import checkmark from "./../../assets/checkmark.png";

export default function Product() {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [addedMessage, setAddedMessage] = useState({});

  function handleSelectQuantity(event, productId) {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: parseInt(event.target.value),
    }));
  }

  function addToCartMessage(productId) {
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
  }

  const listOfProduct = products.map((product) => {
    return (
      <div className="products-item" key={product.id}>
        <Link to={`/product/${product.id}`} className="product-link">
          <img src={product.src} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.contain}</p>
        </Link>
        <div className="flex-box">
          <p className="products-price">
            Rp. {new Intl.NumberFormat("id-ID").format(product.price)}
          </p>
          <select
            className="quantity-select"
            value={quantities[product.id] || 1}
            onChange={(e) => handleSelectQuantity(e, product.id)}
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

        <div className="btn-message-container">
          <button
            className="products-btn"
            onClick={() => {
              addToCart(product, quantities[product.id] || 1);
              addToCartMessage(product.id);
            }}
          >
            Add To Cart
          </button>

          {addedMessage[product.id] && (
            <div className="added-message">
              <img src={checkmark} />
              <p>{addedMessage[product.id]}</p>
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <>
      <section className="products" id="products" style={{ marginTop: "40px" }}>
        <h2>Explore Our Coffee Brews</h2>
        <div className="products-grid">{listOfProduct}</div>
      </section>
      <ScrollToTop />
    </>
  );
}
