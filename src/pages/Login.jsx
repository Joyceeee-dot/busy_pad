import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Aurora from "../components/Aurora";
import "../css/Login.css"; 
// import { auth } from "../firebase"; we will use this later

const USER_DATA_URL = "/users.json";

const Login = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //Mock user data
  useEffect(()=> {
    fetch(USER_DATA_URL)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched users:", data);
        setUsers(data)})
      .catch(error => console.error("Error loading user data:", error));
  }, [])

  // submit form
  const handleSubmit = async (e) => {
    //navigate("/home");
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

      const user = users.find(
        (u) => u.email === trimmedEmail && u.password === trimmedPassword
      );
      if (user) {
        console.log("Login success:", user);

        //save login status
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", user.email);
        // navigate to home page
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
      < Aurora 
        colorStops={["#000000", "#6A3093", "#A044FF", "#0F2027"]}
        blend={0.4}
        amplitude={0.8}
        speed={0.6}
        />
      <div className="login-container">
        {/* Login form */}
        <div className="login-form">
          {/* LOGO */}
          <div className="logo-placeholder">BusyPad</div>

          <h2 className="title"></h2>
          <p className="subtitle">
            
          </p>

          {/* main form */}
          <form onSubmit={handleSubmit}>
            {/* Input of Email */}
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

            {/* Input of password */}
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

          {/* Register Link */}
          <p className="register-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>

          {/* Error message */}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
  </div>
  );
};

export default Login;