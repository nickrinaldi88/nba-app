// GamesList.jsx
import React from 'react';
import Game from '../Game/Game';
// In GamesList.jsx
import './GamesList.css';


function GamesList({ games }) {
  return (
    <div className="gamesList">
      {games.map((game, index) => (
        <Game key={index} game={game} />
      ))}
    </div>
  );
}

export default GamesList;
