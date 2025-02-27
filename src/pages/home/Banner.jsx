import { Link } from "react-router-dom";
import coffeeImage from './../../assets/images/banner/morning-coffee.png';


export default function Banner() {
    return (

        <section className="banner" id="banner">
            <div className="banner-text">
                <h2>Start Your Morning with the Perfect Brew</h2>
                <p>Enjoy a one-time opportunity to elevate your day with the finest coffee experience.</p>

                <Link to="/products" className="btn">Order Now</Link>
            </div>
            <img src={coffeeImage} alt="Coffee Image" />
        </section >
    )
}