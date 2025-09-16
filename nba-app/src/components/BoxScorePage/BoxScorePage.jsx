// src/components/BoxScorePage/BoxScorePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BoxScorePage.css';

const BoxScorePage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/boxscores')
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching games:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading box scores...</p>;

  return (
    <div className="boxscore-list-container">
        <Link to="/games" className="back-link">← Back to Games</Link>

      <h1 className="title">Today's Box Scores</h1>
      
      <section className="test-boxscore-section">
        <h2>Test Box Score</h2>
        <div className="boxscore-list">
          <Link to={`/boxscore/0022301221`} className="boxscore-link">
            New York Knicks @ Cleveland Cavaliers (Sample Game)
          </Link>
        </div>
      </section>

      <section className="live-boxscore-section">
        <h2>Today's Box Scores</h2>
        {games.length === 0 ? (
          <p>No live games found today.</p>
        ) : (
          <ul className="boxscore-list">
            {games.map((game) => (
              <li key={game.gameId}>
                <Link to={`/boxscore/${game.gameId}`} className="boxscore-link">
                  {game.awayTeam} ({game.awayTeamScore}) @ {game.homeTeam} ({game.homeTeamScore})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BoxScorePage;
