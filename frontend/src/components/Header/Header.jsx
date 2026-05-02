import "./Header.css";
import logo from "../../assets/logo.jpeg";
import { Link } from "react-router-dom";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Header = () => {

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <header>
      <div className="container">
        <div className="header-main">

          {/* 🔥 LOGO SECTION (CLICKABLE) */}
          <Link to="/" onClick={handleClick} className="logo-wrap">
            <div className="logo-flex">
              <img
                src={logo}
                alt="UPTV Logo"
                className="logo-img"
              />

              <div className="logo-tagline">
                उत्तर प्रदेश की नंबर 1 न्यूज़ वेबसाइट
              </div>
            </div>
          </Link>

          {/* SOCIAL ICONS */}
          <div className="social">

            <a
              href="https://www.facebook.com/share/g/1F2hjHwfW4/"
              target="_blank"
              rel="noreferrer"
              className="icon facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://x.com/UPTV_BREAKING"
              target="_blank"
              rel="noreferrer"
              className="icon twitter"
            >
              <FaXTwitter />
            </a>

            <a
              href="https://www.instagram.com/uptvlive"
              target="_blank"
              rel="noreferrer"
              className="icon instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.youtube.com/@UPtvLIVE1"
              target="_blank"
              rel="noreferrer"
              className="icon youtube"
            >
              <FaYoutube />
            </a>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;