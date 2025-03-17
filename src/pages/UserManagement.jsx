import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "@mui/material/Switch";
import "../css/UserManagement.css";
import Navbar from "../components/Navbar";
import { gamesApi, userApi, tokenService } from "../services/api";

const UserManagement = ({ user, setUser }) => {
  const [games, setGames] = useState([]);
  const [tempGames, setTempGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = tokenService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        // Load user data if not in state
        if (!user) {
          const savedUserData = localStorage.getItem("userData");
          if (savedUserData) {
            setUser(JSON.parse(savedUserData));
          } else {
            navigate('/login');
            return;
          }
        }

        // Fetch games from API
        const gamesData = await gamesApi.getAllGames(token);
        const processedGames = Array.isArray(gamesData) ? gamesData : [];
        setGames(processedGames);
        setTempGames(processedGames);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, setUser]);

  // Toggle Game Status (temporary)
  const toggleGame = async (gameId) => {
    setTempGames(prevGames => {
      const newGames = prevGames.map(game => 
        game.id === gameId ? { ...game, is_playable: !game.is_playable } : game
      );
      setHasChanges(JSON.stringify(newGames) !== JSON.stringify(games));
      return newGames;
    });
  };

  // Save Changes
  const handleSaveChanges = async () => {
    try {
      setUpdating(true);
      const token = tokenService.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      // Find games that have changed status
      const changedGames = tempGames.filter(tempGame => {
        const originalGame = games.find(g => g.id === tempGame.id);
        return originalGame && originalGame.is_playable !== tempGame.is_playable;
      });

      // Toggle each changed game
      for (const game of changedGames) {
        await userApi.toggleGamePlayability(token, game.id);
      }

      // Navigate back to home page
      navigate('/home');
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <Navbar userEmail={user?.email || 'User'} />
      <div className="user-management-content">
        <h2>User Management</h2>
        <div className="user-info">
          <p>Email: {user?.email || 'Not provided'}</p>
        </div>

        <div className="allow-list-container">
          <h3>Game Access Control</h3>
          <p className="help-text">Toggle switches to control which games are playable.</p>
          <ul className="allow-list">
            {tempGames.map((game) => (
              <li key={game.id} className="allow-list-item">
                <div className="game-info">
                  <span className="game-name">{game.name}</span>
                  <span className={`game-status ${game.is_playable ? 'available' : 'locked'}`}>
                    {game.is_playable ? 'Available' : 'Locked'}
                  </span>
                </div>
                <div className="switch-container">
                  <Switch
                    checked={game.is_playable}
                    onChange={() => !updating && toggleGame(game.id)}
                    disabled={updating}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="button-container">
            <button 
              className={`save-button ${!hasChanges ? 'disabled' : ''}`}
              onClick={handleSaveChanges}
              disabled={!hasChanges || updating}
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;