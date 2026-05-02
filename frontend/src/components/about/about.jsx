import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* HERO */}
      <div className="about-hero">
        <h1>About Us</h1>
      </div>

      <div className="about-container">

        {/* INTRO */}
        <p>
          UPtvLIVE is a leading Hindi digital news portal that delivers the latest
          news from Uttar Pradesh including politics, crime, education, employment,
          and social issues with speed and reliability.
        </p>

        <p>
          Uttar Pradesh is a land of rich history and culture — the birthplace of
          Lord Krishna and Lord Ram, the sacred city of Kashi, the place of Buddha’s
          Mahaparinirvana in Kushinagar, and a region that has given India nine Prime Ministers.
          UPtvLIVE brings you closer to every corner of this dynamic state.
        </p>

        <p>
          Our mission is to reach every village and every political movement so that
          no important news from Uttar Pradesh is missed. With UPtvLIVE, news is always
          in your hands.
        </p>

        <p>
          The goal of uptvlive.com is to deliver every small and big news from Uttar Pradesh
          first and with accuracy.
        </p>

        {/* OWNER SECTION */}
        <div className="owner-section">

          <img
            src="/images/owner.jpeg"
            alt="Abhay Tripathi"
            className="owner-img"
          />

          <div className="owner-info">
            <h3>Abhay Tripathi</h3>
            <p>Chairman, MD & Editor-in-Chief, UPtvLIVE</p>
          </div>

        </div>

        {/* OWNER DETAILS */}
        <div className="owner-details">

          <p>
            Abhay Tripathi is an Indian journalist, author, and media entrepreneur,
            serving as the Chairman, Managing Director (MD), and Editor-in-Chief of UPtvLIVE.
            He is recognized as an active and influential name in Hindi media.
          </p>

          <p>
            During his career, he has worked with reputed media organizations such as
            Ptv India, Medhaj News, Kashish News, Parikrama Vichardhara, and Naxatra News,
            where he played key roles in reporting, editing, and content leadership.
          </p>

          <p>
            In 2018, Abhay Tripathi launched his independent digital media platform,
            UPtvLIVE, with the aim of promoting unbiased, public-interest-driven, and factual journalism.
          </p>

          <h2>Key Facts</h2>
          <ul>
            <li><strong>Position:</strong> Chairman, MD & Editor-in-Chief, UPtvLIVE</li>
            <li><strong>Date of Birth:</strong> 17 September</li>
            <li><strong>Career Started From:</strong> Kanpur, Uttar Pradesh</li>
            <li><strong>Identity:</strong> Journalist, Author & Speaker</li>
            <li><strong>Award:</strong> Journalist Ratna Award</li>
          </ul>

          <h2>Journalism Philosophy</h2>
          <p>
            Abhay Tripathi follows the principle of <strong>"Less Views, More News"</strong>.
            He believes that journalism should not be about chasing TRP or views,
            but about delivering accurate, unbiased, and meaningful information to society.
          </p>

          <p>
            With this vision, he is leading UPtvLIVE as a “thought-driven movement”
            in the field of journalism.
          </p>

        </div>

        {/* MISSION */}
        <h2>Mission</h2>
        <p>
          UPtvLIVE’s mission is to promote unbiased and truthful journalism.
          We are committed to spreading awareness against fake news and giving
          a strong platform to the voice of the people.
        </p>

        {/* WHAT WE COVER */}
        <h2>What We Cover</h2>
        <p>On UPtvLIVE, you will find:</p>
        <ul>
          <li>Latest news from Uttar Pradesh</li>
          <li>Local news from Kanpur, Lucknow, and other cities</li>
          <li>Political and administrative updates</li>
          <li>Crime news and investigative reports</li>
          <li>Education, jobs, and government schemes</li>
          <li>National and international news</li>
          <li>Religion, culture, and social issues</li>
        </ul>

        {/* WHY CHOOSE US */}
        <h2>Why Choose Us</h2>
        <ul>
          <li>Fast and breaking news updates</li>
          <li>Ground reporting and exclusive stories</li>
          <li>Unbiased and fact-based journalism</li>
          <li>Simple and clear language</li>
        </ul>

        {/* TEAM */}
        <h2>Our Team</h2>
        <p>
          The UPtvLIVE team consists of experienced journalists and reporters
          who work 24/7 to cover news from every corner.
        </p>

        {/* CONTACT */}
        <h2>Contact Us</h2>
        <p>📧 Email: editorpvnews@gmail.com</p>
        <p>📞 Phone: +91 9335690008</p>
        <p>📍 Address: UPTVLIVE Head Office,Gandhi Nagar, Kanpur Nagar, Uttar Pradesh | Pin Code:208002</p>

        {/* COMMITMENT */}
        <h2>Commitment</h2>
        <p>
          UPtvLIVE is committed to providing accurate, balanced, and reliable information.
          Our goal is to create an aware society and empower people through truthful news.
        </p>

      </div>
    </div>
  );
};

export default About;