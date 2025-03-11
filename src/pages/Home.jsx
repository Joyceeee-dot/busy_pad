import { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import gamesData from "../data/games.json";
import "../css/Home.css";
//import { db } from "../firebase";  we will use this later

const Home = () => {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState("all-games");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Mock API
        setTimeout(() => {
          setGames(gamesData);
        }, 500);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter(game => {
    if (filter === "all") return true;
    return game.category === filter;
  });

  return (
    <div className="home-container">
      <Navbar userEmail="user@example.com" activeTab={activeTab} setActiveTab={setActiveTab}/>

      {/* Tab */}
      <div className="content">
        {activeTab === "all-games" ? (
          <div>
          {/* Select Filter */}
          <div className="filter-container">
            <label htmlFor="category">Category </label>
            <select id="category" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="entertainment">Entertainment</option>
              <option value="educational">Educational</option>
            </select>
          </div>

          {/* Games Grid */}
          <div className="games-grid">
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <GameCard key={game.id} {...game} />
                ))
              ) : (
                <p className="loading-text">No games found...</p>
              )}
            </div>
          </div> 
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