import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import userAvatar from "../assets/avatar.png"; 
import { tokenService } from "../services/api";

const Navbar = ({ userEmail, isDeviceUser = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    tokenService.removeToken();
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <button className="menu-button" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className="navbar-brand" to="/">BusyPad</div>
      
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link 
          className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} 
          to="/home"
          onClick={() => setIsMenuOpen(false)}
        >
          All Games
        </Link>
        <Link 
          className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} 
          to="/about"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>
      </div>

      <div className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div
          className={`user-avatar-container ${isDeviceUser ? 'device-user' : ''}`}
          onMouseEnter={!isDeviceUser ? () => setShowTooltip(true) : undefined}
          onMouseLeave={!isDeviceUser ? () => setShowTooltip(false) : undefined}
          onClick={!isDeviceUser ? () => navigate('/user-management') : undefined}
        >
          <img src={userAvatar} alt="User Avatar" className="user-avatar" />
          {showTooltip && <div className="tooltip">{userEmail}</div>}
        </div>
        <button 
          onClick={handleLogout}
          className="nav-link"
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            fontSize: 'inherit',
            fontFamily: 'inherit'
          }}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;