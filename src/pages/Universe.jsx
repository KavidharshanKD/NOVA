import React, { useState } from 'react';
import { BadgeCheck, AlertCircle, Sparkles, Star, RotateCcw } from 'lucide-react';
import ProgressCard from '../components/ProgressCard';

/**
 * Universe Page (Functional Component)
 * Refactored to:
 * - Replace all text emojis with Lucide SVG Icons
 * - Use high-contrast variables for accessibility
 */
function Universe({ planetCount, setPlanetCount }) {
  // Local state for the daily cosmic mission status
  const [completedMission, setCompletedMission] = useState(false);

  // Parent-Child update handler: increment planet count state in App.jsx
  const discoverNewPlanet = () => {
    setPlanetCount(prevCount => prevCount + 1);
  };

  // Reset planet count back to original 4
  const resetUniverse = () => {
    setPlanetCount(4);
    setCompletedMission(false);
  };

  return (
    <div className="container py-4">
      {/* Page header */}
      <div className="mb-5 text-center text-md-start">
        <h2 className="display-6 fw-bold cosmic-title mb-1">Mission Control Center</h2>
        <p className="text-muted-custom">Manage your active sectors and discover unexplored orbital coordinates.</p>
      </div>

      {/* Grid of ProgressCards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <ProgressCard 
            title="Daily Orbit Exploration"
            progress={completedMission ? 100 : 25}
            status={completedMission ? "Completed" : "Pending"}
          />
        </div>
        <div className="col-md-6 col-lg-4">
          <ProgressCard 
            title="Galaxy Scale Index"
            progress={planetCount * 10} // Send number to support dynamic styling
            status={planetCount > 6 ? "Expanding" : "Stable"}
          />
        </div>
        <div className="col-md-6 col-lg-4">
          <ProgressCard 
            title="Cosmic Life Shield"
            progress={75}
            status="Active"
          />
        </div>
      </div>

      {/* Main Mission Control Console */}
      <div className="card glass-card p-4 mb-4">
        <div className="card-body">
          <h3 className="h4 fw-bold mb-3 text-primary-custom">Universal Console</h3>
          
          <div className="row g-4 align-items-center">
            
            {/* Mission status panel (Conditional Rendering) */}
            <div className="col-md-6">
              <div className="p-4 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-10 mb-3">
                <h4 className="h6 text-uppercase text-muted-custom fw-semibold mb-3">Today's Mission Status</h4>
                
                {/* Conditional rendering with Lucide Icons */}
                {completedMission ? (
                  <div className="text-success fw-bold d-flex align-items-center gap-2 fs-5">
                    <BadgeCheck size={24} className="text-success" />
                    <span>Mission Completed Successfully!</span>
                  </div>
                ) : (
                  <div className="text-warning fw-bold d-flex align-items-center gap-2 fs-5">
                    <AlertCircle size={24} className="text-warning" />
                    <span>Mission Pending</span>
                  </div>
                )}
              </div>

              {/* Logical && rendering with Lucide Icons */}
              {completedMission && (
                <div 
                  className="alert alert-info border border-info border-opacity-20 bg-info bg-opacity-10 text-info fw-semibold rounded py-3 px-3 mb-3 d-flex align-items-center gap-2"
                  style={{ animation: 'pulse 2s infinite alternate' }}
                >
                  <Star size={18} className="fill-current" />
                  <span>New Planet Unlocked: Sector Alpha-12</span>
                </div>
              )}
            </div>

            {/* Controls panel */}
            <div className="col-md-6 text-md-end">
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-md-end">
                {/* Complete Mission button */}
                <button 
                  onClick={() => setCompletedMission(!completedMission)}
                  className={`btn cosmic-btn ${completedMission ? 'cosmic-btn-secondary' : 'cosmic-btn-primary'}`}
                >
                  {completedMission ? (
                    <>
                      <RotateCcw size={18} />
                      <span>Reset Daily Mission</span>
                    </>
                  ) : (
                    <>
                      <BadgeCheck size={18} />
                      <span>Complete Today's Mission</span>
                    </>
                  )}
                </button>

                {/* Discover Planet button */}
                <button 
                  onClick={discoverNewPlanet}
                  className="btn cosmic-btn cosmic-btn-secondary"
                  style={{ borderColor: 'var(--primary-color)' }}
                >
                  <Sparkles size={18} className="text-primary" />
                  <span>Discover New Planet</span>
                </button>
              </div>

              <div className="mt-4">
                <button 
                  onClick={resetUniverse} 
                  className="btn btn-link text-muted-custom text-decoration-none fs-7 p-0 hover-opacity"
                  style={{ fontSize: '0.85rem' }}
                >
                  Reset Galaxy Configurations
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Universe;
