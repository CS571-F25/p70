'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUserProfile, updateUserProfile } from '@/utils/supabase/database';
import Link from 'next/link';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        setNewUsername(userProfile?.username || '');
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setMessage({ type: 'error', text: 'Username cannot be empty' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    const updatedProfile = await updateUserProfile({ username: newUsername.trim() });
    
    if (updatedProfile) {
      setProfile(updatedProfile);
      setEditing(false);
      setMessage({ type: 'success', text: 'Username updated successfully!' });
    } else {
      setMessage({ type: 'error', text: 'Failed to update username. Try again.' });
    }
    
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const getRankTitle = (elo) => {
    if (elo >= 2000) return { title: 'Legend', emoji: '👑' };
    if (elo >= 1700) return { title: 'Expert', emoji: '🏆' };
    if (elo >= 1400) return { title: 'Pro', emoji: '⭐' };
    if (elo >= 1100) return { title: 'Rising Star', emoji: '📈' };
    return { title: 'Rookie', emoji: '🌱' };
  };

  const getWinRate = () => {
    if (!profile) return 0;
    const total = profile.wins + profile.losses;
    if (total === 0) return 0;
    return ((profile.wins / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-login-prompt">
          <h2>🔒 Sign In Required</h2>
          <p>Please sign in to view your profile.</p>
          <Link href="/login" className="login-button">Sign In</Link>
        </div>
      </div>
    );
  }

  const rank = getRankTitle(profile?.elo || 1000);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {(profile?.username || user.email)?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="profile-info">
            {editing ? (
              <div className="edit-username">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  className="username-input"
                  maxLength={20}
                />
                <div className="edit-buttons">
                  <button onClick={handleSaveUsername} disabled={saving} className="save-btn">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => { setEditing(false); setNewUsername(profile?.username || ''); }} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="username-display">
                <h1>{profile?.username || 'Set Username'}</h1>
                <button onClick={() => setEditing(true)} className="edit-btn">✏️ Edit</button>
              </div>
            )}
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="profile-stats">
          <div className="stat-card elo-card">
            <span className="stat-emoji">{rank.emoji}</span>
            <div className="stat-content">
              <span className="stat-value">{profile?.elo || 1000}</span>
              <span className="stat-label">ELO Rating</span>
              <span className="stat-rank">{rank.title}</span>
            </div>
          </div>

          <div className="stat-card wins-card">
            <span className="stat-emoji">✅</span>
            <div className="stat-content">
              <span className="stat-value">{profile?.wins || 0}</span>
              <span className="stat-label">Wins</span>
            </div>
          </div>

          <div className="stat-card losses-card">
            <span className="stat-emoji">❌</span>
            <div className="stat-content">
              <span className="stat-value">{profile?.losses || 0}</span>
              <span className="stat-label">Losses</span>
            </div>
          </div>

          <div className="stat-card winrate-card">
            <span className="stat-emoji">📊</span>
            <div className="stat-content">
              <span className="stat-value">{getWinRate()}%</span>
              <span className="stat-label">Win Rate</span>
            </div>
          </div>
        </div>

        {/* ELO Progress */}
        <div className="elo-progress-section">
          <h3>ELO Progress</h3>
          <div className="elo-progress-bar">
            <div className="elo-tiers">
              <span className={profile?.elo < 1100 ? 'active' : ''}>Rookie</span>
              <span className={profile?.elo >= 1100 && profile?.elo < 1400 ? 'active' : ''}>Rising Star</span>
              <span className={profile?.elo >= 1400 && profile?.elo < 1700 ? 'active' : ''}>Pro</span>
              <span className={profile?.elo >= 1700 && profile?.elo < 2000 ? 'active' : ''}>Expert</span>
              <span className={profile?.elo >= 2000 ? 'active' : ''}>Legend</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(((profile?.elo || 1000) / 2500) * 100, 100)}%` }}
              ></div>
              <div 
                className="progress-marker"
                style={{ left: `${Math.min(((profile?.elo || 1000) / 2500) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="profile-links">
          <Link href="/predictions" className="profile-link predictions-link">
            🏀 Make Predictions
          </Link>
          <Link href="/dashboard" className="profile-link dashboard-link">
            📊 View Dashboard
          </Link>
        </div>

        {/* Sign Out */}
        <button onClick={handleSignOut} className="signout-button">
          Sign Out
        </button>

        {/* Account Info */}
        <div className="account-info">
          <h3>Account Information</h3>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Member Since</span>
            <span className="info-value">
              {profile?.created_at 
                ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : 'N/A'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">User ID</span>
            <span className="info-value user-id">{user.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
