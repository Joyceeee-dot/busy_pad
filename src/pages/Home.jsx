import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import gamesData from "../data/games.json";
import "../css/Home.css";

const Home = ({ userId, user, setUser }) => {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState("all-games");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  // Load Game Data and Check Authentication
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
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
      }
    }

    // Set games data
    setGames(Array.isArray(gamesData) ? gamesData : []);
  }, [navigate, setUser, user]);

  // Show loading state while user data is being loaded
  if (!user) {
    return (
      <div className="home-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  // Filter games based on user's allowList and category
  const filteredGames = games.filter(game => 
    Array.isArray(user.allowList) && 
    user.allowList.includes(game.id) &&
    (categoryFilter === "all" || game.category === categoryFilter)
  );

  return (
    <div className="home-container">
      <Navbar 
        userEmail={user.email || 'User'} 
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
                    ? "No games in your Allow List. Visit User Management to add games."
                    : `No ${categoryFilter} games in your Allow List.`}
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