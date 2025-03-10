import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import userAvatar from "../assets/avatar.png"; 

const Navbar = ({ userEmail }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <button className="menu-button" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <Link className="navbar-brand" to="/">BusyPad</Link>
      
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>All Games</Link>
        <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
      </div>

      <div
        className="user-avatar-container"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img src={userAvatar} alt="User Avatar" className="user-avatar" />
        {showTooltip && <div className="tooltip">{userEmail}</div>}
      </div>
    </nav>
  );
};

export default Navbar;