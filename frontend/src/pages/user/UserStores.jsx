import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function UserStores() {
  const [stores, setStores] = useState([]);

  const load = async () => {
    const res = await axios.get("/stores");
    setStores(res.data);
  };

  const rate = async (storeId, value) => {
    try {
      if (!stores.find((s) => s.id === storeId).userRating) {
        await axios.post("/ratings", { storeId, rating: value });
      } else {
        await axios.put(`/ratings/${storeId}`, { rating: value });
      }
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container">

      <h2>Stores</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{Number(s.overallRating || 0).toFixed(1)}</td>
              <td>
                <select
                  value={s.userRating || ""}
                  onChange={(e) => rate(s.id, Number(e.target.value))}
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
