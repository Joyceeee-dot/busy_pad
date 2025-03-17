import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Aurora from "../components/Aurora";
import "../css/Login.css"; 
import { userApi, tokenService } from "../services/api";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend form validation
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Call login API
      const response = await userApi.login(trimmedEmail, trimmedPassword);
      
      // Set user data in App state
      setUser({
        email: trimmedEmail,
        isLoggedIn: true
      });
      
      // Navigate to home page
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Error processing login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Aurora 
        colorStops={["#000000", "#6A3093", "#A044FF", "#0F2027"]}
        blend={0.4}
        amplitude={0.8}
        speed={0.6}
      />
      <div className="login-container">
        <div className="login-form">
          <div className="logo-placeholder">BusyPad</div>

          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">
            Please log in to access your account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="btn login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="register-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;