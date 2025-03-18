import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import PlayerNavbar from "../components/PlayerNavbar";
import { gamesApi, tokenService } from "../services/api";
import "../css/Home.css";

const PlayerHome = ({ user, setUser }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = tokenService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const gamesData = await gamesApi.getPlayerGames(token);
        setGames(gamesData);
        setError(null);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
        if (error.message === 'Session expired') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <PlayerNavbar userEmail={user?.email || 'Device User'} />
      <div className="content">
        <div className="games-grid">
          {error ? (
            <p className="error-text">{error}</p>
          ) : games.length > 0 ? (
            games.map((game) => (
              <GameCard 
                key={game.id} 
                {...game}
              />
            ))
          ) : (
            <p className="no-games-text">
              No games available. Please contact support for assistance.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerHome;
