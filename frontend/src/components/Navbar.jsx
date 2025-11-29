import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav-container">

      {/* LEFT — LOGO */}
      <div className="nav-logo">
        STORE<span>RATING</span>PLATFORM
      </div>

      {/* CENTER — NAV LINKS */}
      <div className="nav-links">
        {user && user.role === "USER" && <Link to="/stores">Stores</Link>}

        {user && user.role === "OWNER" && (
          <Link to="/owner/dashboard">Dashboard</Link>
        )}

        {user && user.role === "ADMIN" && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/stores">Stores</Link>
          </>
        )}

        {user && <Link to="/update-password">Change Password</Link>}
      </div>

      {/* RIGHT — WELCOME + LOGOUT */}
      <div className="nav-actions">

        {/* ⭐ Welcome Text — final correct position ⭐ */}
        {user && (
          <span className="nav-welcome">
            Welcome, <strong>{user.name}</strong> ({user.role})
          </span>
        )}

        {!user && (
          <>
            <button className="nav-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="nav-btn" onClick={() => navigate("/signup")}>
              Signup
            </button>
          </>
        )}

        {user && (
          <button className="nav-btn logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>

    </nav>
  );
}
