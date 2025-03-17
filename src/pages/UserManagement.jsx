import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gamesData from "../data/games.json";
import Switch from "@mui/material/Switch";
import "../css/UserManagement.css";
import Navbar from "../components/Navbar";

const UserManagement = ({ user, setUser }) => {
  const [games, setGames] = useState([]);
  const [tempAllowList, setTempAllowList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Load user data if not in state
    if (!user) {
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        const parsedUserData = JSON.parse(savedUserData);
        setUser(parsedUserData);
        setTempAllowList(parsedUserData.allowList || []);
      } else {
        navigate('/login');
      }
    } else {
      setTempAllowList(user.allowList || []);
    }

    // Load games data
    setGames(Array.isArray(gamesData) ? gamesData : []);
  }, [user, navigate, setUser]);

  if (!user) {
    return (
      <div className="user-management-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  // Toggle Game in Allow List
  const toggleGame = (gameId) => {
    setTempAllowList((prevList) =>
      prevList.includes(gameId) ? prevList.filter((id) => id !== gameId) : [...prevList, gameId]
    );
  };

  // Confirm and Update Allow List
  const handleConfirm = () => {
    const updatedUser = { ...user, allowList: tempAllowList };
    setUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    
    navigate("/home");
  };

  return (
    <div className="user-management-container">
      <Navbar userEmail={user.email || 'User'} />
      <div className="user-management-content">
        <h2>User Management</h2>
        <div className="user-info">
          <p>Email: {user.email || 'Not provided'}</p>
          <p>Device Code: {user.deviceCode || 'Not provided'}</p>
        </div>

        <div className="allow-list-container">
          <h3>Parental Control</h3>
          <p className="help-text">Toggle switches to control which games appear on your home page.</p>
          <ul className="allow-list">
            {games.map((game) => (
              <li key={game.id} className="allow-list-item">
                <div className="game-info">
                  <img src={game.image} alt={game.title} className="game-thumbnail" />
                  <span>{game.title}</span>
                </div>
                <div className="switch-container">
                  <Switch
                    checked={tempAllowList.includes(game.id)}
                    onChange={() => toggleGame(game.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button className="confirm-button" onClick={handleConfirm}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default UserManagement;