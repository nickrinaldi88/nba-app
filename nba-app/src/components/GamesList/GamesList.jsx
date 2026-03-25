// GamesList.jsx
import React from 'react';
import Game from '../Game/Game';
// In GamesList.jsx
import './GamesList.css';


function GamesList({ games }) {
  return (
    <div className="gamesList">
      {games.map((game) => (
        <Game key={game.gameId} game={game} />
      ))}
    </div>
  );
}

export default GamesList;
