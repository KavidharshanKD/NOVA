import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Briefcase, HeartPulse, Rocket, Coins, 
  Users, Compass, Zap, Sparkles, CheckSquare, Square, Target, 
  Quote, Award, RefreshCw, AlertCircle
} from 'lucide-react';
import { planetService, missionService } from '../services/api';
import useAuth from '../hooks/useAuth';

// Icon mapping dictionary
const ICON_MAP = {
  BookOpen: BookOpen,
  Briefcase: Briefcase,
  HeartPulse: HeartPulse,
  Rocket: Rocket,
  Coins: Coins,
  Users: Users,
  Compass: Compass,
  Zap: Zap,
  Sparkles: Sparkles
};

function PlanetDetails() {
  const { planetName } = useParams();
  const { refreshProfile } = useAuth();
  
  const [planetData, setPlanetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPlanetDetails = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await planetService.getPlanetDetails(planetName);
      setPlanetData(data);
    } catch (e) {
      console.error("Failed to load planet metrics:", e);
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlanetDetails();
  }, [planetName]);

  // Toggle checklist tasks (which are mapped missions on the backend)
  const handleToggleLocalTask = async (id) => {
    if (!planetData) return;
    
    // Optimistic UI update
    setPlanetData(prev => {
      const updatedTasks = prev.tasks.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const progress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;
      
      return {
        ...prev,
        progress,
        tasks: updatedTasks
      };
    });

    try {
      const task = planetData.tasks.find(t => t.id === id);
      const newStatus = task.completed ? 'Pending' : 'Completed';
      await missionService.updateMissionStatus(id, newStatus);
      await refreshProfile();
      // Reload planet details to get sync'd AI insights and progress scores
      const freshData = await planetService.getPlanetDetails(planetName);
      setPlanetData(freshData);
    } catch (err) {
      console.error("Failed to sync checklist item:", err);
      // Revert if error
      loadPlanetDetails();
    }
  };

  // If error, render not found screen
  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2 className="display-6 fw-bold text-danger mb-3">Planet Coordinate Lost</h2>
        <p className="text-muted-custom mb-4">The planet coordinate code "{planetName}" was not mapped in the database sector.</p>
        <Link to="/dashboard" className="btn cosmic-btn cosmic-btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted-custom">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Establishing communications link with sector orbital telemetry...</p>
      </div>
    );
  }

  const IconComponent = ICON_MAP[planetData.icon] || Orbit;

  return (
    <div className="container py-4">
      {/* Dynamic Back to Dashboard trigger */}
      <div className="mb-4">
        <Link to="/dashboard" className="text-muted-custom text-decoration-none d-flex align-items-center gap-2 hover-opacity fs-7">
          <ArrowLeft size={16} />
          <span>Back to Galaxy Dashboard</span>
        </Link>
      </div>

      <div className="row g-4">
        
        {/* Left Side: General Info Card */}
        <div className="col-lg-5">
          <div 
            className="card glass-card p-4 text-center text-md-start h-100"
            style={{ borderTop: `4px solid ${planetData.color}` }}
          >
            <div 
              className="planet-icon-container mx-auto mx-md-0"
              style={{ color: planetData.color, backgroundColor: `${planetData.color}15` }}
            >
              <IconComponent size={32} />
            </div>

            <h2 className="display-6 fw-bold text-primary-custom mb-2">{planetData.name} Planet</h2>
            
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
              <span className="badge status-badge text-white" style={{ backgroundColor: planetData.color }}>
                Orbit progress: {planetData.progress}%
              </span>
              {planetData.progress === 100 && (
                <span className="badge bg-indigo-900 border border-primary text-info status-badge">
                  <Award size={13} />
                  <span>Mastered Sector</span>
                </span>
              )}
            </div>

            <p className="lead fs-6 text-muted-custom mb-4 lh-lg">
              {planetData.description}
            </p>

            {/* AI Insights Panel */}
            <div className="p-3 mb-4 rounded bg-primary bg-opacity-5 border border-primary border-opacity-15 d-flex gap-2 align-items-start text-start">
              <Sparkles size={18} className="text-warning mt-1 flex-shrink-0" />
              <div>
                <span className="text-primary-custom fw-semibold small d-block mb-1">Planetary AI Insights</span>
                <p className="mb-0 text-muted-custom small" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                  {planetData.aiInsights}
                </p>
              </div>
            </div>

            {/* Quote block */}
            <div className="p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-10 d-flex gap-3 align-items-start text-start mt-auto">
              <Quote size={20} className="text-primary mt-1 flex-shrink-0" />
              <p className="mb-0 text-secondary-custom fst-italic small" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                {planetData.quote}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Directives Checklist Card */}
        <div className="col-lg-7">
          <div className="card glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary border-opacity-10 pb-3">
              <Target size={22} className="text-primary" />
              <h3 className="h4 fw-bold mb-0 text-primary-custom">Orbits Checklist</h3>
            </div>

            <div className="mb-4">
              <span className="text-muted-custom small text-uppercase fw-semibold d-block mb-1">
                Active Goals
              </span>
              <div className="d-flex flex-column gap-1">
                {planetData.goals && planetData.goals.length > 0 ? (
                  planetData.goals.map((g, i) => (
                    <strong key={i} className="text-primary-custom fs-5">
                      {g.title}
                    </strong>
                  ))
                ) : (
                  <span className="text-muted-custom small">Complete directives to earn mastery title targets.</span>
                )}
              </div>
            </div>

            {/* List panel */}
            <div className="d-flex flex-column gap-3">
              {planetData.tasks && planetData.tasks.length > 0 ? (
                planetData.tasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => handleToggleLocalTask(task.id)}
                    className={`p-3 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-10 d-flex align-items-center justify-content-between cursor-pointer`}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderLeft: task.completed ? `4px solid ${planetData.color}` : '1px solid var(--card-border)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span style={{ color: task.completed ? planetData.color : 'var(--text-muted)' }}>
                        {task.completed ? <CheckSquare size={18} /> : <Square size={18} />}
                      </span>
                      <span className={`text-secondary-custom fs-6 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                        {task.text}
                      </span>
                    </div>
                    
                    <span 
                      className="badge rounded-pill px-2 py-1 status-badge fs-9"
                      style={{ 
                        fontSize: '0.65rem',
                        backgroundColor: task.completed ? `${planetData.color}22` : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${task.completed ? planetData.color : 'rgba(255, 255, 255, 0.1)'}`,
                        color: task.completed ? planetData.color : 'var(--text-muted)'
                      }}
                    >
                      {task.completed ? 'Checked' : 'Locked'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center border border-dashed rounded text-muted-custom small">
                  No active directives loaded for this planet coordinate. Deploy them from the Missions console!
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default PlanetDetails;
