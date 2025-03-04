import { useState, useEffect } from "react";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import gamesData from "../data/games.json";
import "../css/Home.css";
//import { db } from "../firebase";  we will use this later

const Home = () => {
  const [games, setGames] = useState([]);
  const [activeTab, setActiveTab] = useState("all-games");

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

  return (
    <div className="home-container">
      <Navbar userEmail="user@example.com" activeTab={activeTab} setActiveTab={setActiveTab}/>

      {/* Tab */}
      <div className="content">
        {activeTab === "all-games" ? (
          <div className="games-grid">
            {games.length > 0 ? (
              games.map((game) => (
                <GameCard key={game.id} {...game} />
              ))
            ) : (
              <p className="loading-text">Loading games...</p>
            )}
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