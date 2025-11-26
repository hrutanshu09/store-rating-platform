import { useState } from "react";
import axios from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const submit = async () => {
    try {
      await axios.post("/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="page-container">
      <h2>Create Account</h2>

      <input
        placeholder="Full Name (20-60 characters)"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      /><br />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      /><br />

      <input
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      /><br />

      <input
        type="password"
        placeholder="Password (8-16 chars, uppercase + special char)"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      /><br />

      <button onClick={submit}>Signup</button>
    </div>
  );
}
