import React from 'react';

/**
 * Footer Component (Functional Component)
 * Displays standard copyright and versioning info.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cosmic-footer py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center justify-content-between text-center text-md-start">
          <div className="col-md-6 mb-2 mb-md-0">
            <span className="fw-semibold text-white me-2">🌌 Nova Dashboard</span>
            <span className="text-muted-custom">v1.0.0 — Your Life, Your Universe</span>
          </div>
          <div className="col-md-6 text-md-end text-muted-custom">
            &copy; {currentYear} Personal Universe project. Built for React Laboratory.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
