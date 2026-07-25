import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, CircleHelp } from 'lucide-react';

/**
 * Home Page (Functional Component)
 * Refactored to:
 * - Incorporate Lucide SVG icons in call to action buttons
 * - Match the high contrast cosmic theme styling rules
 */
function Home() {
  return (
    <div className="container py-5 my-auto">
      <div className="row align-items-center justify-content-center text-center">
        <div className="col-lg-8">
          
          {/* Animated Universe Centerpiece */}
          <div className="universe-centerpiece mb-4 d-none d-sm-block">
            <div className="orbital-ring">
              <div className="orbital-planet"></div>
            </div>
            <div className="central-star"></div>
          </div>

          {/* Project Title & Welcome Heading */}
          <h1 className="display-3 fw-bold cosmic-title mb-3">
            Nova
          </h1>
          <p className="fs-4 text-primary fw-semibold mb-2" style={{ letterSpacing: '1.5px' }}>
            Personal Universe Dashboard
          </p>
          
          {/* Welcome Message */}
          <p className="lead subtitle-text mx-auto mb-5" style={{ maxWidth: '600px' }}>
            A space to map your life as an expanding universe. Track your progress, unlock new celestial bodies, and direct your personal galaxy across key life sectors.
          </p>

          {/* Call to Action Buttons with Lucide Icons */}
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/dashboard" className="btn cosmic-btn cosmic-btn-primary px-5 py-3">
              <Rocket size={18} />
              <span>Explore Your Universe</span>
            </Link>
            <Link to="/about" className="btn cosmic-btn cosmic-btn-secondary px-4 py-3">
              <CircleHelp size={18} className="text-primary" />
              <span>View Vision</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
