import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Aurora from "../components/Aurora";
import "../css/Login.css"; 
import { userApi, tokenService } from "../services/api";

const Login = ({ setUser }) => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email" or "device"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceCode, setDeviceCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
      const response = await userApi.login(trimmedEmail, trimmedPassword);
      
      setUser({
        email: trimmedEmail,
        isLoggedIn: true,
        loginMethod: 'email'
      });
      
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmedDeviceCode = deviceCode.trim();
      if (!trimmedDeviceCode) {
        throw new Error('Device code is required');
      }

      const response = await userApi.deviceLogin(trimmedDeviceCode);
      const userData = {
        email: `Device-${trimmedDeviceCode}`,
        isLoggedIn: true,
        isDeviceUser: true
      };
      setUser(userData);
      navigate("/player-home");
    } catch (err) {
      console.error("Device login error:", err);
      setError(err.message || "Device login failed");
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

          <div className="login-method-toggle">
            <button 
              className={`toggle-btn ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => setLoginMethod('email')}
            >
              Email Login
            </button>
            <button 
              className={`toggle-btn ${loginMethod === 'device' ? 'active' : ''}`}
              onClick={() => setLoginMethod('device')}
            >
              Device Login
            </button>
          </div>

          {loginMethod === 'email' ? (
            <form onSubmit={handleEmailLogin}>
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

              <p className="register-link">
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleDeviceLogin}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Device Code"
                  value={deviceCode}
                  onChange={(e) => setDeviceCode(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login with Device"}
              </button>
            </form>
          )}

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;