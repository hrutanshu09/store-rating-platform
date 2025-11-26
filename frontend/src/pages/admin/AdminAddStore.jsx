import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function AdminAddStore() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });

  const loadOwners = async () => {
    const res = await axios.get("/admin/users?role=OWNER");
    setOwners(res.data);
  };

  const submit = async () => {
    try {
      await axios.post("/admin/stores", form);
      alert("Store created successfully");
      navigate("/admin/stores");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating store");
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Store</h2>

      <input
        placeholder="Store Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      /><br/>

      <input
        placeholder="Store Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      /><br/>

      <input
        placeholder="Store Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      /><br/>

      <select
        onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
      >
        <option value="">Select Owner</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name} — {o.email}
          </option>
        ))}
      </select>
      <br/><br/>

      <button onClick={submit}>Create Store</button>
    </div>
  );
}
