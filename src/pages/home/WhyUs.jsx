import { Link } from "react-router-dom";
import priceLogo from "./../../assets/images/why-us/affordable-price.png";
import beansLogo from "./../../assets/images/why-us/coffee-beans.png";
import qualityLogo from "./../../assets/images/why-us/quality-badge.png";
import flavorLogo from "./../../assets/images/why-us/unique-flavor.png";

export default function WhyUs() {
  const features = [
    {
      title: "Premium Beans",
      text: "Handpicked for an exceptional taste.",
      img: beansLogo,
    },
    {
      title: "High Quality",
      text: "We guarantee the best in every sip.",
      img: qualityLogo,
    },
    {
      title: "Distinctive Flavor",
      text: "A coffee experience like no other.",
      img: flavorLogo,
    },
    {
      title: "Great Prices",
      text: "Top-quality coffee at unbeatable prices.",
      img: priceLogo,
    },
  ];

  const featureDetail = features.map((feature) => {
    return (
      <div className="feature-item">
        <img src={feature.img} alt={feature.title} />
        <h3>{feature.title}</h3>
        <p>{feature.text}</p>
      </div>
    );
  });

  return (
    <section className="why-us">
      <h2>What Makes Us Different?</h2>
      <p className="title-text">
        We don’t just serve coffee, we brighten your day!
      </p>

      <div className="feature-grid">{featureDetail}</div>

      <div className="why-us-text">
        <p>Great ideas begin with great coffee—let us fuel your inspiration</p>
        <h2>Get Yours Now!</h2>
        <Link to="/products" className="btn">
          Order Now
        </Link>
      </div>
    </section>
  );
}
