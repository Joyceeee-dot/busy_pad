import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import Aurora from "../components/Aurora";
import "../css/Login.css";

const DeviceLogin = ({ setUser }) => {
  const [deviceCode, setDeviceCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeviceLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await userApi.deviceLogin(deviceCode);
      if (response.token) {
        const userData = {
          email: `Device-${deviceCode}`,
          isLoggedIn: true,
          loginMethod: 'device'
        };
        setUser(userData);
        navigate("/player-home");
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
          
          <h2 className="title">Log In</h2>
          <p className="subtitle">
            Please enter your device code
          </p>

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
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* <div className="login-links">
              <Link to="/login">Back to Email Login</Link>
            </div> */}
          </form>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeviceLogin; 