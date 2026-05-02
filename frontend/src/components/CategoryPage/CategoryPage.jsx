import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import NewsCard from "../NewsCard/NewsCard";
import AdBanner from "../AdBanner";

const CategoryPage = () => {
  const { category } = useParams();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH CATEGORY NEWS
  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);

        // ✅ ALWAYS LOWERCASE
        const res = await API.get(
          `/news/category/${category.toLowerCase()}`
        );

        const data = Array.isArray(res.data) ? res.data : [];

        setNews(data);

      } catch (err) {
        console.log("Category Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [category]);

  return (
    <div className="container" style={{ padding: "20px" }}>
    
      {/* 🔥 TOP AD */}
      <AdBanner position="category_top" />
  
      {/* 🔥 TITLE */}
      <h2 style={{ marginBottom: "15px" }}>
        {category?.toUpperCase()} NEWS
      </h2>
  
      {/* 🔄 LOADING */}
      {loading && <p>Loading...</p>}
  
      {/* ❌ EMPTY */}
      {!loading && news.length === 0 && (
        <p>No news found in this category</p>
      )}
  
      {/* ✅ GRID WITH INLINE ADS */}
      <div className="grid-3">
        {!loading &&
          news.map((item, index) => (
            <>
              <NewsCard key={item._id} news={item} />
          
              {/* 🔥 INLINE AD EVERY 6 POSTS */}
              {(index + 1) % 6 === 0 && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <AdBanner position="category_inline" />
                </div>
              )}
            </>
          ))}
      </div>
        
      {/* 🔥 BOTTOM AD */}
      <AdBanner position="category_bottom" />
        
    </div>
  );
};

export default CategoryPage;