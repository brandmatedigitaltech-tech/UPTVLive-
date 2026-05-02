import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);

  const fetchNews = async () => {
    try {
      const res = await API.get(`/news/id/${id}`);
      setNews(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [id]);

  if (!news) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>

      <h2>📰 Review News</h2>

      <img
        src={news.image || "/no-image.jpg"}
        alt=""
        style={{ width: "100%", borderRadius: "10px" }}
      />

      <h1>{news.title}</h1>

      <p>{news.content}</p>

      {/* CATEGORY */}
      <p>
        <b>Categories:</b> {news.categories?.join(", ")}
      </p>

      {/* TAGS */}
      <p>
        <b>Tags:</b> {news.tags?.join(", ")}
      </p>

      {/* ACTION */}
      <div style={{ marginTop: "20px" }}>
        <button
          style={{ background: "green", color: "#fff", padding: "10px" }}
          onClick={async () => {
            await API.put(`/news/approve/${news._id}`);
            alert("Approved ✅");
        
            // 🔥 REDIRECT TO DASHBOARD (PENDING TAB)
            navigate("/dashboard?tab=pending");
          }}
        >
          Approve
        </button>
      
        <button
          style={{ background: "red", color: "#fff", padding: "10px", marginLeft: "10px" }}
          onClick={async () => {
            await API.delete(`/news/${news._id}`);
            alert("Deleted ❌");
        
            // 🔥 REDIRECT
            navigate("/dashboard?tab=pending");
          }}
        >
          Delete
        </button>
      </div>

    </div>
  );
};

export default ReviewPage;