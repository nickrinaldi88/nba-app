import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Rinaldi Test
        </p>
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


// import React, { useEffect, useState } from 'react';

// function NBAResults() {
//     const [games, setGames] = useState([]);

//     useEffect(() => {
//         fetch('API_ENDPOINT_HERE')
//             .then(response => response.json())
//             .then(data => setGames(data.games)) // Adjust based on actual API response structure
//             .catch(error => console.error('Error fetching data:', error));
//     }, []);

//     return (
//         <div>
//             <h1>Current NBA Results</h1>
//             <ul>
//                 {games.map(game => (
//                     <li key={game.id}>{game.homeTeam} vs {game.awayTeam} - {game.score}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default NBAResults;
