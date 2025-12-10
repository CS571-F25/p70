'use client';

import Link from 'next/link';
import './Overview.css';

export default function Overview() {
  return (
    <div className="overview-page">
      {/* Quick Start Guide */}
      <section className="quick-start-section">
        <h2 className="section-title">Quick Start Guide</h2>
        <p className="section-subtitle">Get started in 3 simple steps</p>
        
        <div className="quick-start-cards">
          <Link href="/predictions" className="quick-start-card clickable">
            <div className="step-number">1</div>
            <div className="step-icon">🏀</div>
            <h3 className="step-title">Browse Predictions</h3>
            <p className="step-description">
              Head to the <strong>Predictions</strong> tab to see today's NBA games with AI-powered win probabilities and betting odds.
            </p>
          </Link>

          <Link href="/predictions" className="quick-start-card clickable">
            <div className="step-number">2</div>
            <div className="step-icon">📊</div>
            <h3 className="step-title">Analyze & Pick</h3>
            <p className="step-description">
              Review confidence scores, spreads, and moneylines. Click on any odds to make your prediction for a game.
            </p>
          </Link>

          <Link href="/dashboard" className="quick-start-card clickable">
            <div className="step-number">3</div>
            <div className="step-icon">🎯</div>
            <h3 className="step-title">Track Your Picks</h3>
            <p className="step-description">
              Visit the <strong>Dashboard</strong> to monitor your predictions, lock in picks before game time, and track your success rate.
            </p>
          </Link>
        </div>
      </section>

      {/* Step 3: How to Play Section */}
      <section className="how-to-play-section">
        <h2 className="section-title">How to Play</h2>
        <p className="section-subtitle">Compete, climb the ranks, and prove you're the best predictor</p>
        
        <div className="how-to-play-content">
          <div className="play-step">
            <div className="play-icon-wrapper">
              <span className="play-icon">🎯</span>
            </div>
            <div className="play-info">
              <h3 className="play-title">Make Predictions</h3>
              <p className="play-description">
                Browse upcoming NBA games and make your predictions on game outcomes, spreads, or totals. Lock in your picks before tip-off!
              </p>
            </div>
          </div>

          <div className="play-step">
            <div className="play-icon-wrapper correct">
              <span className="play-icon">✅</span>
            </div>
            <div className="play-info">
              <h3 className="play-title">Correct Prediction = ELO Increases</h3>
              <p className="play-description">
                When your prediction is right, your ELO rating goes up! The more accurate you are, the faster you climb the leaderboard.
              </p>
            </div>
          </div>

          <div className="play-step">
            <div className="play-icon-wrapper wrong">
              <span className="play-icon">❌</span>
            </div>
            <div className="play-info">
              <h3 className="play-title">Wrong Prediction = ELO Decreases</h3>
              <p className="play-description">
                Missed a prediction? Your ELO will drop. But don't worry — there's always the next game to bounce back!
              </p>
            </div>
          </div>

          <div className="play-step">
            <div className="play-icon-wrapper rank">
              <span className="play-icon">🏆</span>
            </div>
            <div className="play-info">
              <h3 className="play-title">Higher ELO = Better Rank</h3>
              <p className="play-description">
                Your ELO score reflects your prediction skill. Higher ELO means you're among the elite predictors!
              </p>
            </div>
          </div>

          <div className="play-step">
            <div className="play-icon-wrapper friends">
              <span className="play-icon">👥</span>
            </div>
            <div className="play-info">
              <h3 className="play-title">Compare with Friends</h3>
              <p className="play-description">
                Challenge your friends and see who's the best NBA predictor. Check the leaderboard to see where you stand!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 5: Key Terms Glossary */}
      <section className="glossary-section">
        <h2 className="section-title">Key Terms</h2>
        <p className="section-subtitle">New to sports betting? Here's what you need to know</p>
        
        <div className="glossary-grid">
          <div className="glossary-item">
            <div className="glossary-term">
              <span className="term-icon">💰</span>
              Moneyline
            </div>
            <p className="glossary-definition">
              A straight-up bet on which team will win. Negative odds (e.g., -150) show the favorite; positive odds (e.g., +130) show the underdog.
            </p>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">
              <span className="term-icon">📏</span>
              Spread
            </div>
            <p className="glossary-definition">
              The point margin a team must win or lose by. A -5.5 spread means that team must win by 6+ points to cover.
            </p>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">
              <span className="term-icon">⬆️</span>
              Over/Under
            </div>
            <p className="glossary-definition">
              A bet on whether the total combined score of both teams will be over or under a set number (e.g., O/U 220.5).
            </p>
          </div>

          <div className="glossary-item">
            <div className="glossary-term">
              <span className="term-icon">🔢</span>
              Odds Format (-110)
            </div>
            <p className="glossary-definition">
              American odds show how much you need to bet to win $100 (negative) or how much you win on a $100 bet (positive).
            </p>
          </div>
        </div>
      </section>

      {/* Step 6: Tips Section */}
      <section className="tips-section">
        <h2 className="section-title">Pro Tips</h2>
        <p className="section-subtitle">Make smarter predictions with these tips</p>
        
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-icon">💡</span>
            <p className="tip-text">
              <strong>Check injury reports</strong> — Key player absences can significantly impact game outcomes and odds.
            </p>
          </div>

          <div className="tip-item">
            <span className="tip-icon">⏰</span>
            <p className="tip-text">
              <strong>Lock picks early</strong> — Odds can shift closer to game time. Lock in when you're confident!
            </p>
          </div>

          <div className="tip-item">
            <span className="tip-icon">📈</span>
            <p className="tip-text">
              <strong>Track your performance</strong> — Use the Dashboard to identify patterns in your winning picks.
            </p>
          </div>

          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <p className="tip-text">
              <strong>Start with moneylines</strong> — If you're new, straight-up winner picks are easier to understand.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
