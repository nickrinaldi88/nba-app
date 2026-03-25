import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">HOOPMOB</Link>
      <ul className="navbar-links">
        <li><NavLink to="/games" className={({ isActive }) => isActive ? 'active' : ''}>Games</NavLink></li>
        <li><NavLink to="/news"  className={({ isActive }) => isActive ? 'active' : ''}>News</NavLink></li>
      </ul>
    </nav>
  );
}

export default NavBar;
