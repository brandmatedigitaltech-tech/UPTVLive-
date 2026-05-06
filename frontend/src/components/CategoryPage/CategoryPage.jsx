import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import API from "../../services/api";

import NewsCard from "../NewsCard/NewsCard";

import AdBanner from "../AdBanner";

const CategoryPage = () => {

  // ================= PARAMS =================
  const { category } = useParams();

  // ================= STATES =================
  const [news, setNews] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // ================= FORMAT TITLE =================
  const formatTitle = (text = "") => {
    return text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // ================= FETCH CATEGORY NEWS =================
  useEffect(() => {

    const fetchCategoryNews =
      async () => {

        try {

          setLoading(true);

          // ✅ SAFE CATEGORY
          const cleanCategory =
            category
              ?.toLowerCase()
              ?.trim();

          // ✅ API CALL
          const res =
            await API.get(
              `/news/category/${cleanCategory}`
            );

          // ✅ SAFE DATA
          const data =
            Array.isArray(res.data)
              ? res.data
              : [];

          setNews(data);

        } catch (err) {

          console.log(
            "Category Error:",
            err
          );

          setNews([]);

        } finally {

          setLoading(false);

        }
      };

    if (category) {
      fetchCategoryNews();
    }

  }, [category]);

  return (

    <div
      className="container"
      style={{
        padding: "20px",
      }}
    >

      {/* ================= TOP AD ================= */}
      <AdBanner position="category_top" />

      {/* ================= TITLE ================= */}
      <h2
        style={{
          marginBottom: "20px",
          textTransform: "uppercase",
        }}
      >
        {formatTitle(category)} News
      </h2>

      {/* ================= LOADING ================= */}
      {loading && (
        <p>
          Loading...
        </p>
      )}

      {/* ================= EMPTY ================= */}
      {!loading &&
        news.length === 0 && (
          <p>
            No news found in this category
          </p>
        )}

      {/* ================= NEWS GRID ================= */}
      <div className="grid-3">

        {!loading &&

          news.map(
            (
              item,
              index
            ) => (

              <React.Fragment
                key={item._id}
              >

                {/* NEWS CARD */}
                <NewsCard
                  news={item}
                />

                {/* INLINE AD */}
                {(index + 1) % 6 === 0 && (
                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <AdBanner
                      position="category_inline"
                    />
                  </div>
                )}

              </React.Fragment>
            )
          )}

      </div>

      {/* ================= BOTTOM AD ================= */}
      <AdBanner position="category_bottom" />

    </div>
  );
};

export default CategoryPage;