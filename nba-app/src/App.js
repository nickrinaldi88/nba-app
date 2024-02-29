import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {


  // Establish state to store the data fetched from Flask

  const [data, setData] = useState(null);

  useEffect(() => {
    // Adjust the URL as necessary to match your Flask API's address and route
    fetch('http://127.0.0.1:5000/nba/games') // Flask URL
      .then(response => response.json())
      .then(data => setData(data)) // Set the data into state
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty array means the effect runs once on mount


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Rinaldi Test
        </p>
        {/* Display data fetched from Flask */}
        {data ? (
          <div>
            {/* Assuming the data is just a simple text or object, adjust rendering based on your actual data structure */}
            <p>Data from Flask: {JSON.stringify(data)}</p>
          </div>
        ) : (
          <p>Loading data from Flask...</p>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
