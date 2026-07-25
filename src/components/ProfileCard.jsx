import React from 'react';
import { Award, Target, Calendar, User } from 'lucide-react';

/**
 * ProfileCard Component (Functional Component)
 * Demonstrates:
 * - Data rendering using props
 * - Drawing placeholder assets dynamically with inline SVG React tags
 * - Progress indicator mapping using formulas (xp %)
 * - Reusable grid layout integration
 */
function ProfileCard({ name, role, dailyGoal, level, xp, joinedDate }) {
  // Let's assume a level is 100 XP max.
  const xpNeeded = 100;
  const xpPercentage = Math.min((xp / xpNeeded) * 100, 100);

  return (
    <div className="card glass-card p-4 overflow-hidden position-relative">
      
      {/* Visual background orbital arc glow */}
      <div 
        className="position-absolute end-0 top-0 opacity-10 bg-primary rounded-circle"
        style={{ width: '120px', height: '120px', transform: 'translate(20px, -20px)', filter: 'blur(30px)' }}
      ></div>

      <div className="card-body p-0 text-center text-md-start">
        
        {/* Avatar Profile Section */}
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
          
          {/* Stylized Astronaut Helmet Placeholder SVG */}
          <div className="flex-shrink-0" style={{ width: '90px', height: '90px' }}>
            <svg viewBox="0 0 100 100" className="w-100 h-100 text-primary fill-current">
              <circle cx="50" cy="50" r="48" fill="var(--card-bg)" stroke="var(--primary-color)" strokeWidth="3" />
              {/* Stars decorations */}
              <circle cx="30" cy="30" r="1" fill="#FFF" />
              <circle cx="70" cy="25" r="1.5" fill="#FFF" />
              <circle cx="75" cy="65" r="1" fill="#FFF" />
              {/* Astronaut Visor helmet */}
              <path d="M 25 55 A 25 25 0 0 1 75 55 L 75 65 A 25 25 0 0 1 25 65 Z" fill="rgba(99, 102, 241, 0.2)" stroke="var(--primary-color)" strokeWidth="2" />
              <ellipse cx="50" cy="50" rx="20" ry="12" fill="#0B1020" stroke="var(--secondary-color)" strokeWidth="2" />
              <path d="M 40 45 Q 50 38 60 45" stroke="#FFF" strokeWidth="2" fill="none" opacity="0.7" />
              {/* Suit detail */}
              <path d="M 35 80 L 65 80 L 60 95 L 40 95 Z" fill="rgba(139, 92, 246, 0.3)" stroke="var(--secondary-color)" strokeWidth="2" />
            </svg>
          </div>

          {/* Identity texts */}
          <div className="text-center text-md-start">
            <h3 className="h3 fw-bold text-primary-custom mb-1">{name}</h3>
            <p className="badge status-badge px-3 py-1 mb-2 text-white" style={{ backgroundColor: 'var(--primary-color)' }}>
              {role}
            </p>
            
            <div className="text-muted-custom fs-7 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <Calendar size={14} />
              <span>Joined Star Date: {joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Dynamic XP Progression Bar */}
        <div className="mb-4 p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
              <Award size={18} className="text-secondary" />
              <span className="fw-semibold text-primary-custom">Galaxy Level {level}</span>
            </div>
            <span className="text-muted-custom small fw-medium">{xp} / {xpNeeded} XP</span>
          </div>

          <div className="cosmic-progress-container mb-1" style={{ height: '8px' }}>
            <div 
              className="cosmic-progress-bar"
              style={{ 
                width: `${xpPercentage}%`,
                background: 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
              }}
            ></div>
          </div>
          <span className="text-muted-custom fs-8 d-block" style={{ fontSize: '0.78rem' }}>
            Accumulate {xpNeeded - xp} more XP to orbit to the next Level.
          </span>
        </div>

        {/* Goal panel */}
        <div className="d-flex align-items-start gap-3 p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-5">
          <div className="p-2 rounded bg-primary bg-opacity-10 text-primary mt-1">
            <Target size={20} />
          </div>
          <div>
            <h4 className="h6 text-muted-custom fw-semibold mb-1 text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
              Daily Directive
            </h4>
            <p className="mb-0 text-secondary-custom fw-medium" style={{ fontSize: '0.92rem' }}>
              {dailyGoal}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfileCard;
