import React from 'react';
import { Square, CheckSquare, Zap, Star, Calendar, AlertCircle, Trash2 } from 'lucide-react';

/**
 * MissionCard Component (Functional Component)
 * Refactored to support responsive flex alignment of actions next to reward badges.
 */
function MissionCard({ 
  mission, 
  onToggle, 
  onToggleImportant, 
  onReschedule, 
  onSkip, 
  onDelete 
}) {
  const { id, title, difficulty, xpReward, completed, isImportant, status } = mission;

  // Custom difficulty color mapper
  const getDifficultyBadgeClass = (diff) => {
    switch (String(diff).toLowerCase()) {
      case 'easy':
        return 'bg-success bg-opacity-15 text-success border border-success border-opacity-25';
      case 'hard':
        return 'bg-danger bg-opacity-15 text-danger border border-danger border-opacity-25';
      default: // Medium
        return 'bg-warning bg-opacity-15 text-warning border border-warning border-opacity-25';
    }
  };

  return (
    <div 
      className={`card glass-card p-3 mb-3 border-start ${completed ? 'border-success border-opacity-50 opacity-75' : ''}`}
      style={{ 
        borderLeft: completed ? '5px solid var(--success-color)' : '1px solid var(--card-border)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap flex-md-nowrap">
        
        {/* Toggle Checkbox / Title Group */}
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <button 
            onClick={() => onToggle(id)}
            className="btn p-0 border-0 bg-transparent text-primary-custom d-flex align-items-center"
            style={{ color: completed ? 'var(--success-color)' : 'var(--text-muted)' }}
            aria-label={completed ? "Mark mission pending" : "Complete mission"}
          >
            {completed ? (
              <CheckSquare size={22} className="text-success fill-success bg-opacity-20" />
            ) : (
              <Square size={22} className="text-muted-custom" />
            )}
          </button>
          
          <span 
            className={`fw-semibold text-primary-custom fs-6 ${completed ? 'text-decoration-line-through text-muted' : ''}`}
            style={{ transition: 'color 0.3s ease' }}
          >
            {title}
          </span>
        </div>

        {/* Badges / Metrics / Actions Group */}
        <div className="d-flex align-items-center gap-2 flex-shrink-0 flex-wrap justify-content-end mt-2 mt-md-0">
          {/* Difficulty Badge */}
          <span className={`badge status-badge px-2 py-1 ${getDifficultyBadgeClass(difficulty)}`}>
            {difficulty}
          </span>

          {/* XP Reward Badge */}
          <span 
            className="badge status-badge px-2 py-1 d-flex align-items-center gap-1"
            style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.12)', 
              border: '1.5px solid var(--warning-color)',
              color: 'var(--warning-color)' 
            }}
          >
            <Zap size={12} className="fill-current" />
            <span>+{xpReward} XP</span>
          </span>

          {/* Action buttons (rendered if handlers are provided) */}
          <div className="d-flex align-items-center gap-1 ms-lg-2 border-start border-secondary border-opacity-10 ps-2">
            {onToggleImportant && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleImportant(id); }}
                className="btn btn-link p-1 text-muted-custom hover-opacity"
                style={{ color: isImportant ? 'var(--warning-color)' : '' }}
                title="Toggle Critical Priority"
              >
                <Star size={15} fill={isImportant ? 'var(--warning-color)' : 'none'} />
              </button>
            )}
            {onReschedule && (
              <button 
                onClick={(e) => { e.stopPropagation(); onReschedule(id); }}
                className="btn btn-link p-1 text-muted-custom hover-opacity"
                title="Reschedule directive"
              >
                <Calendar size={15} />
              </button>
            )}
            {onSkip && !completed && status !== 'Skipped' && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSkip(id); }}
                className="btn btn-link p-1 text-muted-custom hover-opacity text-warning"
                title="Skip directive"
              >
                <AlertCircle size={15} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
                className="btn btn-link p-1 text-muted-custom hover-opacity text-danger"
                title="Delete directive"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MissionCard;
