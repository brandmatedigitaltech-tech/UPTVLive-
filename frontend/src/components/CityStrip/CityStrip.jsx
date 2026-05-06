import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import "./CityStrip.css";

import API from "../../services/api";

const CityStrip = () => {

  const location =
    useLocation();

  // ================= STATE =================
  const [cities, setCities] =
    useState([]);

  // ================= FETCH =================
  useEffect(() => {

    const fetchCities =
      async () => {

        try {

          const res =
            await API.get(
              "/meta/cities"
            );

          const data =
            Array.isArray(
              res.data
            )
              ? res.data
              : [];

          setCities(data);

        } catch (err) {

          console.log(
            "CityStrip Error:",
            err
          );
        }
      };

    fetchCities();

  }, []);

  return (
    <div className="city-strip">

      {cities.map((city) => {

        const isActive =
          location.pathname ===
          `/city/${city.slug}`;

        return (
          <Link
            key={city._id}
            to={`/city/${city.slug}`}
            className={`city-link ${
              isActive
                ? "active"
                : ""
            }`}
          >

            {city.name}

          </Link>
        );
      })}

    </div>
  );
};

export default CityStrip;