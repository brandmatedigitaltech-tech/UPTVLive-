import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔥 AUTO REDIRECT (already logged in)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const submit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill all fields ❌");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email: form.email.trim().toLowerCase(), // ✅ normalize
        password: form.password,
      });

      const { token, user } = res.data;

      // ✅ SAVE DATA
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 ROLE BASED REDIRECT
      if (user.role === "admin") {
        navigate("/dashboard?tab=pending");
      } else {
        navigate("/dashboard?tab=add");
      }

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.msg || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        <h2 style={styles.title}>🔐 Login Panel</h2>

        {/* ERROR */}
        {error && <p style={styles.error}>{error}</p>}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          style={styles.input}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter Password"
          style={styles.input}
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {/* BUTTON */}
        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
};

export default Login;

/* 🎨 STYLES (UNCHANGED) */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #eef2ff, #f5f9ff)",
  },
  box: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#d60000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};
