import React from "react";
import "./Footer.css";
import logo from "../../assets/logo.jpeg";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaWhatsapp,
  FaLink
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {

  // 🔥 DYNAMIC DATA
  const categories = [
    "nation",
    "state",
    "world",
    "sports",
    "business",
    "tech",
    "lifestyle",
    "career",
    "video",
    "special"
  ];

  const cities = [
    "lucknow",
    "kanpur",
    "ayodhya",
    "agra",
    "varanasi",
    "gorakhpur",
    "prayagraj",
    "ghaziabad"


  ];

  // 🔥 SCROLL TO TOP
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-left">

          <Link to="/" onClick={handleClick}>
            <img src={logo} alt="UP TV LIVE" className="footer-logo" />
          </Link>

          <p className="tagline">
            Uttar Pradesh’s fastest and most trusted Hindi news website.
            <br />
            Latest news, live updates, and ground reports.
          </p>

          {/* SOCIAL */}
          <div className="social">

            <a href="https://www.facebook.com/share/g/1F2hjHwfW4/" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>

            <a href="https://x.com/UPTV_BREAKING" target="_blank" rel="noreferrer">
              <FaXTwitter />
            </a>

            <a href="https://www.instagram.com/uptvlive" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>

            <a href="https://www.youtube.com/@UPtvLIVE1" target="_blank" rel="noreferrer">
              <FaYoutube />
            </a>

            <a href="https://whatsapp.com/channel/0029VaA2qZEDTkK9Rx1evr3z" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>

            <a href="mailto:editorpvnews@gmail.com">
              <FaEnvelope />
            </a>

            <a href="https://aratt.ai/@uptvlive" target="_blank" rel="noreferrer">
              <FaLink />
            </a>

          </div>

          {/* CONTACT */}
          <div className="contact">
            <p>📞 <a href="tel:+919335690008">+91 9335690008</a></p>
            <p>📧 <a href="mailto:editorpvnews@gmail.com">editorpvnews@gmail.com</a></p>
            <p>
              🏢{" "}
              <a
                href="https://www.google.com/maps?q=Gandhi+Nagar+Kanpur+Nagar+Uttar+Pradesh"
                target="_blank"
                rel="noreferrer"
              >
                UPTVLIVE Head Office, Gandhi Nagar, Kanpur Nagar, UP - 208002
              </a>
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="footer-sections-wrapper">

          {/* 🔥 CATEGORY */}
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat}`}
                    onClick={handleClick}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY + CITIES */}
          <div>

            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><Link to="/about" onClick={handleClick}>About Us</Link></li>
                <li><Link to="/contact" onClick={handleClick}>Contact Us</Link></li>
              </ul>
            </div>

            {/* 🔥 CITIES */}
            <div className="footer-section">
              <h3 style={{ marginTop: "10px" }}>Cities</h3>
              <ul>
                {cities.map((city) => (
                  <li key={city}>
                    <Link
                      to={`/city/${city}`}
                      onClick={handleClick}
                    >
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 All Rights Reserved. Brandmate Digital
      </div>
    </footer>
  );
}

export default Footer;