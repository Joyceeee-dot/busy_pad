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
  const [currentGame, setCurrentGame] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
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

  const handleGameSelect = (game) => {
    setCurrentGame(game);
  };

  const handleCloseGame = () => {
    setCurrentGame(null);
  };

  // Filter games based on category
  const filteredGames = games.filter(game => 
    categoryFilter === "all" || game.category.toLowerCase() === categoryFilter
  );

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`home-container ${currentGame ? 'with-game' : ''}`}>
      {!currentGame && <PlayerNavbar userEmail={user?.email || 'Device User'} />}
      <div className="content">
        {currentGame ? (
          <div className="game-view">
            <div className="game-header">
              <h3>{currentGame.title}</h3>
              <button onClick={handleCloseGame} className="close-button">
                Back to Games
              </button>
            </div>
            <div className="game-frame-container">
              <iframe
                src={currentGame.url}
                title={currentGame.title}
                className="game-frame"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <>
            <div className="filter-container">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-filter"
              >
                <option value="all">All Categories</option>
                <option value="fun">Fun</option>
                <option value="educational">Education</option>
              </select>
            </div>
            <div className="games-grid">
              {error ? (
                <p className="error-text">{error}</p>
              ) : filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <GameCard 
                    key={game.id} 
                    {...game}
                    onPlay={() => handleGameSelect(game)}
                  />
                ))
              ) : (
                <p className="no-games-text">
                  {categoryFilter === "all" 
                    ? "No games available. Please contact support for assistance."
                    : `No ${categoryFilter} games available.`}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerHome;
