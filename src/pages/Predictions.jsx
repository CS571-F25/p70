import { useState, useEffect } from 'react';
import { oddsApi } from '../services/oddsApi';
import { 
  savePrediction, 
  getPendingPredictions,
  getLockedPredictions,
  hasPrediction,
  getPrediction
} from '../utils/predictionStorage';
import './Predictions.css';

function Predictions() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interactive prediction state
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [confirmedPredictions, setConfirmedPredictions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  // Load confirmed predictions from localStorage on mount
  useEffect(() => {
    const loadPredictions = () => {
      const pending = getPendingPredictions();
      const locked = getLockedPredictions();
      setConfirmedPredictions([...pending, ...locked]);
    };
    
    loadPredictions();
    window.addEventListener('focus', loadPredictions);
    return () => window.removeEventListener('focus', loadPredictions);
  }, []);

  // Show toast notification
  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle odds click - select prediction
  const handleOddsClick = (game, betType, outcome, odds, point = null) => {
    const gameTime = new Date(game.commence_time);
    const now = new Date();
    
    // Validation: Cannot predict on games that have already started
    if (gameTime <= now) {
      displayToast('❌ Cannot predict on games that have already started!');
      return;
    }

    // Validation: Check for duplicate predictions
    if (hasPrediction(game.id, betType)) {
      const existingPred = getPrediction(game.id, betType);
      if (existingPred && existingPred.status === 'locked') {
        displayToast('🔒 You already have a LOCKED prediction for this game!');
      } else {
        displayToast('⚠️ You already have a prediction for this bet type!');
      }
      return;
    }

    // Create prediction object
    const prediction = {
      eventId: game.id,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      betType,
      selection: outcome,
      odds,
      point,
      commenceTime: game.commence_time,
    };

    setSelectedPrediction(prediction);
  };

  // Confirm and save prediction
  const handleConfirmPrediction = () => {
    if (!selectedPrediction) return;

    try {
      const saved = savePrediction(selectedPrediction);
      setConfirmedPredictions([...confirmedPredictions, saved]);
      displayToast('✅ Prediction saved successfully!');
      setSelectedPrediction(null);
    } catch (err) {
      displayToast('❌ Failed to save prediction');
      console.error(err);
    }
  };

  // Clear current selection
  const handleClearSelection = () => {
    setSelectedPrediction(null);
  };

  // Check if odds button is selected
  const isSelected = (gameId, betType, outcome) => {
    if (!selectedPrediction) return false;
    return (
      selectedPrediction.eventId === gameId &&
      selectedPrediction.betType === betType &&
      selectedPrediction.selection === outcome
    );
  };

  // Check if odds button is already confirmed/locked
  const isLocked = (gameId, betType) => {
    return confirmedPredictions.some(
      pred => pred.eventId === gameId && pred.betType === betType
    );
  };

  // Check if game has started
  const hasGameStarted = (commenceTime) => {
    return new Date(commenceTime) <= new Date();
  };

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
        <div className="header-info">
          <p className="games-count">{games.length} Games Available</p>
          {confirmedPredictions.length > 0 && (
            <span className="predictions-badge">
              {confirmedPredictions.length} Active Pick{confirmedPredictions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Confirmation Buttons */}
      {selectedPrediction && (
        <div className="confirmation-buttons">
          <div className="confirmation-info">
            <p>
              <strong>{selectedPrediction.betType === 'moneyline' ? 'Moneyline' : 
                      selectedPrediction.betType === 'spread' ? 'Spread' : 'Total'}:</strong>{' '}
              {selectedPrediction.selection}
              {selectedPrediction.point && ` (${selectedPrediction.point > 0 ? '+' : ''}${selectedPrediction.point})`}
              {' '}@ {selectedPrediction.odds > 0 ? '+' : ''}{selectedPrediction.odds}
            </p>
          </div>
          <button className="confirm-btn" onClick={handleConfirmPrediction}>
            ✓ Confirm Pick
          </button>
          <button className="clear-btn" onClick={handleClearSelection}>
            ✕ Clear
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <div className="games-container">
        {games.map(game => {
          const bookmaker = getMainBookmaker(game);
          const moneyline = getMarketOutcomes(bookmaker, 'h2h');
          const spreads = getMarketOutcomes(bookmaker, 'spreads');
          const totals = getMarketOutcomes(bookmaker, 'totals');
          
          const gameTime = new Date(game.commence_time);
          const isToday = gameTime.toDateString() === new Date().toDateString();
          const gameStarted = hasGameStarted(game.commence_time);

          return (
            <div key={game.id} className={`game-card ${gameStarted ? 'game-started' : ''}`}>
              {/* Game Header */}
              <div className="game-header">
                <div className="game-time">
                  <span className="date">{gameTime.toLocaleDateString()}</span>
                  <span className="time">{gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isToday && <span className="today-badge">TODAY</span>}
                  {gameStarted && <span className="started-badge">STARTED</span>}
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
                      {moneyline.map(outcome => {
                        const selected = isSelected(game.id, 'moneyline', outcome.name);
                        const locked = isLocked(game.id, 'moneyline');
                        const disabled = gameStarted || (locked && !selected);
                        
                        return (
                          <button 
                            key={outcome.name} 
                            className={`odds-btn ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${disabled ? 'disabled' : ''}`}
                            onClick={() => handleOddsClick(game, 'moneyline', outcome.name, outcome.price)}
                            disabled={disabled}
                          >
                            <span className="odds-team">{outcome.name}</span>
                            <span className="odds-value">
                              {outcome.price > 0 ? '+' : ''}{outcome.price}
                            </span>
                            {locked && <span className="checkmark">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Spread */}
                {spreads && (
                  <div className="market-box">
                    <h4 className="market-title">Spread</h4>
                    <div className="odds-grid">
                      {spreads.map(outcome => {
                        const selected = isSelected(game.id, 'spread', outcome.name);
                        const locked = isLocked(game.id, 'spread');
                        const disabled = gameStarted || (locked && !selected);
                        
                        return (
                          <button 
                            key={outcome.name} 
                            className={`odds-btn ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${disabled ? 'disabled' : ''}`}
                            onClick={() => handleOddsClick(game, 'spread', outcome.name, outcome.price, outcome.point)}
                            disabled={disabled}
                          >
                            <span className="odds-team">{outcome.name}</span>
                            <span className="odds-value">
                              {outcome.point > 0 ? '+' : ''}{outcome.point} ({outcome.price > 0 ? '+' : ''}{outcome.price})
                            </span>
                            {locked && <span className="checkmark">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Totals (Over/Under) */}
                {totals && (
                  <div className="market-box">
                    <h4 className="market-title">Total Points</h4>
                    <div className="odds-grid">
                      {totals.map(outcome => {
                        const selected = isSelected(game.id, 'total', outcome.name);
                        const locked = isLocked(game.id, 'total');
                        const disabled = gameStarted || (locked && !selected);
                        
                        return (
                          <button 
                            key={outcome.name} 
                            className={`odds-btn ${selected ? 'selected' : ''} ${locked ? 'locked' : ''} ${disabled ? 'disabled' : ''}`}
                            onClick={() => handleOddsClick(game, 'total', outcome.name, outcome.price, outcome.point)}
                            disabled={disabled}
                          >
                            <span className="odds-team">{outcome.name}</span>
                            <span className="odds-value">
                              {outcome.point} ({outcome.price > 0 ? '+' : ''}{outcome.price})
                            </span>
                            {locked && <span className="checkmark">✓</span>}
                          </button>
                        );
                      })}
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
