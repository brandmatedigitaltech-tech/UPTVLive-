import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import NewsCard from "../NewsCard/NewsCard";
import AdBanner from "../AdBanner";

const cityMap = {
  lucknow: "लखनऊ",
  kanpur: "कानपुर",
  ayodhya: "अयोध्या",
  agra: "आगरा",
  varanasi: "वाराणसी",
  gorakhpur: "गोरखपुर",
  prayagraj: "प्रयागराज",
  ghaziabad: "गाज़ियाबाद",
};

const CityPage = () => {
  const { city } = useParams();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const cityName = cityMap[city] || city;

  useEffect(() => {
    const fetchCityNews = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/news/city/${city}`);

        const data = Array.isArray(res.data) ? res.data : [];

        setNews(data);

      } catch (err) {
        console.log("CityPage Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityNews();
  }, [city]);

   return (
    <div className="container" style={{ padding: "20px" }}>

      {/* 🔥 TOP AD */}
      <AdBanner position="city_top" />

      {/* TITLE */}
      <h2 style={{ marginBottom: "15px" }}>
        {cityName} News
      </h2>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY */}
      {!loading && news.length === 0 && (
        <p>No news found</p>
      )}

      {/* GRID WITH INLINE ADS */}
      <div className="grid-3">
        {!loading &&
          news.map((item, index) => (
            <div key={item._id}>

              <NewsCard news={item} />

              {/* 🔥 INLINE AD EVERY 6 POSTS */}
              {(index + 1) % 6 === 0 && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <AdBanner position="city_inline" />
                </div>
              )}

            </div>
          ))}
      </div>

      {/* 🔥 BOTTOM AD */}
      <AdBanner position="city_bottom" />

    </div>
  );
};

export default CityPage;