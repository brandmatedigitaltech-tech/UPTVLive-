import AddNews from "../components/Admin/AddNews/AddNews";

const WriterDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>✍️ Writer Dashboard</h2>

      {/* ONLY ADD NEWS */}
      <AddNews />
    </div>
  );
};

export default WriterDashboard;