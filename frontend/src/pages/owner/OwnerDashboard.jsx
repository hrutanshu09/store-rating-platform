import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function OwnerDashboard() {
  const [data, setData] = useState({ stores: [], raters: [] });

  const load = async () => {
    const res = await axios.get("/stores/owner/dashboard");
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container">

      <h2>Owner Dashboard</h2>

      <h3>Your Stores</h3>
      {data.stores.map((s) => (
        <div key={s.id}>
            <strong>{s.name}</strong> — Avg Rating: {Number(s.avgRating || 0).toFixed(1)} ({s.totalRatings})
        </div>
      ))}

      <h3>Raters</h3>
      <ul>
        {data.raters.map((r) => (
          <li key={r.userId}>
            {r.name} rated {r.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}
