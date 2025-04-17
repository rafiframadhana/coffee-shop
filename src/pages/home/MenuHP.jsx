import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";

export default function MenuHP() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return (
      <div className="spinner-container-homepage">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message-home">
        <div className="error-box">
          <span className="error-icon">⚠️</span> Failed to load menu
        </div>
      </div>
    );
  }

  const randomProducts = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const listOfMenu = randomProducts.map((product) => {
    return (
      <div className="menu-item" key={product.id}>
        <Link to={`/product/${product.id}`} className="menu-link">
          <img src={product.src} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.contain}</p>
        </Link>
        <Link to="/products" className="btn menu-btn">
          Order Now
        </Link>
      </div>
    );
  });

  return (
    <section className="menu" id="menu">
      <h2>Experience the Craft of Our Signature Blends</h2>
      <p>
        Explore all flavours of coffee with us. There is always a new cup worth
        experiencing
      </p>
      <div className="menu-grid">{listOfMenu}</div>
    </section>
  );
}
