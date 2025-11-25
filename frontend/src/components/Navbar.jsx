'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './Navbar.css';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't render Navbar on the landing page
  // if (pathname === '/') {
  //   return null;
  // }

  const isActive = (path) => pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span 
          className="brand-wordmark" 
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          PlayMaker
        </span>
        <ul className="navbar-links">
          <li>
            <Link 
              href="/overview" 
              className={`nav-link ${isActive('/overview') ? 'active' : ''}`}
            >
              Overview
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href="/predictions" 
              className={`nav-link ${isActive('/predictions') ? 'active' : ''}`}
            >
              Predictions
            </Link>
          </li>
          <li>
            <Link 
              href="/rating" 
              className={`nav-link ${isActive('/rating') ? 'active' : ''}`}
            >
              Rating
            </Link>
          </li>
          <li>
            <Link 
              href="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

