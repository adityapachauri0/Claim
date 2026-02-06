import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ComplaintsProcedure from './pages/ComplaintsProcedure';
import CookiePolicy from './pages/CookiePolicy';
import GDPR from './pages/GDPR';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import './App.css';

function App() {
    return (
        <div className="app">
            <CookieConsent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/complaints" element={<ComplaintsProcedure />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/gdpr" element={<GDPR />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
