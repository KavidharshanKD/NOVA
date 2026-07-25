import React from 'react';
import { Compass } from 'lucide-react';

/**
 * StatisticCard Component (Functional Component)
 * Demonstrates:
 * - Simple layout rendering via props
 * - Dynamic color accents using Inline styles
 * - Reusable UI widgets
 */
function StatisticCard({ title, value, icon: IconComponent, color, description }) {
  const Icon = IconComponent || Compass;

  return (
    <div 
      className="card glass-card p-3 h-100"
      style={{
        borderLeft: `4px solid ${color}`,
        background: 'var(--card-bg)'
      }}
    >
      <div className="card-body p-0 d-flex align-items-center justify-content-between">
        
        {/* Metric Info group */}
        <div>
          <span className="text-muted-custom small text-uppercase fw-semibold tracking-wider d-block mb-1">
            {title}
          </span>
          <strong className="fs-3 fw-bold text-primary-custom d-block mb-0">
            {value}
          </strong>
          {description && (
            <span className="text-muted-custom fs-8 d-block mt-1" style={{ fontSize: '0.75rem' }}>
              {description}
            </span>
          )}
        </div>

        {/* Dynamic Icon group */}
        <div 
          className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
          style={{
            width: '46px',
            height: '46px',
            color: color,
            backgroundColor: `${color}18`
          }}
        >
          <Icon size={20} />
        </div>

      </div>
    </div>
  );
}

export default StatisticCard;
