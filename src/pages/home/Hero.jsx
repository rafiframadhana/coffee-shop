import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h2>Start Your Day with the Perfect Brew</h2>
        <h1 className="hero-title">Coffee</h1>
        <p>
          Rich, aromatic coffee to energize your morning, sharpen focus, and
          boost metabolism—fueling your day with every sip.
        </p>

        <Link to="/products" className="btn">
          Order Now
        </Link>
      </div>
    </section>
  );
}
