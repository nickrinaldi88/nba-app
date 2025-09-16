// src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router';
import './NavBar.css'; 

function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/games">Games</Link>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/boxscores">BoxScores</Link>
        </li>
        {/* <li>
          <Link to="/standings">Standings</Link>
        </li>
        <li>
          <Link to="/teams">Teams</Link>
        </li>
        <li>
          <Link to="/players-stats">Players/Stats</Link>
        </li>
        <li>
          <Link to="/favorites">Favorites</Link>
        </li>
        <li>
          <Link to="/injuries-transactions">Injuries/Transactions</Link>
        </li>
        <li>
          <Link to="/highlights">Highlights</Link>
        </li>
        <li>
          <Link to="/playoffs">Playoff Brackets</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/profile-settings">Profile/Settings</Link>
        </li> */}
      </ul>
    </nav>
  );
}

export default NavBar;
