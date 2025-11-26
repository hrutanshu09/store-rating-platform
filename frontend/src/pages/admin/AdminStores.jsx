import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminStores() {
  const [stores, setStores] = useState([]);

  const load = async () => {
    const res = await axios.get("/admin/stores");
    setStores(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>All Stores</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th><th>Address</th><th>Owner</th><th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.owner_id}</td>
              <td>{Number(s.overallRating || 0).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
