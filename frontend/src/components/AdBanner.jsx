import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import "./AdBanner.css";

const AdBanner = ({ position }) => {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  const intervalRef = useRef(null);

  // ================= FETCH ADS =================
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await API.get(`/ads/${position}`);
        setAds(Array.isArray(res.data) ? res.data : []);
        setIndex(0); // reset on position change
      } catch (err) {
        console.log("Ad fetch error:", err);
      }
    };

    fetchAds();
  }, [position]);

  // ================= AUTO ROTATE =================
  useEffect(() => {
    if (ads.length <= 1) return;

    stopRotation();

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 4000);

    return stopRotation;
  }, [ads]);

  const stopRotation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // ================= TRACK IMPRESSION =================
  const trackImpression = async (id) => {
    try {
      await API.post(`/ads/impression/${id}`);
    } catch {}
  };

  // ================= TRACK CLICK =================
  const trackClick = async (id) => {
    try {
      await API.post(`/ads/click/${id}`);
    } catch {}
  };

  // 🔥 TRACK WHEN AD CHANGES
  useEffect(() => {
    if (ads.length > 0) {
      trackImpression(ads[index]._id);
    }
  }, [index, ads]);

  if (!ads || ads.length === 0) return null;

  const ad = ads[index];

  return (
    <div
      className="ad-banner"
      onMouseEnter={stopRotation}
      onMouseLeave={() => {
        if (ads.length > 1) {
          intervalRef.current = setInterval(() => {
            setIndex((prev) => (prev + 1) % ads.length);
          }, 4000);
        }
      }}
    >
      {/* ================= IMAGE ================= */}
      {ad.type === "image" && (
        <a
          href={ad.redirectUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(ad._id)}
        >
          <img
            src={ad.mediaUrl}
            alt="advertisement"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </a>
      )}

      {/* ================= VIDEO ================= */}
      {ad.type === "video" && (
        <video
          src={ad.mediaUrl}
          controls
          autoPlay
          muted
          loop
        />
      )}
    </div>
  );
};

export default AdBanner;