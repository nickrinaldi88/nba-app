import React, { useState, useEffect } from 'react';
import GamesList from './components/GamesList/GamesList'; // Adjust the path as necessary
import logo from './logo.svg';
import './App.css';

function App() {


  // Establish state to store the data fetched from Flask

  const [games, setGames] = useState([]);

  useEffect(() => {
    // Adjust the URL as necessary to match your Flask API's address and route
    fetch('http://127.0.0.1:5000/nba/games') // Flask URL
      .then(response => response.json())
      .then(games => {
        setGames(games);
        console.log(games);
       }) // Set the data into state
      // .then(games => {
      //   console.log(games);
      // })
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty array means the effect runs once on mount


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Rinaldi Test
        </p>
        <p>
        </p>
        {/* Check if games data is loaded and display GamesList */}
        {games.length > 0 ? (
          <GamesList games={games} />
        ) : (
          <p>Loading games from Flask...</p>
        )}
      
      </header>
    </div>
  );
}

export default App;
