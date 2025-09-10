import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Box score object
const BoxScorePage = () => {
  const { gameId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/nba/box_score/${gameId}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Box score fetch error:", err);
        setLoading(false);
      });
 }, [gameId]);

  if (loading) return <p>Loading box score...</p>;
  if (!data || !data.game) return <p>Box score not available.</p>;

  const { game } = data;
  const { homeTeam, awayTeam, arena } = game;

    return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {awayTeam.teamCity} {awayTeam.teamName} @ {homeTeam.teamCity} {homeTeam.teamName}
      </h1>
      <p className="text-gray-600 mb-4">{game.gameStatusText} • {new Date(game.gameTimeLocal).toLocaleString()}</p>
      <p className="text-sm text-gray-500 mb-6">Arena: {arena.arenaName}, {arena.arenaCity}, {arena.arenaState}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TeamSummary team={awayTeam} title="Away" />
        <TeamSummary team={homeTeam} title="Home" />
      </div>

      <h2 className="text-xl font-semibold mb-2">Player Stats</h2>
      <PlayerStats team={awayTeam} />
      <PlayerStats team={homeTeam} />
    </div>
  );
};

// team summary
const TeamSummary = ({ team, title }) => (
  <div className="bg-white p-4 rounded shadow-md">
    <h3 className="text-lg font-semibold mb-2">{title}: {team.teamCity} {team.teamName}</h3>
    <p className="font-medium text-lg">Final Score: {team.score}</p>
    <div className="text-sm text-gray-700 mt-2">
      {team.periods.map((p, i) => (
        <span key={i} className="inline-block mr-2">Q{i + 1}: {p.score}</span>
      ))}
    </div>
  </div>
);

// Player stats table
const PlayerStats = ({ team }) => (
  <div className="overflow-x-auto mb-8">
    <h3 className="text-md font-semibold mb-1">{team.teamCity} {team.teamName}</h3>
    <table className="w-full text-sm border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Player</th>
          <th className="p-2">Min</th>
          <th className="p-2">PTS</th>
          <th className="p-2">REB</th>
          <th className="p-2">AST</th>
          <th className="p-2">FG</th>
          <th className="p-2">3PT</th>
          <th className="p-2">FT</th>
          <th className="p-2">+/-</th>
        </tr>
      </thead>
      <tbody>
        {team.players.map((player) => {
          const stats = player.statistics;
          return (
            <tr key={player.personId} className="border-t">
              <td className="p-2">{player.name}</td>
              <td className="p-2">{stats.minutesCalculated}</td>
              <td className="p-2">{stats.points}</td>
              <td className="p-2">{stats.reboundsTotal}</td>
              <td className="p-2">{stats.assists}</td>
              <td className="p-2">{stats.fieldGoalsMade}/{stats.fieldGoalsAttempted}</td>
              <td className="p-2">{stats.threePointersMade}/{stats.threePointersAttempted}</td>
              <td className="p-2">{stats.freeThrowsMade}/{stats.freeThrowsAttempted}</td>
              <td className="p-2">{stats.plusMinusPoints}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default BoxScorePage;