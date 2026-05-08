import { useEffect } from "react";
import { useParams } from "react-router-dom";

const SeoRedirect = () => {

  const { slug } = useParams();

  useEffect(() => {

    window.location.replace(
      `https://api.uptvlive.com/seo/article/${slug}`
    );

  }, [slug]);

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      Redirecting...
    </div>
  );
};

export default SeoRedirect;