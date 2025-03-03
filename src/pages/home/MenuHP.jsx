import { products } from "./../../data/data.js";
import { Link } from "react-router-dom";

export default function MenuHP() {
  const randomProducts = [...products]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const listOfMenu = randomProducts.map((product) => {
    return (
      <div className="menu-item" key={product.id}>
        <img src={product.src} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.contain}</p>
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
