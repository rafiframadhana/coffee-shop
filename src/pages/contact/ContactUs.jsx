export default function ContactUs() {
  return (
    <section className="contact-us-page" id="contact">
      <div className="contact-page-container">
        <div className="contact-page-info">
          <h2>Contact us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you! Drop us a
            message, and we’ll get back to you as soon as possible.
          </p>
          <div className="contact-page-details">
            <p>
              <strong>📍 Address:</strong> Jl. Teuku Umar No. 10, Banda Aceh,
              Indonesia
            </p>
            <p>
              <strong>📞 Phone:</strong> +62 812-3456-7890
            </p>
            <p>
              <strong>📧 Email:</strong> info@coffeeculture.id
            </p>
          </div>
        </div>
        <div className="contact-page-form">
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
            </div>
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
