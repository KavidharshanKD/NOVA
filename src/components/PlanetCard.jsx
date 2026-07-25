import React from 'react';
import { BadgeCheck, Trophy, Compass } from 'lucide-react';

/**
 * PlanetCard Component (Functional Component)
 * Refactored to:
 * - Accept Lucide icon components as props
 * - Calculate and render dynamic colors on progress bars based on thresholds:
 *   - Green: 80 - 100%
 *   - Blue: 50 - 79%
 *   - Orange: 20 - 49%
 *   - Red: 0 - 19%
 * - Implement proper high contrast variables for text visibility
 * - Replace unicode emojis with Lucide SVG components
 */
function PlanetCard({ planetName, icon, progress, color, description }) {
  
  // Dynamic Icon rendering
  const IconComponent = icon || Compass;

  // Progress Bar color rules matching requirement 7
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#22C55E'; // Green
    if (percentage >= 50) return '#3B82F6'; // Blue
    if (percentage >= 20) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const barColor = getProgressColor(progress);

  // Card border mapping (Inline CSS demonstration)
  const cardAccentStyle = {
    borderTop: `4px solid ${color}`,
    boxShadow: `var(--card-shadow), inset 0 0 10px ${color}0a`
  };

  // Dynamic progress bar styling (Inline CSS demonstration)
  const progressBarStyle = {
    width: `${progress}%`,
    backgroundColor: barColor,
    boxShadow: `0 0 12px ${barColor}55`
  };

  return (
    <div className="card glass-card h-100 p-4" style={cardAccentStyle}>
      <div className="card-body d-flex flex-column p-0">
        
        {/* Planet Icon & Progress Badge */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="planet-icon-container" style={{ color: color }}>
            <IconComponent size={28} />
          </div>
          
          <span 
            className="badge rounded-pill px-3 py-2 status-badge text-white"
            style={{ backgroundColor: color, opacity: 0.95 }}
          >
            {progress}%
          </span>
        </div>

        {/* Planet Details */}
        <h3 className="h4 fw-bold mb-2 card-title text-primary-custom">{planetName}</h3>
        <p className="card-text text-muted-custom flex-grow-1 mb-4" style={{ fontSize: '0.92rem', lineHeight: '1.4' }}>
          {description}
        </p>

        {/* Progress Bar indicator */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 text-secondary-custom small">
            <span>Orbits Explored</span>
            <span className="fw-semibold">{progress}%</span>
          </div>
          <div className="cosmic-progress-container">
            <div 
              className="cosmic-progress-bar" 
              style={progressBarStyle}
            ></div>
          </div>
        </div>

        {/* Action / Award Badges (Conditional & Logical Rendering) */}
        <div className="mt-auto d-flex flex-column gap-2 pt-3 border-top border-secondary border-opacity-10">
          
          {/* Conditional rendering of current status badge */}
          <div className="text-center">
            {progress > 70 ? (
              <span 
                className="badge w-100 py-2 status-badge justify-content-center"
                style={{ 
                  backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                  border: '1.5px solid var(--success-color)',
                  color: 'var(--success-color)' 
                }}
              >
                <BadgeCheck size={14} />
                <span>Excellent Progress</span>
              </span>
            ) : (
              <span 
                className="badge w-100 py-2 status-badge justify-content-center"
                style={{ 
                  backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                  border: '1.5px solid var(--warning-color)',
                  color: 'var(--warning-color)' 
                }}
              >
                <Compass size={14} />
                <span>Keep Growing</span>
              </span>
            )}
          </div>

          {/* Logical && rendering of master level badge */}
          {progress === 100 && (
            <div 
              className="badge w-100 py-2 status-badge justify-content-center fw-bold"
              style={{ 
                backgroundColor: 'rgba(139, 92, 246, 0.12)', 
                border: '1.5px solid var(--secondary-color)',
                color: 'var(--secondary-color)' 
              }}
            >
              <Trophy size={14} />
              <span>Planet Master</span>
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}

export default PlanetCard;
