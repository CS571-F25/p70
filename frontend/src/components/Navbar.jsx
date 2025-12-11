'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import './Navbar.css';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push('/login');
    router.refresh();
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link 
          href="/"
          className="brand-wordmark"
          aria-label="PlayMaker - Go to homepage"
        >
          PlayMaker
        </Link>
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
        <div className="navbar-actions">
          {user ? (
            <div className="profile-menu-container">
              <button 
                className="profile-icon-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="profile-avatar">
                  {user.user_metadata?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>
              
              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user.user_metadata?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="dropdown-user-info">
                      <span className="dropdown-username">
                        {user.user_metadata?.username || 'User'}
                      </span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="dropdown-logout-btn">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="nav-btn login-btn">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

