import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  const loadStats = async () => {
    try {
      const res = await axios.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="page-container">

      {/* TITLE */}
      <div className="admin-title">
        <span className="admin-title-icon">⚙️</span>
        Admin Dashboard
      </div>
      <div className="admin-subtitle">
        System Overview & Statistics
      </div>

      {/* STATS SECTION */}
      <div className="stats-grid">

        <div className="stats-card gradient-purple">
          <div className="stats-icon">👥</div>
          <div className="stats-value">{stats.totalUsers}</div>
          <div className="stats-label">Total Users</div>
        </div>

        <div className="stats-card gradient-pink">
          <div className="stats-icon">🏬</div>
          <div className="stats-value">{stats.totalStores}</div>
          <div className="stats-label">Total Stores</div>
        </div>

        <div className="stats-card gradient-blue">
          <div className="stats-icon">⭐</div>
          <div className="stats-value">{stats.totalRatings}</div>
          <div className="stats-label">Total Ratings</div>
        </div>

      </div>
    </div>
  );
}
