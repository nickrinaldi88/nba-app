// Game.jsx
import React from 'react';
// In Game.jsx
import './Game.css';

function Game({ game }) {
    return (
      <div className="game">
        <h2>{game.homeTeam} vs {game.awayTeam}</h2>
        <div className="score">
          <p>{game.homeTeam}: {game.homeTeamScore}</p>
          <p>{game.awayTeam}: {game.awayTeamScore}</p>
        </div>
        <div className="gameTime">
          <p>Game Time: {new Date(game.gameTimeUTC).toLocaleString()}</p>
        </div>
        <div className="leaders">
          <div>
            <h3>Home Leaders</h3>
            <p>Name: {game.homeLeaders.name}</p>
            <p>Points: {game.homeLeaders.points}</p>
            <p>Rebounds: {game.homeLeaders.rebounds}</p>
            <p>Assists: {game.homeLeaders.assists}</p>
          </div>
          <div>
            <h3>Away Leaders</h3>
            <p>Name: {game.awayLeaders.name}</p>
            <p>Points: {game.awayLeaders.points}</p>
            <p>Rebounds: {game.awayLeaders.rebounds}</p>
            <p>Assists: {game.awayLeaders.assists}</p>
          </div>
        </div>
      </div>
    );
  }
  

export default Game;
