import { useState } from "react";
import axios from "../../api/axiosClient";

export default function UpdatePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const submit = async () => {
    try {
      await axios.put("/auth/password", form);
      alert("Password updated");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Old password"
        onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
      /><br />

      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
      /><br />

      <button onClick={submit}>Update</button>
    </div>
  );
}
