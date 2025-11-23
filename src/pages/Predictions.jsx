import { useState, useEffect } from 'react';
import { oddsApi } from '../services/oddsApi';
import './Predictions.css';

function Predictions() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        setError(null);
        const nbaGames = await oddsApi.getNBAGames();
        setGames(nbaGames);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  // Helper to get main bookmaker (DraftKings preferred, or first available)
  const getMainBookmaker = (game) => {
    if (!game.bookmakers || game.bookmakers.length === 0) return null;
    
    const draftkings = game.bookmakers.find(b => b.key === 'draftkings');
    return draftkings || game.bookmakers[0];
  };

  // Helper to extract specific market outcomes
  const getMarketOutcomes = (bookmaker, marketKey) => {
    if (!bookmaker) return null;
    const market = bookmaker.markets.find(m => m.key === marketKey);
    return market ? market.outcomes : null;
  };

  if (loading) {
    return (
      <div className="predictions-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading NBA Games...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="predictions-page">
        <div className="error-container">
          <h1>⚠️ Error Loading Games</h1>
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="predictions-page">
        <div className="no-games-container">
          <h1>🏀 No NBA Games Available</h1>
          <p>Check back later for upcoming games!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="predictions-page">
      <div className="predictions-header">
        <h1 className="page-title">🏀 NBA Predictions</h1>
        <p className="games-count">{games.length} Games Available</p>
      </div>

      <div className="games-container">
        {games.map(game => {
          const bookmaker = getMainBookmaker(game);
          const moneyline = getMarketOutcomes(bookmaker, 'h2h');
          const spreads = getMarketOutcomes(bookmaker, 'spreads');
          const totals = getMarketOutcomes(bookmaker, 'totals');
          
          const gameTime = new Date(game.commence_time);
          const isToday = gameTime.toDateString() === new Date().toDateString();

          return (
            <div key={game.id} className="game-card">
              {/* Game Header */}
              <div className="game-header">
                <div className="game-time">
                  <span className="date">{gameTime.toLocaleDateString()}</span>
                  <span className="time">{gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isToday && <span className="today-badge">TODAY</span>}
                </div>
                {bookmaker && (
                  <div className="bookmaker-badge">
                    {bookmaker.title}
                  </div>
                )}
              </div>

              {/* Teams */}
              <div className="teams-section">
                <div className="team">
                  <span className="team-name">{game.away_team}</span>
                  <span className="team-label">AWAY</span>
                </div>
                <div className="vs-divider">@</div>
                <div className="team">
                  <span className="team-name">{game.home_team}</span>
                  <span className="team-label">HOME</span>
                </div>
              </div>

              {/* Betting Markets */}
              <div className="markets-section">
                {/* Moneyline */}
                {moneyline && (
                  <div className="market-box">
                    <h4 className="market-title">Moneyline</h4>
                    <div className="odds-grid">
                      {moneyline.map(outcome => (
                        <button key={outcome.name} className="odds-btn">
                          <span className="odds-team">{outcome.name}</span>
                          <span className="odds-value">
                            {outcome.price > 0 ? '+' : ''}{outcome.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spread */}
                {spreads && (
                  <div className="market-box">
                    <h4 className="market-title">Spread</h4>
                    <div className="odds-grid">
                      {spreads.map(outcome => (
                        <button key={outcome.name} className="odds-btn">
                          <span className="odds-team">{outcome.name}</span>
                          <span className="odds-value">
                            {outcome.point > 0 ? '+' : ''}{outcome.point} ({outcome.price > 0 ? '+' : ''}{outcome.price})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Totals (Over/Under) */}
                {totals && (
                  <div className="market-box">
                    <h4 className="market-title">Total Points</h4>
                    <div className="odds-grid">
                      {totals.map(outcome => (
                        <button key={outcome.name} className="odds-btn">
                          <span className="odds-team">{outcome.name}</span>
                          <span className="odds-value">
                            {outcome.point} ({outcome.price > 0 ? '+' : ''}{outcome.price})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Predictions;
