import { useNavigate } from "react-router-dom";
import { tokenService } from "../services/api";
import "../css/Navbar.css";

const PlayerNavbar = ({ userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenService.removeToken();
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">BusyPad</div>
      <div className="nav-links">
        <div className="nav-link active">Games</div>
      </div>
      <div className="user-section">
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

export default PlayerNavbar; 