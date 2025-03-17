import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import { gamesApi, tokenService } from "../services/api";
import "../css/Home.css";

const Home = ({ userId, user, setUser }) => {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState("all-games");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load Game Data and Check Authentication
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = tokenService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        // Load saved user data if not already in state
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
        setGames(Array.isArray(gamesData) ? gamesData : []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, setUser, user]);

  // Show loading state while data is being loaded
  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  // Filter games based on is_playable and category
  const filteredGames = games.filter(game => 
    game.is_playable &&
    (categoryFilter === "all" || game.category.toLowerCase() === categoryFilter)
  );

  return (
    <div className="home-container">
      <Navbar 
        userEmail={user?.email || 'User'} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      <div className="content">
        {activeTab === "all-games" ? (
          <>
            <div className="filter-container">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-filter"
              >
                <option value="all">All Categories</option>
                <option value="entertainment">Entertainment</option>
                <option value="educational">Education</option>
              </select>
            </div>
            <div className="games-grid">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => <GameCard key={game.id} {...game} />)
              ) : (
                <p className="no-games-text">
                  {categoryFilter === "all" 
                    ? "No games available. Please contact support for assistance."
                    : `No ${categoryFilter} games available.`}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="about-section">
            <h2>About BusyPad</h2>
            <p>This is the About section.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;