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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await userApi.login(email, password);
      if (response.access_token) {
        const userData = {
          email: email,
          isLoggedIn: true,
          loginMethod: 'email'
        };
        setUser(userData);
        navigate("/home");
      }
    } catch (error) {
      setError(error.message || "Login failed");
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
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
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="register-link">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>

          {/* <div className="login-links">
            <a href="/device-login">Device Login</a>
          </div> */}

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;