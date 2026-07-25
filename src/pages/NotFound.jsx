import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Rocket, ArrowLeft } from 'lucide-react';

/**
 * NotFound Component (Functional Component)
 * Premium "Lost in Space" 404 Error Page with return vectors.
 */
function NotFound() {
  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 p-3 text-center"
      style={{
        background: 'radial-gradient(circle at center, #0F172A 0%, #020617 100%)',
        color: 'var(--text-primary)'
      }}
    >
      <div 
        className="card glass-card p-5 border-secondary border-opacity-10" 
        style={{ 
          maxWidth: '500px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          background: 'var(--card-bg)'
        }}
      >
        {/* Floating Rocket/Compass Icon Group */}
        <div className="d-flex justify-content-center mb-4 position-relative">
          <div 
            className="rounded-circle p-4 d-flex align-items-center justify-content-center border"
            style={{ 
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.2)'
            }}
          >
            <Compass size={48} className="text-primary spin-animation" style={{ animationDuration: '8s' }} />
          </div>
          <Rocket 
            size={20} 
            className="text-warning position-absolute"
            style={{
              top: '10px',
              right: '35%',
              animation: 'bounce 3s infinite ease-in-out'
            }}
          />
        </div>

        <h2 className="h3 fw-bold text-white mb-2">COORDINATE TIMELINE ERROR</h2>
        <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-25 px-3 py-1 rounded-pill mb-4 fs-9 font-monospace">
          SECTOR_NOT_FOUND (404)
        </span>

        <p className="text-muted-custom small mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
          The coordinates you entered do not exist in this sector of your Personal Universe. The ship is drifting in deep space. Reset path to return to Nova main terminal.
        </p>

        <Link 
          to="/dashboard" 
          className="btn cosmic-btn cosmic-btn-primary d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill w-100"
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard Terminal</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
