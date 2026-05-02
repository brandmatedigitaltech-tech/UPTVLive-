import { useEffect, useState } from "react";
import API from "../../../services/api";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // 🔥 per-user loading

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Fetch Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= ADD WRITER =================
  const addWriter = async () => {
    if (!form.email || !form.password) {
      return alert("Fill all fields ❌");
    }

    try {
      setActionLoading("add");

      await API.post("/users/create", form);

      alert("Writer Added ✅");

      setForm({ email: "", password: "" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.msg || "Error ❌");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= DELETE =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setActionLoading(id);

      await API.delete(`/users/${id}`);

      alert("User deleted ❌");
      fetchUsers();
    } catch {
      alert("Delete failed ❌");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= BLOCK / UNBLOCK =================
  const toggleUser = async (id) => {
    try {
      setActionLoading(id);

      await API.put(`/users/toggle/${id}`);

      fetchUsers();
    } catch {
      alert("Action failed ❌");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="users-container">

      <h2 className="users-title">👥 Manage Writers</h2>

      {/* ================= FORM ================= */}
      <div className="users-form">

        <input
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          className="add-btn"
          onClick={addWriter}
          disabled={actionLoading === "add"}
        >
          {actionLoading === "add" ? "Adding..." : "➕ Add Writer"}
        </button>
      </div>

      {/* ================= LOADING ================= */}
      {loading && <p className="loading">Loading users...</p>}

      {/* ================= EMPTY ================= */}
      {!loading && users.length === 0 && (
        <p className="empty">No users found</p>
      )}

      {/* ================= USERS LIST ================= */}
      {!loading &&
        users.map((user) => (
          <div className="user-card" key={user._id}>

            {/* LEFT */}
            <div className="user-info">

              <div className="user-email">{user.email}</div>

              <div className="user-role">
                Role: <b>{user.role}</b>
              </div>

              {/* STATUS */}
              <div className="user-status">
                <span
                  className={`status-dot ${
                    user.isOnline ? "online" : "offline"
                  }`}
                ></span>
                {user.isOnline ? "Online" : "Offline"}
              </div>

              {/* LAST LOGIN */}
              <div className="user-time">
                🕒 Last Login: {formatDate(user.lastLogin)}
              </div>

              {/* LAST LOGOUT */}
              <div className="user-time">
                🚪 Last Logout: {formatDate(user.lastLogout)}
              </div>

              {/* BLOCK */}
              {!user.isActive && (
                <div className="blocked">🚫 Blocked</div>
              )}

            </div>

            {/* RIGHT */}
            <div className="user-actions">

              <button
                className="block-btn"
                onClick={() => toggleUser(user._id)}
                disabled={actionLoading === user._id}
              >
                {actionLoading === user._id
                  ? "Processing..."
                  : user.isActive
                  ? "🚫 Block"
                  : "✅ Unblock"}
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteUser(user._id)}
                disabled={actionLoading === user._id}
              >
                {actionLoading === user._id
                  ? "Deleting..."
                  : "❌ Delete"}
              </button>

            </div>

          </div>
        ))}

    </div>
  );
};

export default Users;