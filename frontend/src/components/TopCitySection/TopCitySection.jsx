import React from "react";
import { NavLink } from "react-router-dom";
import "./TopCitySection.css";

const cities = [
  { name: "कानपुर", slug: "kanpur" },
  { name: "लखनऊ", slug: "lucknow" },
  { name: "अयोध्या", slug: "ayodhya" },
  { name: "आगरा", slug: "agra" },
  { name: "वाराणसी", slug: "varanasi" },
  { name: "गोरखपुर", slug: "gorakhpur" },
  { name: "प्रयागराज", slug: "prayagraj" },
  { name: "गाज़ियाबाद", slug: "ghaziabad" }
];

const TopCitySection = () => {

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="top-city-section">
      <div className="top-city-container">

        {cities.map((city) => (
          <NavLink
            key={city.slug}
            to={`/city/${city.slug}`}
            onClick={handleClick}
            className={({ isActive }) =>
              isActive ? "top-city active" : "top-city"
            }
          >
            {city.name}
          </NavLink>
        ))}

      </div>
    </div>
  );
};

export default TopCitySection;