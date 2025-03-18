import React from "react";
import "../css/GameCard.css";

const GameCard = ({ title, description, image_url, id, is_playable }) => {
  const handlePlayNow = async () => {
    if (!is_playable) {
      alert("This game is currently locked. Please contact support for access.");
      return;
    }

    try {
      // TODO: Implement game launch logic
      console.log(`Launching game: ${title}`);
      alert(`Game "${title}" is being launched!`);
    } catch (error) {
      console.error("Error launching game:", error);
      alert("An error occurred while launching the game.");
    }
  };

  const handleImageError = (e) => {
    console.error(`Error loading image for game: ${title}`, e);
    e.target.src = './images/game-place-holder.jpg';
  };

  return (
    <div className="game-card-container">
      <div className="game-card-image">
        <img 
          src={image_url} 
          alt={title} 
          onError={handleImageError}
        />
        {!is_playable && <div className="game-locked-overlay">
          <span>🔒</span>
        </div>}
      </div>
      <div className="game-card-body">
        <h5 className="game-card-title">{title}</h5>
        <p className="game-card-description">{description}</p>
        <div className="game-card-status">
          {/* <span className={`status-badge ${is_playable ? 'available' : 'locked'}`}>
            {is_playable ? 'Available' : 'Locked'}
          </span> */}
        </div>
        <button 
          className={`play-now-btn ${!is_playable ? 'locked' : ''}`} 
          onClick={handlePlayNow}
          disabled={!is_playable}
        >
          {is_playable ? 'Play Now' : 'Locked'}
        </button>
      </div>
    </div>
  );
};

export default GameCard;