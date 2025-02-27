import aboutImg from './../../assets/images/about/about-coffee.png'

export default function AboutHP() {
    return (
        <section className="about" id="about">
            <div className="about-text">
                <h2>Discover the Art of Coffee</h2>
                <p>At Coffee Culture, every cup is crafted to perfection—boosting energy, enhancing focus, and elevating your mood with rich, premium flavors. Sourced from the finest beans and expertly brewed, our coffee delivers the perfect balance of taste and aroma. Whether you need a morning boost or a moment of relaxation, each sip offers warmth, depth, and inspiration.</p>
                <a href="#menu" className="btn">Learn More</a>
            </div>

            <img src={aboutImg} alt="Coffee Beans" className="about-image" />
        </section>
    )
}