import React from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle Component (Functional Component)
 * Demonstrates:
 * - Simple prop-based conditional class triggers
 * - Parent to child state updates (onClick calling setDarkMode)
 */
function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button 
      className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center"
      style={{ 
        width: '40px', 
        height: '40px', 
        borderColor: 'var(--card-border)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: 'var(--text-primary)'
      }}
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle Theme"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? (
        <Sun size={18} className="text-warning fill-warning" />
      ) : (
        <Moon size={18} className="text-primary fill-primary" />
      )}
    </button>
  );
}

export default ThemeToggle;
