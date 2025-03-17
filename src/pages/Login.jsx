import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Aurora from "../components/Aurora";
import "../css/Login.css"; 
// import { auth } from "../firebase"; we will use this later

// Mock user data for development
const MOCK_USERS = [
  {
    email: "test@example.com",
    password: "password123",
    deviceCode: "TEST001",
    allowList: []
  }
];

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const savedUserData = localStorage.getItem("userData");
    
    if (isLoggedIn && savedUserData) {
      setUser(JSON.parse(savedUserData));
      navigate("/home");
    }
  }, [navigate, setUser]);

  // submit form
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

      // For development, use mock data
      const user = MOCK_USERS.find(
        (u) => u.email === trimmedEmail && u.password === trimmedPassword
      );

      if (user) {
        // Initialize user data with empty allowList if not present
        const userData = {
          ...user,
          allowList: user.allowList || []
        };

        // Save user data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Set user data in App state
        setUser(userData);
        
        // Navigate to home page
        navigate("/home");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error processing login. Please try again.");
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