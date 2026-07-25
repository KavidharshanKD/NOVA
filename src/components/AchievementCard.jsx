import React from 'react';
import { Lock, Award } from 'lucide-react';

/**
 * AchievementCard Component (Functional Component)
 * Demonstrates:
 * - Conditional layout rendering (classes and icons swapped if isLocked is true)
 * - Destructuring props (title, description, icon, isLocked)
 */
function AchievementCard({ title, description, icon: IconComponent, isLocked }) {
  return (
    <div 
      className={`card glass-card p-3 h-100 ${isLocked ? 'opacity-50 grayscale' : 'border-indigo-400'}`}
      style={{ 
        transition: 'all 0.3s ease',
        borderColor: isLocked ? 'var(--card-border)' : 'var(--secondary-color)',
        boxShadow: isLocked ? 'var(--card-shadow)' : '0 8px 24px rgba(139, 92, 246, 0.15)',
        background: 'var(--card-bg)'
      }}
    >
      <div className="card-body p-0 d-flex gap-3 align-items-center">
        
        {/* Badge Icon Slot */}
        <div 
          className="planet-icon-container mb-0 flex-shrink-0"
          style={{ 
            color: isLocked ? 'var(--text-muted)' : 'var(--secondary-color)',
            background: isLocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(139, 92, 246, 0.08)'
          }}
        >
          {isLocked ? (
            <Lock size={22} className="text-muted-custom" />
          ) : (
            <IconComponent size={22} className="text-secondary" />
          )}
        </div>

        {/* Info detail text */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="h6 fw-bold mb-0 text-primary-custom">{title}</h4>
            
            {/* Status indicators badge */}
            <span 
              className={`badge status-badge px-2 py-1 fs-9`}
              style={{
                fontSize: '0.65rem',
                backgroundColor: isLocked ? 'rgba(255, 255, 255, 0.05)' : 'rgba(34, 197, 94, 0.1)',
                border: isLocked ? '1px solid var(--text-muted)' : '1px solid var(--success-color)',
                color: isLocked ? 'var(--text-muted)' : 'var(--success-color)'
              }}
            >
              {isLocked ? 'Locked' : 'Unlocked'}
            </span>
          </div>
          <p className="card-text text-muted-custom mb-0 fs-8" style={{ fontSize: '0.8rem', lineHeight: '1.3' }}>
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}

export default AchievementCard;
