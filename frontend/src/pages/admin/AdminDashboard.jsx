import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  const load = async () => {
    const res = await axios.get("/admin/dashboard");
    setStats(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Stores: {stats.totalStores}</p>
      <p>Total Ratings: {stats.totalRatings}</p>
    </div>
  );
}
