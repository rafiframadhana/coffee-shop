import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-info">
                    <h3>Bean Scene</h3>
                    <p>Enjoy the finest coffee every day.</p>
                    <p>© Rafif Ramadhana</p>
                </div>
                <div className="footer-links">
                    <h3>Company</h3>
                    <ul>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><a href="https://rafiframadhana.site/" target="_blank">My Site</a></li>
                        <li><a href="https://github.com/rafiframadhana" target="_blank">GitHub</a></li>
                        <li><a href="https://www.linkedin.com/in/rafif-ramadhana-230603250/" target="_blank">LinkedIn</a></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p>Jl. Teuku Umar No. 10, Banda Aceh, Indonesia</p>
                    <p>+62 812-3456-7890</p>
                    <p>info@beanscene.id</p>
                </div>
            </div>

        </footer >
    )
}