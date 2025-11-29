import { Link } from "react-router-dom";

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      <div className="welcome-box">

        <h1 className="welcome-title">Welcome to Store Rating Platform</h1>

        <p className="welcome-text">
          Discover the best stores around you, read genuine reviews, and share your own experiences.
        </p>

        <div className="welcome-actions">
          <Link to="/login">
            <button className="welcome-btn login-btn">Login</button>
          </Link>

          <Link to="/signup">
            <button className="welcome-btn signup-btn">Signup</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
