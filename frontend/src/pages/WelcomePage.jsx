import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="page-container" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
        Welcome to Store Rating Platform
      </h1>

      <p style={{ fontSize: "20px", maxWidth: "700px", margin: "0 auto 40px" }}>
        Rate stores, manage users, and explore insights — all in one modern, 
        secure platform. Please login or create an account to continue.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "25px" }}>
        <Link to="/login">
          <button style={{ width: "200px" }}>Login</button>
        </Link>

        <Link to="/signup">
          <button style={{ width: "200px" }}>Signup</button>
        </Link>
      </div>
    </div>
  );
}
