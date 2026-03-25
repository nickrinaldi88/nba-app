import React, { useState, useEffect } from 'react';
import GamesList from './components/GamesList/GamesList';
import BoxScore from './components/BoxScore/BoxScore';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import NewsFeed from './components/Newsfeed/Newsfeed';
import './App.css';
import './theme.css';

function HomePage() {
  return (
    <div className="hero">
      <h1 className="hero-title">HOOPMOB</h1>
      <p className="hero-tagline">Your one-stop shop for all things hoops.</p>
      <div className="hero-actions">
        <Link to="/games" className="hero-btn hero-btn--primary">Today's Games</Link>
        <Link to="/news" className="hero-btn hero-btn--secondary">Latest News</Link>
      </div>
    </div>
  );
}

function App() {
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/games`)
      .then(response => {
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        return response.json();
      })
      .then(data => {
        setGames(data);
        setGamesLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setGamesError('Could not load games right now.');
        setGamesLoading(false);
      });
  }, []);

  return (
    <Router>
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/games"
            element={
              gamesLoading ? <p className="page-message">Loading games...</p>
              : gamesError ? <p className="page-message">{gamesError}</p>
              : <GamesList games={games} />
            }
          />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/boxscore/:gameId" element={<BoxScore />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
