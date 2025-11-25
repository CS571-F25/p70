'use client';

import { useRouter } from 'next/navigation';
import '../Landing.css';

function Landing() {
  const router = useRouter();

  const features = [
    {
      title: 'Overview',
      description: 'See what PlayMaker offers and how it works.',
    },
    {
      title: 'Dashboard',
      description: 'Browse upcoming games, scores, and standings for your favorite teams.',
    },
    {
      title: 'Predictions',
      description: 'Make your picks before tip-off and test your intuition.',
    },
    {
      title: 'Rating System',
      description: 'Track your performance with an evolving Elo-style rating.',
    },
    {
      title: 'Profile',
      description: 'Customize your favorite teams and personalize your dashboard.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to PlayMaker</h1>
          <p className="hero-subtitle">
            Your personalized NBA dashboard for live games, predictions, ratings, and team tracking — all in one sleek sports-tech experience.
          </p>
        </div>
      </section>

      {/* Feature Navigation Cards */}
      <section className="features-section">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              onClick={() => router.push(`/${feature.title.toLowerCase().replace(' ', '-')}`)}
            >
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <button className="footer-link-btn">Privacy</button>
          <button className="footer-link-btn">Terms</button>
          <button className="footer-link-btn">About</button>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
