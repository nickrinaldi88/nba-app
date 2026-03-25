import { Link } from 'react-router-dom';
import './Game.css';
import { getTeamSlug } from '../../data/teamNameMap';

function getLogoPath(teamName) {
  const slug = getTeamSlug(teamName);
  if (!slug) return '/assets/default.png';
  return `/assets/${slug}-logo.png`;
}

function StatusBadge({ status, statusText, gameTimeUTC }) {
  if (status === 2) {
    return <span className="status-badge status-badge--live">LIVE · {statusText}</span>;
  }
  if (status === 3) {
    return <span className="status-badge status-badge--final">Final</span>;
  }
  // Upcoming — show local tipoff time
  const time = new Date(gameTimeUTC).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return <span className="status-badge status-badge--upcoming">{time}</span>;
}

function Game({ game }) {
  const homeLogo = getLogoPath(game.homeTeam);
  const awayLogo = getLogoPath(game.awayTeam);

  return (
    <Link to={`/boxscore/${game.gameId}`} className="game-link">
      <div className="game">

        <div className="game-matchup">
          <div className="game-team">
            <img src={awayLogo} alt={`${game.awayTeam} logo`} />
            <span className="team-name">{game.awayTeam}</span>
            <span className="team-record">{game.awayTeamRecord}</span>
          </div>

          <div className="game-center">
            <div className="game-score">
              <span>{game.awayTeamScore}</span>
              <span className="score-divider">—</span>
              <span>{game.homeTeamScore}</span>
            </div>
            <StatusBadge
              status={game.gameStatus}
              statusText={game.gameStatusText}
              gameTimeUTC={game.gameTimeUTC}
            />
          </div>

          <div className="game-team game-team--home">
            <img src={homeLogo} alt={`${game.homeTeam} logo`} />
            <span className="team-name">{game.homeTeam}</span>
            <span className="team-record">{game.homeTeamRecord}</span>
          </div>
        </div>

        <div className="game-leaders">
          <span>{game.awayLeaders.name} · {game.awayLeaders.points}/{game.awayLeaders.rebounds}/{game.awayLeaders.assists}</span>
          <span>{game.homeLeaders.name} · {game.homeLeaders.points}/{game.homeLeaders.rebounds}/{game.homeLeaders.assists}</span>
        </div>

      </div>
    </Link>
  );
}

export default Game;
