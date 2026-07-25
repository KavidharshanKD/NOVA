import React from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * UniverseHeader Component (Functional Component)
 * Refactored to:
 * - Replace the rocket emoji with Lucide TrendingUp icon
 * - Use high-contrast color palette rules
 */
function UniverseHeader() {
  const cosmicQuotes = [
    "“The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.” — Carl Sagan",
    "“Somewhere, something incredible is waiting to be known.” — Carl Sagan",
    "“Look up at the stars and not down at your feet.” — Stephen Hawking",
    "“The universe doesn't allow perfection.” — Stephen Hawking",
    "“For my part I know nothing with any certainty, but the sight of the stars makes me dream.” — Vincent van Gogh",
  ];

  const dayIndex = new Date().getDay() % cosmicQuotes.length;
  const dailyQuote = cosmicQuotes[dayIndex];

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="card glass-card p-4 mb-4 header-card">
      <div className="row align-items-center">
        {/* Welcome Section */}
        <div className="col-md-7 col-lg-8">
          <span 
            className="badge status-badge mb-2 px-3 py-2"
            style={{ 
              backgroundColor: 'rgba(34, 197, 94, 0.1)', 
              border: '1.5px solid var(--success-color)',
              color: 'var(--success-color)'
            }}
          >
            <TrendingUp size={16} />
            <span>Mission Status: Active</span>
          </span>
          <h1 className="display-6 fw-bold cosmic-title mb-1">
            Welcome, Cosmic Explorer
          </h1>
          <p className="subtitle-text mb-0">
            Chart your growth and navigate your personal constellations today.
          </p>
        </div>

        {/* Date & Quote Section */}
        <div className="col-md-5 col-lg-4 text-md-end mt-3 mt-md-0 border-start-md border-light-subtle ps-md-4">
          <div className="mb-2">
            <span className="text-muted-custom small d-block">STAR DATE</span>
            <strong className="fs-5 text-primary-custom">{currentDate}</strong>
          </div>
          <div className="text-muted-custom fst-italic lh-sm small">
            {dailyQuote}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UniverseHeader;
