// GamesList.jsx
import React from 'react';
import Game from '../Game/Game';
// In GamesList.jsx
import './GamesList.css';


function GamesList({ games }) {
  if (!games.length) {
    return (
      <section className="games-empty" aria-live="polite">
        <h1>No NBA games today</h1>
        <p>Check back tomorrow for the next slate.</p>
      </section>
    );
  }

  return (
    <div className="gamesList">
      {games.map((game) => (
        <Game key={game.gameId} game={game} />
      ))}
    </div>
  );
}

export default GamesList;
