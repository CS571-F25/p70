import '../Landing.css';
import { useRouter } from 'next/navigation';

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
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <span className="brand-wordmark">PlayMaker</span>
          <ul className="navbar-links">
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); router.push('/overview'); }}>Overview</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); router.push('/dashboard'); }}>Dashboard</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); router.push('/predictions'); }}>Predictions</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); router.push('/rating'); }}>Rating</a></li>
            <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); router.push('/profile'); }}>Profile</a></li>
          </ul>
          <div className="navbar-actions">
            <button onClick={() => router.push('/login')} className="nav-btn login-btn">
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to PlayMaker</h1>
          <p className="hero-subtitle">
            Your personalized NBA dashboard for live games, predictions, ratings, and team tracking — all in one sleek sports-tech experience.
          </p>
          
          <div className="hero-cta">
            <button className="cta-btn primary-cta" onClick={() => router.push('/login')}>
              Get Started
            </button>
            <button className="cta-btn secondary-cta" onClick={() => router.push('/login')}>
              Log In
            </button>
          </div>
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
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>About</a>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

