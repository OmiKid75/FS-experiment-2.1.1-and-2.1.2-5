import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '');

  return (
    <header className="navbar">
      <div className="navbar-brand">🎫 HelpDesk</div>
      <nav className="navbar-links">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/tickets" className={linkClass}>Tickets</NavLink>
        <NavLink to="/tickets/new" className={linkClass}>Create Ticket</NavLink>
      </nav>
    </header>
  );
}
