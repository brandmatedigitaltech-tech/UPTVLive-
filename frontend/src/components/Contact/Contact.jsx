import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">

      {/* HERO */}
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We’d love to hear from you</p>
        </div>
      </div>

      {/* MAIN */}
      <div className="container contact-content">

        {/* LEFT INFO */}
        <div className="contact-info">
          <h2>Get in Touch</h2>

          <p>📞 Phone: +91 88888555555</p>
          <p>📧 Email: brandmate@uptvlive.com</p>
          <p>🏢 Address: Lucknow, Uttar Pradesh, India</p>

          <p style={{ marginTop: "20px", color: "#555" }}>
            For news tips, feedback, or business inquiries,
            feel free to contact us anytime.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form">

          <h2>Send Message</h2>

          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>

            <button type="submit">Send Message</button>
          </form>

        </div>

      </div>

    </div>
  );
};

export default Contact;