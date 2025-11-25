'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getPendingPredictions, getLockedPredictions, deletePrediction, lockPrediction } from '../../utils/predictionStorage';
import '../../pages/Dashboard.css';

function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    loadPredictions();
    window.addEventListener('focus', loadPredictions);
    return () => window.removeEventListener('focus', loadPredictions);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const loadPredictions = () => {
    const pending = getPendingPredictions();
    const locked = getLockedPredictions();
    setPredictions([...locked, ...pending]);
  };

  const handleDeletePrediction = (predictionId, isLocked) => {
    if (isLocked) {
      if (window.confirm('This is a locked prediction. Deleting will forfeit potential ELO gains. Are you sure?')) {
        deletePrediction(predictionId);
        loadPredictions();
      }
    } else {
      deletePrediction(predictionId);
      loadPredictions();
    }
  };

  const handleLockPrediction = (predictionId) => {
    setShowConfirm(predictionId);
  };

  const confirmLock = () => {
    if (showConfirm) {
      lockPrediction(showConfirm);
      loadPredictions();
      setShowConfirm(null);
    }
  };

  const cancelLock = () => {
    setShowConfirm(null);
  };

  const filteredPredictions = predictions.filter(p => {
    if (filter === 'pending') return p.status === 'pending';
    if (filter === 'locked') return p.status === 'locked';
    return true;
  });

  const pendingCount = predictions.filter(p => p.status === 'pending').length;
  const lockedCount = predictions.filter(p => p.status === 'locked').length;

  const [userData] = useState({
    username: user?.email?.split('@')[0] || 'PlayMaker',
    elo: 1847,
    wins: 42,
    losses: 18,
    currentStreak: 5,
    streakType: 'win',
    rank: 'Diamond',
    tier: 'III'
  });

  const totalGames = userData.wins + userData.losses;
  const winRate = totalGames > 0 ? ((userData.wins / totalGames) * 100).toFixed(1) : 0;

  const getRankColor = (rank) => {
    const rankColors = {
      'Bronze': '#CD7F32',
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Platinum': '#E5E4E2',
      'Diamond': '#3B82F6',
      'Master': '#A3FF12',
      'Grandmaster': '#FF006E'
    };
    return rankColors[rank] || '#3B82F6';
  };

  return (
    <div className="dashboard-page">
      <div className="stats-header">
        <div className="stats-header-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem', alignItems: 'center' }}>
             <div className="user-welcome" style={{ color: '#fff', fontSize: '1.2rem' }}>
                Welcome, <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>{user?.user_metadata?.username || user?.email}</span>
             </div>
          </div>

          <div className="elo-display">
            <div className="elo-label">ELO Rating</div>
            <div className="elo-value">{userData.elo}</div>
            <div className="elo-change">+24 today</div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-label">Win/Loss</div>
                <div className="stat-value">{userData.wins}W - {userData.losses}L</div>
                <div className="stat-subtext">{winRate}% Win Rate</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">{userData.streakType === 'win' ? '🔥' : '❄️'}</div>
              <div className="stat-content">
                <div className="stat-label">Current Streak</div>
                <div className={`stat-value ${userData.streakType === 'win' ? 'streak-win' : 'streak-loss'}`}>
                  {userData.currentStreak} {userData.streakType === 'win' ? 'Wins' : 'Losses'}
                </div>
                <div className="stat-subtext">{userData.streakType === 'win' ? 'Keep it going!' : 'Bounce back!'}</div>
              </div>
            </div>

            <div className="stat-card rank-card">
              <div className="rank-badge" style={{ borderColor: getRankColor(userData.rank) }}>
                <div className="rank-icon" style={{ color: getRankColor(userData.rank) }}>👑</div>
                <div className="rank-content">
                  <div className="rank-name" style={{ color: getRankColor(userData.rank) }}>
                    {userData.rank}
                  </div>
                  <div className="rank-tier">{userData.tier}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="dashboard-section active-picks-section">
            <div className="section-header">
              <h2 className="section-title">Active Picks</h2>
              <span className="section-badge">
                {pendingCount} pending, {lockedCount} locked
              </span>
            </div>

            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({predictions.length})
              </button>
              <button 
                className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({pendingCount})
              </button>
              <button 
                className={`filter-tab ${filter === 'locked' ? 'active' : ''}`}
                onClick={() => setFilter('locked')}
              >
                Locked ({lockedCount})
              </button>
            </div>
            
            {filteredPredictions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏀</div>
                <h3>No {filter === 'all' ? 'Active' : filter.charAt(0).toUpperCase() + filter.slice(1)} Predictions</h3>
                <p>Head to Predictions page to make your picks!</p>
                <button className="nav-button" onClick={() => router.push('/predictions')}>
                  Make Predictions
                </button>
              </div>
            ) : (
              <div className="predictions-grid">
                {filteredPredictions.map(pred => {
                  const gameTime = new Date(pred.commenceTime);
                  const isToday = gameTime.toDateString() === new Date().toDateString();
                  const isLocked = pred.status === 'locked';
                  
                  return (
                    <div key={pred.id} className={`prediction-card ${isLocked ? 'locked' : ''}`}>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeletePrediction(pred.id, isLocked)}
                        title={isLocked ? "Delete locked prediction" : "Cancel prediction"}
                      >
                        ✕
                      </button>
                      
                      <div className="game-header">
                        <div className="game-time">
                          <span className="date">{gameTime.toLocaleDateString()}</span>
                          <span className="time">{gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isToday && <span className="today-badge">TODAY</span>}
                        </div>
                      </div>

                      <div className="teams-section">
                        <div className="team">
                          <span className="team-name">{pred.awayTeam}</span>
                          <span className="team-label">AWAY</span>
                        </div>
                        <div className="vs-divider">@</div>
                        <div className="team">
                          <span className="team-name">{pred.homeTeam}</span>
                          <span className="team-label">HOME</span>
                        </div>
                      </div>

                      <div className="bet-details">
                        <div className={`bet-type-badge ${pred.betType}`}>
                          {pred.betType === 'moneyline' ? 'Moneyline' : 
                           pred.betType === 'spread' ? 'Spread' : 'Total Points'}
                        </div>
                        
                        <div className="your-pick">
                          <span className="pick-label">Your Pick:</span>
                          <span className="pick-value">
                            {pred.selection}
                            {pred.point && ` (${pred.point > 0 ? '+' : ''}${pred.point})`}
                            {' '}@ {pred.odds > 0 ? '+' : ''}{pred.odds}
                          </span>
                        </div>
                      </div>

                      <div className="prediction-footer">
                        {isLocked ? (
                          <span className="status-badge locked">🔒 LOCKED</span>
                        ) : (
                          <>
                            <span className="status-badge pending">PENDING</span>
                            <button 
                              className="lock-btn"
                              onClick={() => handleLockPrediction(pred.id)}
                            >
                              🔓 Lock Pick
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="dashboard-section quick-actions-section">
            <div className="section-header">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            <div className="section-placeholder-box">
              <p>Quick Actions content coming soon...</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section friends-section">
          <div className="section-header">
            <h2 className="section-title">Friends Leaderboard</h2>
            <span className="section-badge">12 friends</span>
          </div>
          <div className="section-placeholder-box">
            <p>Friends Leaderboard content coming soon...</p>
          </div>
        </div>

        <div className="dashboard-section recent-results-section">
          <div className="section-header">
            <h2 className="section-title">Recent Results</h2>
          </div>
          <div className="section-placeholder-box">
            <p>Recent Results content coming soon...</p>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="lock-confirmation-overlay">
          <div className="lock-confirmation-modal">
            <h3>🔒 Lock This Prediction?</h3>
            <p>You won't be able to change or delete it.</p>
            <p className="confirm-note">This pick will count towards your ELO rating!</p>
            <div className="confirm-buttons">
              <button className="confirm-lock-btn" onClick={confirmLock}>
                Confirm Lock
              </button>
              <button className="cancel-lock-btn" onClick={cancelLock}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
