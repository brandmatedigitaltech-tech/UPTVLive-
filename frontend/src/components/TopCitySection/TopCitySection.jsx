import React, {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import "./TopCitySection.css";

import API from "../../services/api";

const TopCitySection = () => {

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
            "TopCity Error:",
            err
          );
        }
      };

    fetchCities();

  }, []);

  // ================= SCROLL =================
  const handleClick = () => {

    window.scrollTo(0, 0);
  };

  return (
    <div className="top-city-section">

      <div className="top-city-container">

        {cities.map((city) => (

          <NavLink
            key={city._id}
            to={`/city/${city.slug}`}
            onClick={handleClick}
            className={({ isActive }) =>
              isActive
                ? "top-city active"
                : "top-city"
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