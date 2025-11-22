import { useState } from 'react';
import './Dashboard.css';

function Dashboard() {

  // Mock data - replace with actual data from your backend/state management
  const [userData] = useState({
    username: 'PlayMaker',
    elo: 1847,
    wins: 42,
    losses: 18,
    currentStreak: 5,
    streakType: 'win', // 'win' or 'loss'
    rank: 'Diamond',
    tier: 'III'
  });

  const totalGames = userData.wins + userData.losses;
  const winRate = totalGames > 0 ? ((userData.wins / totalGames) * 100).toFixed(1) : 0;

  // Determine rank color
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
      {/* User Stats Header */}
      <div className="stats-header">
        <div className="stats-header-container">
          
          {/* ELO Display - Center and Prominent */}
          <div className="elo-display">
            <div className="elo-label">ELO Rating</div>
            <div className="elo-value">{userData.elo}</div>
            <div className="elo-change">+24 today</div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            
            {/* Win/Loss Record */}
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-label">Win/Loss</div>
                <div className="stat-value">{userData.wins}W - {userData.losses}L</div>
                <div className="stat-subtext">{winRate}% Win Rate</div>
              </div>
            </div>

            {/* Current Streak */}
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

            {/* Rank/Tier Badge */}
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

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <div className="dashboard-grid">
          
          {/* Active Picks Section - Left Column */}
          <div className="dashboard-section active-picks-section">
            <div className="section-header">
              <h2 className="section-title">Active Picks</h2>
              <span className="section-badge">3 in progress</span>
            </div>
            <div className="section-placeholder-box">
              <p>Active Picks content coming soon...</p>
            </div>
          </div>

          {/* Quick Actions Panel - Right Column */}
          <div className="dashboard-section quick-actions-section">
            <div className="section-header">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            <div className="section-placeholder-box">
              <p>Quick Actions content coming soon...</p>
            </div>
          </div>

        </div>

        {/* Friends Leaderboard Section - Full Width */}
        <div className="dashboard-section friends-section">
          <div className="section-header">
            <h2 className="section-title">Friends Leaderboard</h2>
            <span className="section-badge">12 friends</span>
          </div>
          <div className="section-placeholder-box">
            <p>Friends Leaderboard content coming soon...</p>
          </div>
        </div>

        {/* Recent Results Section - Full Width */}
        <div className="dashboard-section recent-results-section">
          <div className="section-header">
            <h2 className="section-title">Recent Results</h2>
          </div>
          <div className="section-placeholder-box">
            <p>Recent Results content coming soon...</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
