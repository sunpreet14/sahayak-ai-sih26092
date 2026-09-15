import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import CalculatorPage from './pages/CalculatorPage';
import PartnerLocatorPage from './pages/PartnerLocatorPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/scheme/:id" element={<SchemeDetailsPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/partners" element={<PartnerLocatorPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
