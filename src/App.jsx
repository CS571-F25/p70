import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Rating from './pages/Rating';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
