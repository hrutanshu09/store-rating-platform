import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    if (!validateEmail(form.email)) {
      return alert("Invalid email format");
    }

    if (form.password.length < 8) {
      return alert("Password must be at least 8 characters");
    }

    try {
      const res = await axios.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "OWNER") navigate("/owner/dashboard");
      else navigate("/stores");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-page auth-page--two-col">
      {/* LEFT: Login Card */}
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="auth-sub">Login to access your dashboard</p>

        {/* Email */}
        <div className="auth-input">
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* Password with Eye Toggle */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword((s) => !s)}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye Closed
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94 6.06 6.06"></path>
                <path d="M9.9 9.9c-.6.6-.9 1.35-.9 2.1a3 3 0 0 0 3 3 c.75 0 1.5-.3 2.1-.9"></path>
                <path d="M14.12 14.12A5 5 0 0 1 7.88 7.88"></path>
                <path d="M10.73 5.08A10.39 10.39 0 0 1 12 5 c5 0 9.27 3.11 11 7.5a11.33 11.33 0 0 1-2 3.5"></path>
                <path d="M6 18a10.52 10.52 0 0 1-4-5"></path>
              </svg>
            ) : (
              // Eye Open
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </span>
        </div>

        <button className="auth-btn" onClick={submit}>
          Login
        </button>

        <div className="auth-switch">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>

      {/* RIGHT: Demo Credentials (sibling of auth-card) */}
      <aside className="demo-credentials">
        <h4>Demo Login Credentials</h4>

        <div className="cred-box">
          <strong>Admin</strong>
          <p>Email: <code>admin@example.com</code></p>
          <p>Password: <code>Admin@123</code></p>
        </div>

        <div className="cred-box">
          <strong>Owner</strong>
          <p>Email: <code>ocean@gmail.com</code></p>
          <p>Password: <code>Owner@123</code></p>
        </div>

        <div className="cred-box">
          <strong>User</strong>
          <p>Email: <code>test@gmail.com</code></p>
          <p>Password: <code>User@123</code></p>
        </div>

        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 6 }}>
          NOTE: These are demo credentials for local/testing only.
        </p>
      </aside>
    </div>
  );
}
