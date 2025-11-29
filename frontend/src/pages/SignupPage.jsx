import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateName = (name) => name.length >= 20 && name.length <= 60;

  const validateEmail = (email) =>
    /^\S+@\S+\.\S+$/.test(email);

  const validatePassword = (pwd) =>
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]).{8,16}$/.test(pwd);

  const validateAddress = (addr) => addr.length <= 400;

  const submit = async () => {
    if (!validateName(form.name)) {
      return alert("Name must be 20–60 characters.");
    }

    if (!validateEmail(form.email)) {
      return alert("Please enter a valid email address.");
    }

    if (!validateAddress(form.address)) {
      return alert("Address cannot exceed 400 characters.");
    }

    if (!validatePassword(form.password)) {
      return alert("Password must be 8–16 chars, include 1 uppercase & 1 special character.");
    }

    try {
      await axios.post("/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">
        <h2>Create Account ✨</h2>
        <p className="auth-sub">Join our rating community</p>

        <div className="auth-input">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="auth-input">
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="auth-input">
          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>


        <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    onChange={(e) => setForm({ ...form, password: e.target.value })}
  />

  <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
    {showPassword ? (
      // Eye Closed
      <svg width="24" height="24" viewBox="0 0 24 24"
           fill="none" stroke="#ffffff" strokeWidth="2.2"
           strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94 6.06 6.06"></path>
        <path d="M9.9 9.9c-.6.6-.9 1.35-.9 2.1a3 3 0 0 0 3 3
                 c.75 0 1.5-.3 2.1-.9"></path>
        <path d="M14.12 14.12A5 5 0 0 1 7.88 7.88"></path>
        <path d="M10.73 5.08A10.39 10.39 0 0 1 12 5
                 c5 0 9.27 3.11 11 7.5a11.33 11.33 0 0 1-2 3.5"></path>
        <path d="M6 18a10.52 10.52 0 0 1-4-5"></path>
      </svg>
    ) : (
      // Eye Open
      <svg width="24" height="24" viewBox="0 0 24 24"
           fill="none" stroke="#ffffff" strokeWidth="2.2"
           strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    )}
  </span>
</div>


        <button className="auth-btn" onClick={submit}>Sign Up</button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>

    </div>
  );
}
