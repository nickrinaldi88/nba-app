import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTeamSlug } from '../../data/teamNameMap';
import './BoxScore.css';

function getLogoPath(teamName) {
  const slug = getTeamSlug(teamName);
  if (!slug) return null;
  return `/assets/${slug}-logo.png`;
}

const LIVE_POLL_INTERVAL_MS = 30000;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pct(made, attempted) {
  if (!attempted) return '0.0';
  return ((made / attempted) * 100).toFixed(1);
}

function aggregateTeamStats(players = []) {
  return players.reduce(
    (totals, player) => {
      const s = player?.statistics || {};
      totals.points += toNumber(s.points);
      totals.rebounds += toNumber(s.reboundsTotal);
      totals.assists += toNumber(s.assists);
      totals.fgm += toNumber(s.fieldGoalsMade);
      totals.fga += toNumber(s.fieldGoalsAttempted);
      totals.tpm += toNumber(s.threePointersMade);
      totals.tpa += toNumber(s.threePointersAttempted);
      totals.ftm += toNumber(s.freeThrowsMade);
      totals.fta += toNumber(s.freeThrowsAttempted);
      return totals;
    },
    {
      points: 0,
      rebounds: 0,
      assists: 0,
      fgm: 0,
      fga: 0,
      tpm: 0,
      tpa: 0,
      ftm: 0,
      fta: 0,
    }
  );
}

function isGameFinal(statusText = '') {
  return statusText.toLowerCase().includes('final');
}

