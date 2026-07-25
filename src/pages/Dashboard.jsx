import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Briefcase, HeartPulse, Rocket, Award, Zap, Orbit, 
  BadgeCheck, CheckSquare, Trophy, Sparkles, Compass, Coins, 
  Users, RefreshCw, BarChart2, MessageSquare, AlertCircle, Clock
} from 'lucide-react';
import UniverseHeader from '../components/UniverseHeader';
import PlanetCard from '../components/PlanetCard';
import StatisticCard from '../components/StatisticCard';
import AchievementCard from '../components/AchievementCard';
import { planetService, achievementService, recommendationService, missionService } from '../services/api';
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

function Dashboard({ searchQuery }) {
  const { user } = useAuth();
  const [planets, setPlanets] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for regenerating recommendations
  const [showRefreshForm, setShowRefreshForm] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    stressLevel: 5,
    focusLevel: 6,
    productivityLevel: 6,
    skillLevel: 5,
    planetFocus: 'Learning'
  });

  const loadDashboardData = async () => {
    try {
      const planetsData = await planetService.getPlanets();
      setPlanets(planetsData);

      const achData = await achievementService.getAchievements();
      setAchievements(achData.filter(a => !a.isLocked).slice(0, 3)); // show top 3 unlocked

      const recData = await recommendationService.getRecommendation();
      setRecommendation(recData);

      const activeMissions = await missionService.getMissions();
      setMissions(activeMissions);
    } catch (err) {
      console.error("Failed to sync dashboard registries:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleMissionItem = async (id) => {
    const mission = missions.find(m => m._id === id || m.id === id);
    if (!mission) return;

    try {
      const newStatus = mission.completed ? 'Pending' : 'Completed';
      const updated = await missionService.updateMissionStatus(mission._id || mission.id, newStatus);
      setMissions(prev => prev.map(m => (m._id === id || m.id === id) ? updated : m));
      // Reload planets progress to catch updates
      const updatedPlanets = await planetService.getPlanets();
      setPlanets(updatedPlanets);
    } catch (err) {
      console.error("Failed to check mission status:", err);
    }
  };

  const handleRefreshRecommendationSubmit = async (e) => {
    e.preventDefault();
    setRefreshLoading(true);
    try {
      const newRec = await recommendationService.refreshRecommendation(metrics);
      setRecommendation(newRec);
      setShowRefreshForm(false);
      // Reload missions list (since updating recommendations replaces incomplete ones)
      const activeMissions = await missionService.getMissions();
      setMissions(activeMissions);
    } catch (err) {
      console.error("Failed to recalculate recommendation:", err);
    }
    setRefreshLoading(false);
  };

  // Filter planets based on Search Bar input query
  const filteredPlanets = planets.filter((planet) => 
    planet.planetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedMissionsCount = missions.filter(m => m.completed).length;
  const totalMissionsCount = missions.length;
  const completionRate = totalMissionsCount > 0 ? Math.round((completedMissionsCount / totalMissionsCount) * 100) : 0;

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted-custom">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Analyzing cosmic telemetry logs...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Universal header banner */}
      <UniverseHeader />

      {/* SECTION 1: Statistics Cards Overview Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatisticCard 
            title="Active Planets" 
            value={planets.filter(p => p.progress > 0).length} 
            icon={Orbit} 
            color="#6366F1"
            description="Active in orbit"
          />
        </div>
        <div className="col-6 col-md-3">
          <StatisticCard 
            title="XP Balance" 
            value={`${user?.xp || 0} XP`} 
            icon={Zap} 
            color="#F59E0B"
            description={`Level ${user?.level || 1} rank`}
          />
        </div>
        <div className="col-6 col-md-3">
          <StatisticCard 
            title="Directives" 
            value={`${completedMissionsCount} / ${totalMissionsCount}`} 
            icon={CheckSquare} 
            color="#22C55E"
            description={`${completionRate}% checked`}
          />
        </div>
        <div className="col-6 col-md-3">
          <StatisticCard 
            title="Cosmic Level" 
            value={`Lvl ${user?.level || 1}`} 
            icon={Award} 
            color="#8B5CF6"
            description={user?.title || "Explorer"}
          />
        </div>
      </div>

      {/* SECTION 1.5: ML AI Recommendation Terminal */}
      {recommendation && (
        <div className="card glass-card p-4 mb-4 border-start" style={{ borderLeft: '5px solid var(--primary-color)' }}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h3 className="h5 fw-bold text-primary-custom mb-1 d-flex align-items-center gap-2">
                <Sparkles size={18} className="text-warning fill-current" />
                <span>AI Personalized Directives: {recommendation.planName}</span>
              </h3>
              <p className="text-muted-custom small mb-0">Compiled by Random Forest Classifier matching your demographic telemetry.</p>
            </div>
            
            <div className="d-flex gap-2">
              <Link to="/analytics" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1 rounded-pill px-3">
                <BarChart2 size={13} />
                <span>View Charts</span>
              </Link>
              <button 
                onClick={() => setShowRefreshForm(!showRefreshForm)}
                className="btn btn-sm btn-outline-info d-flex align-items-center gap-1 rounded-pill px-3"
              >
                <RefreshCw size={13} className={refreshLoading ? 'spin-animation' : ''} />
                <span>Refresh AI Plan</span>
              </button>
            </div>
          </div>

          {/* Form to Refresh AI Recommendations */}
          {showRefreshForm && (
            <form onSubmit={handleRefreshRecommendationSubmit} className="p-3 mb-4 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-15">
              <h4 className="h6 fw-bold text-primary-custom mb-3">Update Cognitive Metrics</h4>
              <div className="row g-3 mb-3">
                <div className="col-md-2 col-sm-6">
                  <label className="form-label text-muted-custom small mb-1">Stress Level (1-10)</label>
                  <input
                    type="number" min="1" max="10"
                    className="form-control form-control-sm bg-dark bg-opacity-20 text-white"
                    value={metrics.stressLevel}
                    onChange={(e) => setMetrics({ ...metrics, stressLevel: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <div className="col-md-2 col-sm-6">
                  <label className="form-label text-muted-custom small mb-1">Focus Level (1-10)</label>
                  <input
                    type="number" min="1" max="10"
                    className="form-control form-control-sm bg-dark bg-opacity-20 text-white"
                    value={metrics.focusLevel}
                    onChange={(e) => setMetrics({ ...metrics, focusLevel: parseInt(e.target.value) || 6 })}
                  />
                </div>
                <div className="col-md-2 col-sm-6">
                  <label className="form-label text-muted-custom small mb-1">Productivity (1-10)</label>
                  <input
                    type="number" min="1" max="10"
                    className="form-control form-control-sm bg-dark bg-opacity-20 text-white"
                    value={metrics.productivityLevel}
                    onChange={(e) => setMetrics({ ...metrics, productivityLevel: parseInt(e.target.value) || 6 })}
                  />
                </div>
                <div className="col-md-2 col-sm-6">
                  <label className="form-label text-muted-custom small mb-1">Skill (1-10)</label>
                  <input
                    type="number" min="1" max="10"
                    className="form-control form-control-sm bg-dark bg-opacity-20 text-white"
                    value={metrics.skillLevel}
                    onChange={(e) => setMetrics({ ...metrics, skillLevel: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <div className="col-md-4 col-sm-12">
                  <label className="form-label text-muted-custom small mb-1">Planet Focus</label>
                  <select 
                    className="form-select form-select-sm bg-dark bg-opacity-20 text-white"
                    value={metrics.planetFocus}
                    onChange={(e) => setMetrics({ ...metrics, planetFocus: e.target.value })}
                  >
                    <option value="Learning">Learning</option>
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Projects">Projects</option>
                    <option value="Finance">Finance</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Creativity">Creativity</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={refreshLoading} className="btn btn-sm cosmic-btn cosmic-btn-primary py-1 px-3 fs-9">
                {refreshLoading ? 'Invoking Flask predictor...' : 'Submit to AI Model'}
              </button>
            </form>
          )}

          <div className="row g-3">
            {/* Focus Target */}
            <div className="col-md-4">
              <div className="p-3 h-100 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-10">
                <span className="text-muted-custom small d-block mb-1">Target Planet Orbit</span>
                <strong className="text-primary-custom fs-6 d-flex align-items-center gap-1">
                  <Orbit size={16} className="text-primary" />
                  <span>{recommendation.recommendedPlanet} Planet</span>
                </strong>
                <span className="text-muted-custom small d-block mt-2">Required XP target: {recommendation.recommendedXpTarget} XP</span>
              </div>
            </div>

            {/* Suggested Habits */}
            <div className="col-md-4">
              <div className="p-3 h-100 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-10">
                <span className="text-muted-custom small d-block mb-1">Suggested Habits</span>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {recommendation.recommendedHabits.map((h, i) => (
                    <li key={i} className="small text-secondary-custom d-flex align-items-start gap-1">
                      <span className="text-primary mt-1">&bull;</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Daily Schedule */}
            <div className="col-md-4">
              <div className="p-3 h-100 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-10">
                <span className="text-muted-custom small d-block mb-1">Daily Hour Schedule</span>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
                  {recommendation.dailySchedule.map((s, i) => (
                    <li key={i} className="small text-secondary-custom d-flex align-items-start gap-1">
                      <Clock size={12} className="text-info mt-1 flex-shrink-0" />
                      <span style={{ fontSize: '0.75rem' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Grid comprising Today's Missions & Achievements */}
      <div className="row g-4 mb-5">
        
        {/* Left Side: Today's Missions overview panel */}
        <div className="col-lg-6">
          <div className="card glass-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 fw-bold text-primary-custom mb-0 d-flex align-items-center gap-2">
                <CheckSquare size={18} className="text-primary" />
                <span>Today's Missions</span>
              </h3>
              <Link to="/missions" className="text-primary text-decoration-none small hover-opacity">
                Configure View &rarr;
              </Link>
            </div>

            <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-start">
              {missions.length === 0 ? (
                <div className="p-4 text-center text-muted-custom small">
                  No daily missions loaded.
                </div>
              ) : (
                missions.map(item => (
                  <div 
                    key={item._id || item.id}
                    onClick={() => handleToggleMissionItem(item._id || item.id)}
                    className="p-2 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-10 d-flex align-items-center justify-content-between cursor-pointer"
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    <span className={`small fw-semibold text-secondary-custom ${item.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                      {item.title}
                    </span>
                    
                    <span 
                      className={`badge status-badge px-2 py-1`}
                      style={{
                        fontSize: '0.65rem',
                        backgroundColor: item.completed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        border: `1px solid ${item.completed ? 'var(--success-color)' : 'var(--warning-color)'}`,
                        color: item.completed ? 'var(--success-color)' : 'var(--warning-color)'
                      }}
                    >
                      {item.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Achievements locking panel */}
        <div className="col-lg-6">
          <div className="card glass-card p-4 h-100">
            <h3 className="h5 fw-bold text-primary-custom mb-3 d-flex align-items-center gap-2">
              <Trophy size={18} className="text-secondary" />
              <span>Cosmic Badges</span>
            </h3>
            
            <div className="d-flex flex-column gap-3">
              {achievements.length === 0 ? (
                <div className="p-4 text-center text-muted-custom small">
                  No badges unlocked yet. Set goals to earn achievements!
                </div>
              ) : (
                achievements.map(badge => (
                  <AchievementCard 
                    key={badge.id}
                    title={badge.title}
                    description={badge.description}
                    icon={ICON_MAP[badge.icon] || BadgeCheck}
                    isLocked={badge.isLocked}
                  />
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: Planet Overview grids (incorporates search filter and routing parameters wrapper) */}
      <div className="mb-4">
        <h3 className="h4 fw-bold text-primary-custom mb-1">Your Planetary Grid</h3>
        <p className="text-muted-custom small mb-0">Select any orbital coordinate below to configure checkpoints.</p>
      </div>

      {filteredPlanets.length === 0 ? (
        <div className="card glass-card p-5 text-center text-muted-custom">
          No coordinates matching search parameters found in this sector.
        </div>
      ) : (
        <div className="row g-4">
          {filteredPlanets.map((planet) => {
            const IconComp = ICON_MAP[planet.icon] || Orbit;
            return (
              <div className="col-md-6 col-lg-4" key={planet.id}>
                <Link 
                  to={`/planet/${planet.planetName.toLowerCase()}`} 
                  className="text-decoration-none h-100 d-block"
                >
                  <PlanetCard 
                    planetName={planet.planetName}
                    icon={IconComp}
                    progress={planet.progress}
                    color={planet.color}
                    description={planet.description}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default Dashboard;
