import { Link } from "react-router-dom";
import './../../styles/extra.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>{"Oops! The page you're looking for doesn't exist."}</p>
      <Link to="/" className="home-button">Go Home</Link>
    </div>
  );
}
