import "./VideoSection.css";

const videos = [
  {
    id: 1,
    title: "राहुल बच्चा सोनकर विधायक बिल्हौर कानपुर",
    url: "https://www.youtube.com/embed/uwhGyAq600E"
  },
  {
    id: 2,
    title: "कानपुर JCP विनोद कुमार सिंह का बयान",
    url: "https://www.youtube.com/embed/7jViZnE9ksA"
  },
  {
    id: 3,
    title: "कानपुर गैंगरेप की घटना को लेकर पुलिस: कमिश्नर का बयान",
    url: "https://www.youtube.com/embed/E9xRCwoeI2s"
  },
  {
    id: 4,
    title: "कानपुर ब्लास्ट के बाद एक्शन-ACP को : हटाया",
    url: "https://www.youtube.com/embed/msrByXSBxBE"
  }
];

const VideoSection = () => {
  return (
    <section className="video-section">
      <div className="container">

        {/* HEADER */}
        <div className="section-hdr">
          <h2 className="section-title">📺 न्यूज़ वीडियो</h2>
          <a
            href="https://www.youtube.com/@UPtvLIVE1"
            target="_blank"
            rel="noopener noreferrer"
            className="view-all"
          >
            सभी वीडियो →
          </a>
        </div>

        {/* GRID */}
        <div className="video-grid">
          {videos.map((video) => (
            <div className="video-card" key={video.id}>

              {/* VIDEO */}
              <div className="video-frame">
                <iframe
                  src={video.url}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* TITLE */}
              <div className="video-info">
                <p className="video-title">
                  {video.title}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default VideoSection;