import React, { useState, useEffect } from 'react';
import GamesList from './components/GamesList/GamesList'; // Adjust the path as necessary
import BoxScore from './components/BoxScore/BoxScore'; // BoxScorePage
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import BoxScorePage from './components/BoxScorePage/BoxScorePage';
import NavBar from './components/NavBar/NavBar'; 
import logo from './logo.svg';
import './App.css';
import './theme.css';


function App() {


  // Establish state to store the data fetched from Flask

  const [games, setGames] = useState([]);

  useEffect(() => {
    // Adjust the URL as necessary to match your Flask API's address and route
    fetch('http://127.0.0.1:5000/games') // Flask URL
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
    <Router>

    <NavBar />
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hoopmob
        </p>

       <Routes>
        {/* games route */}
        <Route 
          path="/"
          element={
            <p>Welcome to HoopMob, your one stop shop for all things
              HOOPS!
            </p>
          }
          />
      <Route
          path="/games"
          element={
          games.length > 0 
          ?  <GamesList games={games} />
          : <p>Loading games from Flask...</p>
        }
      />
      <Route 
          path="/news"
          element={
            <p>A news feed will go here. Maybe top reddit posts?
            </p>
          }
      />
       <Route
          path="/boxscore/:gameId"
          element={<BoxScore />}
      />
      <Route
          path="/boxscores"
          element={<BoxScore />}
      />
      </Routes>
      </header>
    </div>
  </Router>
  );
}

export default App;
