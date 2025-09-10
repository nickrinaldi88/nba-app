// Game.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// In Game.jsx
import './Game.css';
import { getTeamSlug } from '../../data/teamNameMap';

function getLogoPath(teamName) {
  const slug = getTeamSlug(teamName);

  // If no slug found, fallback
  if (!slug) {
    return '/assets/default.png';
  }

  // Otherwise, standard pattern: "<slug>-logo.png"
  return `/assets/${slug}-logo.png`;
}

// game object
function Game({ game }) {

  const homeLogo = getLogoPath(game.homeTeam);
  const awayLogo = getLogoPath(game.awayTeam);

    return (
      <Link to={`/game/${game.gameId}`} className="game-link">
      <div className="game">
        <h2>{game.homeTeam} vs {game.awayTeam}</h2>
      <div className="team-logos">
        <img src={homeLogo} alt={`${game.homeTeam} logo`} />
        <img src={awayLogo} alt={`${game.awayTeam} logo`} />
      </div>
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
            <p>{game.homeLeaders.name}</p>
            <p>Points: {game.homeLeaders.points}</p>
            <p>Rebounds: {game.homeLeaders.rebounds}</p>
            <p>Assists: {game.homeLeaders.assists}</p>
          </div>
          <div>
            <h3>Away Leaders</h3>
            <p>{game.awayLeaders.name}</p>
            <p>Points: {game.awayLeaders.points}</p>
            <p>Rebounds: {game.awayLeaders.rebounds}</p>
            <p>Assists: {game.awayLeaders.assists}</p>
          </div>
        </div>
      </div>
      </Link>
    );
  }
  

export default Game;
