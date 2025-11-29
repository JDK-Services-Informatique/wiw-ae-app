import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import { authService } from './services/auth.api.js';
import AppProvider from './providers/AppProvider';
import { track, AnalyticsEvents } from './services/analytics';

// Pages principales
import Dashboard from './pages/Dashboard';
import Honoraires from './pages/Honoraires';
import Team from './pages/Team';
import Company from './pages/Company';

// Pages supplémentaires
import Devis from './pages/Devis';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Tenders from './pages/Tenders';
import Prospection from './pages/Prospection';
import References from './pages/References';
import MediaLibrary from './pages/MediaLibrary';
import DataManagement from './pages/DataManagement';
import Pricing from './pages/Pricing';
import MissionsConseil from './pages/MissionsConseil';
import Contact from './pages/Contact';
import Alertes from './pages/Alertes';
import CatalogueArticles from './pages/CatalogueArticles';
import Legal from './pages/Legal';
import Plans from './pages/Plans';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import BET from './pages/BET';
import Login from './pages/Login';
import NouvelleAO from './pages/NouvelleAO';
import Pipeline from './pages/Pipeline';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Pages utilitaires
import NotFound from './pages/NotFound';
import GlobalShortcuts from './components/GlobalShortcuts';

// Composant pour tracker les changements de route
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    track(AnalyticsEvents.PAGE_VIEW, {
      path: location.pathname,
      timestamp: new Date().toISOString()
    });
  }, [location]);

  return null;
}

export default function App() {
  // Vérifier l'authentification au démarrage
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return authService.isAuthenticated();
  });
  const [currentUser, setCurrentUser] = React.useState(() => {
    return authService.getCurrentUser();
  });

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    track(AnalyticsEvents.LOGIN, {
      userId: user?.id,
      email: user?.email,
      role: user?.role
    });
  };

  const handleLogout = () => {
    track(AnalyticsEvents.LOGOUT, {
      userId: currentUser?.id
    });
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AppProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AnalyticsTracker />
        <GlobalShortcuts />
        <Routes>
          {/* Route Publique : Landing Page */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
          />

          {/* Route Publique : Page de Login */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
          />

          {/* Routes Publiques : Réinitialisation mot de passe */}
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
          />

          {/* Routes Publiques : Pages marketing */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/landing" element={<LandingPage />} /> {/* Route forcée pour voir la landing même si authentifié */}

          {/* Routes Privées : Application */}
          <Route element={isAuthenticated ? <DashboardLayout user={currentUser} onLogout={handleLogout} /> : <Navigate to="/" replace />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/honoraires" element={<Honoraires />} />
            <Route path="/nouvelle-ao" element={<NouvelleAO />} />
            <Route path="/team" element={<Team />} />
            <Route path="/company" element={<Company />} />
            <Route path="/devis" element={<Devis />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tenders" element={<Tenders />} />
            <Route path="/prospection" element={<Prospection />} />
            <Route path="/references" element={<References />} />
            <Route path="/medialibrary" element={<MediaLibrary />} />
            <Route path="/datamanagement" element={<DataManagement />} />
            <Route path="/missions" element={<MissionsConseil />} />
            <Route path="/alertes" element={<Alertes />} />
            <Route path="/catalogue" element={<CatalogueArticles />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bet" element={<BET />} />
          </Route>

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
