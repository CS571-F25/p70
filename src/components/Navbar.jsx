import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span 
          className="brand-wordmark" 
          onClick={() => navigate('/')}
        >
          PlayMaker
        </span>
        <ul className="navbar-links">
          <li>
            <a 
              href="#" 
              className={`nav-link ${isActive('/overview') ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); navigate('/overview'); }}
            >
              Overview
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`nav-link ${isActive('/predictions') ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); navigate('/predictions'); }}
            >
              Predictions
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`nav-link ${isActive('/rating') ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); navigate('/rating'); }}
            >
              Rating
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); navigate('/profile'); }}
            >
              Profile
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
