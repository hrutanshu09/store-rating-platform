import { useState } from "react";
import axios from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function AdminAddUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "USER"
  });

  const submit = async () => {
    try {
      await axios.post("/admin/users", form);
      alert("User created successfully");
      navigate("/admin/users");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add User</h2>

      <input
        placeholder="Full Name (20-60 chars)"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      /><br/>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      /><br/>

      <input
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      /><br/>

      <input
        type="password"
        placeholder="Password (8-16 chars, uppercase + special char)"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      /><br/>

      <select
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        value={form.role}
      >
        <option value="USER">USER</option>
        <option value="OWNER">OWNER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <br/><br/>
s
      <button onClick={submit}>Create User</button>
    </div>
  );
}
