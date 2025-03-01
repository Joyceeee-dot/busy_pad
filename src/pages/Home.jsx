import { useState, useEffect } from "react";
import axios from "axios";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import gamesData from "../data/games.json";

const Home = () => {
  const [games, setGames] = useState([]);
  const API_URL = "http://backend-ip:5000/games"; // Real API

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
    <div>
      <Navbar />

      {/* main content */}
      <div className="container mt-5 pt-4 text-center">
        <h1 className="text-center mb-4">All Games</h1>

        {/*  GameCard */}
        <div className="row justify-content-center gx-4 gy-4">
          {games.length > 0 ? (
            games.map((game) => (
              <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center" key={game.id}>
                <GameCard {...game} />
              </div>
            ))
          ) : (
            <p className="text-center">Loading games...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;