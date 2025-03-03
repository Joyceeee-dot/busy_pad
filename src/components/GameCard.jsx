import axios from "axios";
import React from "react";
import "../css/GameCard.css";

const GameCard = ({ title, image, description, id }) => {
  const handlePlayNow = async () => {
    try {
      const response = await axios.post("http://backend-ip:5000/send-game", {
        gameId: id,
      });     //------Real API

      if (response.status === 200) {
        alert(`Game "${title}" is being sent to Raspberry Pi!`);
      } else {
        alert("Failed to send the game. Please try again.");
      }
    } catch (error) {
      console.error("Error sending game:", error);
      alert("An error occurred while sending the game.");
    }
  };

  return (
    <div className = "game-card-container">
      <img src={image} className="game-card-img" alt={title} />
      <div className="game-card-body">
        <h5 className="game-card-title">{title}</h5>
        <p className="game-card-text">{description}</p>
        <button className="play-now-btn" onClick = {handlePlayNow}>
          Play Now
        </button>
      </div>
    {/* <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
      <div className="card game-card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <button className="play-now-btn">Play Now</button>
        </div>
      </div>
    </div> */}
    </div>
  );
};

export default GameCard;