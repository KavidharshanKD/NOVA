import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { missionService, notificationService, settingsService, planetService } from './services/api';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Universe = lazy(() => import('./pages/Universe'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const Missions = lazy(() => import('./pages/Missions'));
const PlanetDetails = lazy(() => import('./pages/PlanetDetails'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Protected Route Gate Wrapper
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="app-wrapper justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted-custom">Loading cosmic coordinates...</p>
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

/**
 * Authenticated Layout Wrapper
 * Handles loading data, settings, notifications, missions, and synchronizing global states
 */
const AuthenticatedApp = () => {
  const { logout, user, refreshProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [planetCount, setPlanetCount] = useState(4);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [title, setTitle] = useState("Explorer");
  const [notifications, setNotifications] = useState([]);
  const [missions, setMissions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  // Load backend configurations (settings, notifications, missions)
  useEffect(() => {
    if (!user) return;

    // Apply values from logged in user profile
    setXp(user.xp || 0);
    setLevel(user.level || 1);
    setTitle(user.title || "Explorer");

    const loadUserData = async () => {
      try {
        // Load Settings
        const settings = await settingsService.getSettings();
        setDarkMode(settings.darkMode);
        
        // Load Planet Count
        const planets = await planetService.getPlanets();
        setPlanetCount(planets.filter(p => p.progress > 0).length || 4);

        // Load Notifications
        const notifs = await notificationService.getNotifications();
        setNotifications(notifs.map(n => ({
          id: n._id || n.id,
          text: n.text,
          type: n.type,
          time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));

        // Load Missions
        const activeMissions = await missionService.getMissions();
        setMissions(activeMissions);
      } catch (err) {
        console.error("Failed to compile sector logs:", err);
      }
    };

    loadUserData();
  }, [user]);

  // Synchronize CSS themes
  useEffect(() => {
    const root = document.querySelector('.app-wrapper');
    if (root) {
      if (darkMode) {
        root.classList.remove('light-theme');
        root.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
        root.classList.add('light-theme');
      }
    }
  }, [darkMode]);

  const handleToggleTheme = async () => {
    try {
      const newTheme = !darkMode;
      setDarkMode(newTheme);
      await settingsService.updateSettings({ darkMode: newTheme });
    } catch (err) {
      console.error("Failed to update theme preference:", err);
    }
  };

  const handleToggleMission = async (id) => {
    const mission = missions.find(m => m._id === id || m.id === id);
    if (!mission) return;

    try {
      const newStatus = mission.completed ? 'Pending' : 'Completed';
      const updated = await missionService.updateMissionStatus(mission._id || mission.id, newStatus);
      
      // Update missions state list
      setMissions(prev => prev.map(m => (m._id === id || m.id === id) ? updated : m));
      
      // Refresh profile to update Level/XP details
      await refreshProfile();
    } catch (err) {
      console.error("Failed to sync mission check status:", err);
    }
  };

  const handleLogout = () => {
    logout();
    setSearchQuery("");
  };

  return (
    <div className={`app-wrapper ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Navbar 
        darkMode={darkMode} 
        setDarkMode={handleToggleTheme} 
        planetCount={planetCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        setNotifications={setNotifications}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow-1 d-flex align-items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                searchQuery={searchQuery}
                planetCount={planetCount}
                xp={xp}
                level={level}
                missions={missions}
                handleToggleMission={handleToggleMission}
              />
            } 
          />
          
          <Route 
            path="/universe" 
            element={
              <Universe 
                planetCount={planetCount} 
                setPlanetCount={setPlanetCount} 
              />
            } 
          />
          
          <Route path="/about" element={<About />} />
          
          <Route 
            path="/profile" 
            element={
              <Profile 
                profile={{
                  name: user?.firstName || "Commander",
                  role: title,
                  dailyGoal: `Reach Level ${level + 1} and master your suggested orbit quadrant.`,
                  joinedDate: user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString([], { month: 'long', year: 'numeric' }) : "July 2026"
                }} 
                xp={xp} 
                level={level} 
                planetCount={planetCount} 
                missions={missions} 
              />
            } 
          />
          
          <Route 
            path="/missions" 
            element={
              <Missions 
                missions={missions} 
                onToggleMission={handleToggleMission} 
                xp={xp} 
                level={level} 
              />
            } 
          />

          <Route path="/planet/:planetName" element={<PlanetDetails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

/**
 * Main routing component including auth gates
 */
function AppContent() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Auth Gates */}
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />} 
      />
      <Route 
        path="/forgot-password" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
      />
      <Route 
        path="/reset-password" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <ResetPassword />} 
      />

      {/* Main Pages */}
      <Route 
        path="/*" 
        element={
          <ProtectedRoute>
            <AuthenticatedApp />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <AppContent />
          </Suspense>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
