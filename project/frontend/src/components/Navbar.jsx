import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, LogOut, User, Hop as Home, Calendar } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <Film style={{ display: 'inline', marginRight: '8px' }} />
          FLYXO
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">
              <Home size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Home
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/bookings" className="navbar-link">
                  <Calendar size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  My Bookings
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="navbar-link">
                    <User size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                  <LogOut size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Logout
                </button>
              </li>
            </>
          )}
          {!user && (
            <>
              <li>
                <Link to="/login" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
