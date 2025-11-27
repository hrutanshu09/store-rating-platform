import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name} ({user.role})</span>
          {" | "}
          {user.role === "USER" && <Link to="/stores">Stores</Link>}
          {user.role === "OWNER" && <Link to="/owner/dashboard">Dashboard</Link>}
          {user.role === "ADMIN" && (
            <>
              <Link to="/admin/dashboard">Admin Dashboard</Link> |{" "}
              <Link to="/admin/users">Users</Link> |{" "}
              <Link to="/admin/stores">Stores</Link>|{" "}
              <Link to="/admin/add-user">Add User</Link> |{" "}
              <Link to="/admin/add-store">Add Store</Link> |{" "}

            </>
          )}
          {" | "}
          <Link to="/update-password">Change Password</Link>
          {" | "}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
}
