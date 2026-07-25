import React from 'react';

/**
 * ProgressCard Component (Functional Component)
 * Refactored to:
 * - Color progress bars dynamically based on percentage
 * - Maintain high accessibility and text contrast
 */
function ProgressCard({ title, progress, status }) {
  // Parse numeric value to get progress-based color coding
  const numericProgress = typeof progress === 'string' ? parseInt(progress, 10) || 0 : progress;

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#22C55E'; // Green
    if (percentage >= 50) return '#3B82F6'; // Blue
    if (percentage >= 20) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const progressColor = getProgressColor(numericProgress);

  return (
    <div className="card glass-card p-4">
      <div className="card-body p-0">
        <h5 className="text-muted-custom small mb-2 text-uppercase fw-semibold tracking-wider">
          {title}
        </h5>
        
        <div className="d-flex align-items-baseline gap-2 mb-3">
          <span className="fs-3 fw-bold text-primary-custom">
            {typeof progress === 'number' ? `${progress}%` : progress}
          </span>
          <span 
            className="badge rounded-pill px-3 py-1 status-badge text-white" 
            style={{ backgroundColor: progressColor, opacity: 0.95, fontSize: '0.75rem' }}
          >
            {status}
          </span>
        </div>

        {/* Dynamic progress indicator bar */}
        <div className="cosmic-progress-container" style={{ height: '5px' }}>
          <div 
            className="cosmic-progress-bar"
            style={{ 
              width: `${numericProgress}%`,
              backgroundColor: progressColor,
              boxShadow: `0 0 8px ${progressColor}44`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default ProgressCard;
