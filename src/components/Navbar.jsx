import React from 'react';
import { NavLink } from 'react-router-dom';
import { Orbit, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './NotificationPanel';

/**
 * Navbar Component (Functional Component)
 * Refactored to:
 * - Accept onLogout handler prop and render a LogOut session trigger
 * - Maintain modern glassmorphism navbar aesthetics with high-contrast elements
 */
function Navbar({ 
  darkMode, 
  setDarkMode, 
  planetCount, 
  searchQuery, 
  setSearchQuery, 
  notifications, 
  setNotifications,
  onLogout
}) {
  return (
    <nav className="navbar navbar-expand-lg cosmic-nav py-3 sticky-top">
      <div className="container">
        
        {/* Brand Logo Link */}
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
          <Orbit size={28} className="text-primary" />
          <span className="text-white cosmic-title fs-4 mb-0">NOVA</span>
        </NavLink>
        
        {/* Toggle Burger Menu */}
        <button 
          className="navbar-toggler border-0 bg-transparent text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNovaContent" 
          aria-controls="navbarNovaContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNovaContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 text-secondary ${isActive ? 'active' : ''}`}
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 text-secondary ${isActive ? 'active' : ''}`}
                to="/dashboard"
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 text-secondary ${isActive ? 'active' : ''}`}
                to="/missions"
              >
                Missions
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 text-secondary ${isActive ? 'active' : ''}`}
                to="/profile"
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 text-secondary ${isActive ? 'active' : ''}`}
                to="/analytics"
              >
                Analytics
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 text-secondary ${isActive ? 'active' : ''}`}
                to="/universe"
              >
                Universe
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => `nav-link px-3 text-secondary ${isActive ? 'active' : ''}`}
                to="/about"
              >
                About
              </NavLink>
            </li>
          </ul>

          {/* Controls Panel (Search, Log dropdown, theme toggle, logout, stats badge) */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 flex-wrap">
            
            {/* Embedded SearchBar */}
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
            />

            {/* Notification logs Panel */}
            <NotificationPanel 
              notifications={notifications} 
              setNotifications={setNotifications} 
            />

            {/* Theme state switches */}
            <ThemeToggle 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
            />

            {/* Logout button */}
            <button 
              className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px', 
                borderColor: 'rgba(239, 68, 68, 0.25)',
                background: 'rgba(239, 68, 68, 0.05)',
                color: 'var(--danger-color)',
                transition: 'all 0.2s ease'
              }}
              onClick={onLogout}
              title="Disconnect Session"
              aria-label="Disconnect Session"
            >
              <LogOut size={18} />
            </button>

            {/* Planets counter badge */}
            <div 
              className="badge d-flex align-items-center gap-2 px-3 py-2 rounded-pill d-none d-xl-flex"
              style={{ 
                backgroundColor: 'rgba(99, 102, 241, 0.08)', 
                border: '1.5px solid var(--card-border)',
                color: 'var(--text-primary)'
              }}
            >
              <span>Orbiting:</span>
              <strong className="text-info fs-6">{planetCount}</strong>
            </div>

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
