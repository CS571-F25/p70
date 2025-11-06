import './App.css'

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Welcome to Playmaker</h1>
        <p className="subtitle">The best way to follow your favorite sports team!</p>
      </header>
      <div className="images-container">
        <img src="/nba-logo.png" alt="NBA Logo" className="logo-image" />
        <img src="/nfl-logo.png" alt="NFL Logo" className="logo-image" />
      </div>
    </div>
  )
}

export default App
