
import "../Sidebar/Sidebar.css";

const WeatherWidget = () => {
  return (
    <div className="weather-widget">

      <div className="weather-city">
        ☁️ लखनऊ, उत्तर प्रदेश
      </div>

      <div style={{display:"flex",gap:"10px"}}>
        <div className="weather-temp">22°</div>

        <div>
          <div>बादल छाए</div>
          <div>27° / 16°</div>
        </div>
      </div>

      <div className="weather-details">
        <div>💧 68%</div>
        <div>💨 12km/h</div>
      </div>

    </div>
  );
};

export default WeatherWidget;