import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./CityStrip.css";

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

const CityStrip = () => {
  const location = useLocation();

  return (
    <div className="city-strip">

      {cities.map((city) => {
        const isActive = location.pathname === `/city/${city.slug}`;

        return (
          <Link
            key={city.slug}
            to={`/city/${city.slug}`}
            className={`city-link ${isActive ? "active" : ""}`}
          >
            {city.name}
          </Link>
        );
      })}

    </div>
  );
};

export default CityStrip;