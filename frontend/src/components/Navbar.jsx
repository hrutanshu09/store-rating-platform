import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const active = (path) =>
    location.pathname === path ? "active" : "";

  return (
    <nav>
      {/* LEFT SIDE */}
      <div style={{ display: "flex", alignItems: "center" }}>

        {user && (
          <>
            <span style={{ marginRight: 15 }}>
              Welcome, {user.name} ({user.role})
            </span>

            {user.role === "USER" && (
              <Link className={active("/stores")} to="/stores">Stores</Link>
            )}

            {user.role === "OWNER" && (
              <Link className={active("/owner/dashboard")} to="/owner/dashboard">Dashboard</Link>
            )}

            {user.role === "ADMIN" && (
              <>
                <Link className={active("/admin/dashboard")} to="/admin/dashboard">Dashboard</Link>
                <Link className={active("/admin/users")} to="/admin/users">Users</Link>
                <Link className={active("/admin/stores")} to="/admin/stores">Stores</Link>
                <Link className={active("/admin/add-user")} to="/admin/add-user">Add User</Link>
                <Link className={active("/admin/add-store")} to="/admin/add-store">Add Store</Link>
                
              </>
            )}
            <Link className={active("/update-password")} to="/update-password">
                  Change Password
                </Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      {user && (
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
}
