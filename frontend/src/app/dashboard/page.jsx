'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  getUserPicks, 
  deletePick, 
  lockPick,
  getUserProfile,
  getOrCreateProfile,
  getPicksToValidate,
  validateAndUpdatePick
} from '../../utils/supabase/database';
import { validationService } from '../../services/validationService';
import './Dashboard.css';

function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showConfirm, setShowConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validationResults, setValidationResults] = useState([]);
  const [showValidationToast, setShowValidationToast] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
      } else {
        setUser(user);
        const userProfile = await getOrCreateProfile();
        setProfile(userProfile);
        await loadPredictions();
      }
      setLoading(false);
    };
    getUser();
  }, [router, supabase]);

  const loadPredictions = async () => {
    const picks = await getUserPicks();
    setPredictions(picks);
  };

  const handleDeletePrediction = async (predictionId, isLocked) => {
    if (isLocked) {
      if (window.confirm('This is a locked prediction. Deleting will forfeit potential ELO gains. Are you sure?')) {
        // Note: locked picks cannot be deleted via database rules
        // But we show the warning anyway
        await deletePick(predictionId);
        await loadPredictions();
      }
    } else {
      await deletePick(predictionId);
      await loadPredictions();
    }
  };

  const handleLockPrediction = (predictionId) => {
    setShowConfirm(predictionId);
  };

  const confirmLock = async () => {
    if (showConfirm) {
      await lockPick(showConfirm);
      await loadPredictions();
      setShowConfirm(null);
    }
  };

  const cancelLock = () => {
    setShowConfirm(null);
  };

  // Validate all locked picks that have completed games
  const handleValidateResults = async () => {
    setValidating(true);
    setValidationResults([]);
    
    try {
      // Get all locked picks that need validation
      const picksToValidate = await getPicksToValidate();
      
      if (picksToValidate.length === 0) {
        setValidationMessage('No picks to validate. Lock some picks first!');
        setShowValidationToast(true);
        setTimeout(() => setShowValidationToast(false), 3000);
        setValidating(false);
        return;
      }
      
      // Get game results from API
      const results = await validationService.validatePicks(picksToValidate);
      
      let validated = 0;
      let totalEloChange = 0;
      const newResults = [];
      
      // Process each result
      for (const validationResult of results) {
        if (validationResult.result && validationResult.result !== null) {
          // Update the pick in database and get ELO change
          const updateResult = await validateAndUpdatePick(
            validationResult.pick.id, 
            validationResult.result
          );
          
          if (!updateResult.error) {
            validated++;
            totalEloChange += updateResult.eloChange || 0;
            newResults.push({
              pick: validationResult.pick,
              result: validationResult.result,
              eloChange: updateResult.eloChange,
              homeScore: validationResult.homeScore,
              awayScore: validationResult.awayScore
            });
          }
        }
      }
      
      setValidationResults(newResults);
      
      // Refresh data
      await loadPredictions();
      const updatedProfile = await getUserProfile();
      setProfile(updatedProfile);
      
      // Show toast
      if (validated > 0) {
        const changeText = totalEloChange >= 0 ? `+${totalEloChange}` : `${totalEloChange}`;
        setValidationMessage(`✅ Validated ${validated} pick${validated > 1 ? 's' : ''}! ELO: ${changeText}`);
      } else {
        setValidationMessage('No completed games found yet. Check back later!');
      }
      setShowValidationToast(true);
      setTimeout(() => setShowValidationToast(false), 5000);
      
    } catch (error) {
      console.error('Validation error:', error);
      setValidationMessage('❌ Error validating picks. Please try again.');
      setShowValidationToast(true);
      setTimeout(() => setShowValidationToast(false), 3000);
    }
    
    setValidating(false);
  };

  const filteredPredictions = predictions.filter(p => {
    if (filter === 'pending') return p.result === 'pending' && !p.is_locked;
    if (filter === 'locked') return p.is_locked;
    return true;
  });

  const pendingCount = predictions.filter(p => p.result === 'pending' && !p.is_locked).length;
  const lockedCount = predictions.filter(p => p.is_locked).length;

  // Use profile data from database
  const userData = {
    username: user?.email?.split('@')[0] || 'PlayMaker',
    elo: profile?.elo || 1000,
    wins: profile?.wins || 0,
    losses: profile?.losses || 0,
    rank: getEloRank(profile?.elo || 1000),
  };

  // Calculate current streak from validated picks
  const getStreak = () => {
    const validatedPicks = predictions
      .filter(p => p.result === 'win' || p.result === 'loss')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    if (validatedPicks.length === 0) return { count: 0, type: 'none' };
    
    const firstResult = validatedPicks[0].result;
    let count = 0;
    
    for (const pick of validatedPicks) {
      if (pick.result === firstResult) {
        count++;
      } else {
        break;
      }
    }
    
    return { count, type: firstResult };
  };

  const streak = getStreak();

  // Get recent validated results
  const recentResults = predictions
    .filter(p => p.result === 'win' || p.result === 'loss' || p.result === 'push')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Helper to determine rank based on ELO
  function getEloRank(elo) {
    if (elo >= 2400) return 'Grandmaster';
    if (elo >= 2100) return 'Master';
    if (elo >= 1800) return 'Diamond';
    if (elo >= 1500) return 'Platinum';
    if (elo >= 1200) return 'Gold';
    if (elo >= 900) return 'Silver';
    return 'Bronze';
  }

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

  if (loading) {
    return (
      <div className="dashboard-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

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
              <div className="stat-icon">{streak.type === 'win' ? '🔥' : streak.type === 'loss' ? '❄️' : '🎯'}</div>
              <div className="stat-content">
                <div className="stat-label">Current Streak</div>
                <div className={`stat-value ${streak.type === 'win' ? 'streak-win' : streak.type === 'loss' ? 'streak-loss' : ''}`}>
                  {streak.count > 0 ? `${streak.count} ${streak.type === 'win' ? 'Win' : 'Loss'}${streak.count > 1 ? 's' : ''}` : 'No streak'}
                </div>
                <div className="stat-subtext">
                  {streak.type === 'win' ? 'Keep it going!' : streak.type === 'loss' ? 'Bounce back!' : 'Start predicting!'}
                </div>
              </div>
            </div>

            <div className="stat-card rank-card">
              <div className="rank-badge" style={{ borderColor: getRankColor(userData.rank) }}>
                <div className="rank-icon" style={{ color: getRankColor(userData.rank) }}>👑</div>
                <div className="rank-content">
                  <div className="rank-name" style={{ color: getRankColor(userData.rank) }}>
                    {userData.rank}
                  </div>
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
              <div className="section-header-right">
                <span className="section-badge">
                  {pendingCount} pending, {lockedCount} locked
                </span>
                {lockedCount > 0 && (
                  <button 
                    className={`validate-btn ${validating ? 'validating' : ''}`}
                    onClick={handleValidateResults}
                    disabled={validating}
                    title="Check results for locked picks"
                  >
                    {validating ? '⏳ Validating...' : '✓ Validate Results'}
                  </button>
                )}
              </div>
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
                  const gameTime = new Date(pred.game_date);
                  const isToday = gameTime.toDateString() === new Date().toDateString();
                  const isLocked = pred.is_locked;
                  
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
                          <span className="team-name">{pred.away_team}</span>
                          <span className="team-label">AWAY</span>
                        </div>
                        <div className="vs-divider">@</div>
                        <div className="team">
                          <span className="team-name">{pred.home_team}</span>
                          <span className="team-label">HOME</span>
                        </div>
                      </div>

                      <div className="bet-details">
                        <div className={`bet-type-badge ${pred.pick_type}`}>
                          {pred.pick_type === 'moneyline' ? 'Moneyline' : 
                           pred.pick_type === 'spread' ? 'Spread' : 'Total Points'}
                        </div>
                        
                        <div className="your-pick">
                          <span className="pick-label">Your Pick:</span>
                          <span className="pick-value">
                            {pred.pick_value}
                            {' '}@ {pred.odds > 0 ? '+' : ''}{pred.odds}
                          </span>
                        </div>
                      </div>

                      <div className="prediction-footer">
                        {pred.result === 'win' ? (
                          <span className="status-badge win">✅ WIN</span>
                        ) : pred.result === 'loss' ? (
                          <span className="status-badge loss">❌ LOSS</span>
                        ) : pred.result === 'push' ? (
                          <span className="status-badge push">➖ PUSH</span>
                        ) : isLocked ? (
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
            <div className="quick-actions-grid">
              <button className="quick-action-btn" onClick={() => router.push('/predictions')}>
                <span className="quick-action-icon">🏀</span>
                <span className="quick-action-text">Make Predictions</span>
              </button>
              <button className="quick-action-btn" onClick={() => router.push('/overview')}>
                <span className="quick-action-icon">📖</span>
                <span className="quick-action-text">How to Play</span>
              </button>
              <button className="quick-action-btn" onClick={() => router.push('/profile')}>
                <span className="quick-action-icon">👤</span>
                <span className="quick-action-text">View Profile</span>
              </button>
              <button className="quick-action-btn" onClick={() => router.push('/rating')}>
                <span className="quick-action-icon">🏆</span>
                <span className="quick-action-text">Leaderboard</span>
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section recent-results-section">
          <div className="section-header">
            <h2 className="section-title">Recent Results</h2>
            <span className="section-badge">{recentResults.length} validated</span>
          </div>
          {recentResults.length === 0 ? (
            <div className="empty-state small">
              <p>No validated picks yet. Lock your picks and validate them after games end!</p>
            </div>
          ) : (
            <div className="recent-results-list">
              {recentResults.map(pick => (
                <div key={pick.id} className={`recent-result-item ${pick.result}`}>
                  <div className="result-teams">
                    {pick.away_team} @ {pick.home_team}
                  </div>
                  <div className="result-pick-info">
                    <span className="result-pick-type">{pick.pick_type}</span>
                    <span className="result-pick-value">{pick.pick_value}</span>
                  </div>
                  <div className={`result-badge ${pick.result}`}>
                    {pick.result === 'win' ? '✅ WIN' : pick.result === 'loss' ? '❌ LOSS' : '➖ PUSH'}
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Validation Toast */}
      {showValidationToast && (
        <div className="validation-toast">
          {validationMessage}
        </div>
      )}

      {/* Validation Results Summary */}
      {validationResults.length > 0 && (
        <div className="validation-results-overlay" onClick={() => setValidationResults([])}>
          <div className="validation-results-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📊 Validation Results</h3>
            <div className="validation-results-list">
              {validationResults.map((r, idx) => (
                <div key={idx} className={`validation-result-item ${r.result}`}>
                  <div className="result-game">
                    {r.pick.away_team} @ {r.pick.home_team}
                  </div>
                  <div className="result-score">
                    Final: {r.awayScore} - {r.homeScore}
                  </div>
                  <div className="result-pick">
                    Your pick: {r.pick.pick_value}
                  </div>
                  <div className={`result-outcome ${r.result}`}>
                    {r.result === 'win' ? '✅ WIN' : r.result === 'loss' ? '❌ LOSS' : '➖ PUSH'}
                    <span className="elo-change">
                      {r.eloChange > 0 ? `+${r.eloChange}` : r.eloChange} ELO
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="close-results-btn" onClick={() => setValidationResults([])}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
