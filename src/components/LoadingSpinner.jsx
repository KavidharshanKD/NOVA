import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingSpinner Component (Functional Component)
 * Provides a cosmic telemetry loading spinner for lazy-loaded route suspenses.
 */
function LoadingSpinner() {
  return (
    <div 
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4"
      style={{
        background: 'radial-gradient(circle at center, #0B0F19 0%, #030712 100%)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Outer rotating orbit glow */}
      <div className="position-relative d-flex align-items-center justify-content-center mb-3">
        <Loader2 
          size={48} 
          className="text-primary spin-animation" 
          style={{ 
            animationDuration: '1.2s',
            filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))'
          }} 
        />
        <div 
          className="position-absolute rounded-circle border border-primary border-opacity-10"
          style={{ width: '64px', height: '64px', animation: 'pulse 2s infinite' }}
        ></div>
      </div>

      <span className="small tracking-widest text-uppercase text-secondary-custom fw-semibold font-monospace" style={{ fontSize: '0.82rem' }}>
        Aligning orbital coordinates...
      </span>
    </div>
  );
}

export default LoadingSpinner;