const BoxScore = () => {
  const { gameId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!gameId) {
      setError('No game selected.');
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    let poller;

    const fetchBoxScore = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/boxscore/${gameId}`);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const json = await response.json();
        if (cancelled) return;

        setData(json);
        setError('');
        setLoading(false);

        if (!isGameFinal(json?.game?.gameStatusText) && !poller) {
          poller = setInterval(fetchBoxScore, LIVE_POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Box score fetch error:', err);
        setError('Could not load box score right now.');
        setLoading(false);
      }
    };

    setLoading(true);
    fetchBoxScore();

    return () => {
      cancelled = true;
      if (poller) clearInterval(poller);
    };
  }, [gameId]);

  const game = data?.game;
  const homeTeam = game?.homeTeam;
  const awayTeam = game?.awayTeam;
  const arena = game?.arena;
  const localTipoff = game?.gameTimeLocal ? new Date(game.gameTimeLocal).toLocaleString() : 'TBD';
  const awayTotals = aggregateTeamStats(awayTeam?.players || []);
  const homeTotals = aggregateTeamStats(homeTeam?.players || []);

  if (loading) {
    return <BoxScoreSkeleton />;
  }

  if (error) {
    return (
      <div className="boxscore-message">
        <p>{error}</p>
        <Link to="/games" className="boxscore-back-link">Back to Games</Link>
      </div>
    );
  }

  if (!data?.game?.homeTeam || !data?.game?.awayTeam) {
    return <p className="boxscore-message">Box score not available yet.</p>;
  }

  return (
    <section className="boxscore-container">
      <div className="boxscore-header">
        <Link to="/games" className="boxscore-back-link">Back to Games</Link>
        <div className="boxscore-matchup">
          <div className="boxscore-team">
            {getLogoPath(awayTeam.teamName) && (
              <img src={getLogoPath(awayTeam.teamName)} alt={awayTeam.teamName} className="boxscore-logo" />
            )}
            <span>{awayTeam.teamCity} {awayTeam.teamName}</span>
          </div>
          <div className="boxscore-matchup-center">
            <span className="boxscore-matchup-score">{awayTeam.score} — {homeTeam.score}</span>
            <span className="boxscore-status">{game.gameStatusText}</span>
          </div>
          <div className="boxscore-team boxscore-team--home">
            {getLogoPath(homeTeam.teamName) && (
              <img src={getLogoPath(homeTeam.teamName)} alt={homeTeam.teamName} className="boxscore-logo" />
            )}
            <span>{homeTeam.teamCity} {homeTeam.teamName}</span>
          </div>
        </div>
        <p className="boxscore-arena">
          {arena?.arenaName}, {arena?.arenaCity}, {arena?.arenaState} · {localTipoff}
        </p>
      </div>

      <div className="boxscore-summary">
        <TeamSummary team={awayTeam} title="Away" totals={awayTotals} />
        <TeamSummary team={homeTeam} title="Home" totals={homeTotals} />
      </div>

      <h2 className="boxscore-section-title">Player Stats</h2>
      <PlayerStats team={awayTeam} />
      <PlayerStats team={homeTeam} />
    </section>
  );
};

const TeamSummary = ({ team, title, totals }) => (
  <article className="team-summary">
    <div className="team-summary-header">
      {getLogoPath(team.teamName) && (
        <img src={getLogoPath(team.teamName)} alt={team.teamName} className="team-summary-logo" />
      )}
      <h3>{team.teamCity} {team.teamName} <span className="team-summary-label">{title}</span></h3>
    </div>
    <p className="team-score">Score: {team.score ?? '-'}</p>
    <p className="team-periods">
      {(team.periods || []).map((period, i) => `Q${i + 1}: ${period.score ?? 0}`).join(' | ')}
    </p>
    <div className="team-totals">
      <span>PTS {totals.points}</span>
      <span>REB {totals.rebounds}</span>
      <span>AST {totals.assists}</span>
      <span>FG {totals.fgm}/{totals.fga} ({pct(totals.fgm, totals.fga)}%)</span>
      <span>3PT {totals.tpm}/{totals.tpa} ({pct(totals.tpm, totals.tpa)}%)</span>
      <span>FT {totals.ftm}/{totals.fta} ({pct(totals.ftm, totals.fta)}%)</span>
    </div>
  </article>
);

const PlayerStats = ({ team }) => {
  const players = (team.players || []).filter((player) => player?.statistics?.minutesCalculated);

  if (players.length === 0) {
    return (
      <section className="player-stats-wrap">
        <h3>{team.teamCity} {team.teamName}</h3>
        <p className="boxscore-message">No player stats available yet.</p>
      </section>
    );
  }

  return (
    <section className="player-stats-wrap">
      <h3>{team.teamCity} {team.teamName}</h3>
      <div className="player-table-scroll">
        <table className="player-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Pos</th>
              <th>MIN</th>
              <th>PTS</th>
              <th>REB</th>
              <th>AST</th>
              <th>FG</th>
              <th>3PT</th>
              <th>FT</th>
              <th>+/-</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const stats = player.statistics || {};
              return (
                <tr key={player.personId}>
                  <td>{player.name || '-'}</td>
                  <td>{player.position || '-'}</td>
                  <td>{stats.minutesCalculated || '0:00'}</td>
                  <td>{stats.points ?? 0}</td>
                  <td>{stats.reboundsTotal ?? 0}</td>
                  <td>{stats.assists ?? 0}</td>
                  <td>{stats.fieldGoalsMade ?? 0}/{stats.fieldGoalsAttempted ?? 0}</td>
                  <td>{stats.threePointersMade ?? 0}/{stats.threePointersAttempted ?? 0}</td>
                  <td>{stats.freeThrowsMade ?? 0}/{stats.freeThrowsAttempted ?? 0}</td>
                  <td>{stats.plusMinusPoints ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const BoxScoreSkeleton = () => (
  <section className="boxscore-container">
    <div className="skeleton skeleton-back-link" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-subtitle" />

    <div className="boxscore-summary">
      <div className="skeleton skeleton-team-card" />
      <div className="skeleton skeleton-team-card" />
    </div>

    <div className="skeleton skeleton-section-title" />
    <div className="skeleton-table">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton skeleton-row" />
      ))}
    </div>

    <div className="skeleton skeleton-section-title" style={{ marginTop: '2rem' }} />
    <div className="skeleton-table">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton skeleton-row" />
      ))}
    </div>
  </section>
);

export default BoxScore;
