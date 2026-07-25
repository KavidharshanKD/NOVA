import React, { useState, useEffect } from 'react';
import { Target, Award, Zap, Star, Trash2, Calendar, AlertCircle, Plus, Filter, RefreshCw } from 'lucide-react';
import { missionService } from '../services/api';
import useAuth from '../hooks/useAuth';
import MissionCard from '../components/MissionCard';

function Missions() {
  const { user, refreshProfile } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMission, setNewMission] = useState({
    title: '',
    difficulty: 'Medium',
    planet: 'Learning',
    isImportant: false,
    dueDate: new Date().toISOString().split('T')[0]
  });

  // Filters state
  const [filters, setFilters] = useState({
    status: '', // 'Completed', 'Pending', 'Skipped', 'Rescheduled'
    difficulty: '', // 'Easy', 'Medium', 'Hard'
    planet: '',
    isImportant: '' // 'true'
  });

  const loadMissions = async () => {
    setLoading(true);
    try {
      // Build filters payload
      const payload = {};
      if (filters.status) {
        if (filters.status === 'Completed') payload.completed = 'true';
        else if (filters.status === 'Pending') payload.completed = 'false';
        else payload.status = filters.status;
      }
      if (filters.difficulty) payload.difficulty = filters.difficulty;
      if (filters.planet) payload.planet = filters.planet;
      if (filters.isImportant === 'true') payload.isImportant = 'true';

      const data = await missionService.getMissions(payload);
      setMissions(data);
    } catch (e) {
      console.error("Failed to load missions:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMissions();
  }, [filters]);

  const handleToggleMissionStatus = async (id) => {
    const mission = missions.find(m => m._id === id || m.id === id);
    if (!mission) return;

    try {
      const newStatus = mission.completed ? 'Pending' : 'Completed';
      const updated = await missionService.updateMissionStatus(mission._id || mission.id, newStatus);
      setMissions(prev => prev.map(m => (m._id === id || m.id === id) ? updated : m));
      await refreshProfile();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleAddMission = async (e) => {
    e.preventDefault();
    if (!newMission.title) return;

    try {
      const created = await missionService.createMission(newMission);
      setMissions(prev => [created, ...prev]);
      setNewMission({
        title: '',
        difficulty: 'Medium',
        planet: 'Learning',
        isImportant: false,
        dueDate: new Date().toISOString().split('T')[0]
      });
      setShowAddForm(false);
      await refreshProfile();
    } catch (err) {
      console.error("Failed to add mission directive:", err);
    }
  };

  const handleToggleImportant = async (id) => {
    try {
      const updated = await missionService.toggleMissionImportant(id);
      setMissions(prev => prev.map(m => (m._id === id || m.id === id) ? updated : m));
    } catch (err) {
      console.error("Failed to toggle importance:", err);
    }
  };

  const handleDeleteMission = async (id) => {
    if (!window.confirm("Disconnect this mission directive from your timeline?")) return;
    try {
      await missionService.deleteMission(id);
      setMissions(prev => prev.filter(m => m._id !== id && m.id !== id));
      await refreshProfile();
    } catch (err) {
      console.error("Failed to delete mission:", err);
    }
  };

  const handleReschedule = async (id) => {
    const newDate = window.prompt("Enter new target completion date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    if (!newDate) return;

    try {
      const updated = await missionService.updateMissionStatus(id, 'Rescheduled');
      setMissions(prev => prev.map(m => (m._id === id || m.id === id) ? updated : m));
    } catch (err) {
      console.error("Failed to reschedule mission:", err);
    }
  };

  const handleSkip = async (id) => {
    if (!window.confirm("Skip this mission directive? XP rewards will not accumulate.")) return;
    try {
      const updated = await missionService.updateMissionStatus(id, 'Skipped');
      setMissions(prev => prev.map(m => (m._id === id || m.id === id) ? updated : m));
    } catch (err) {
      console.error("Failed to skip mission:", err);
    }
  };

  const completedCount = missions.filter(m => m.completed).length;
  const totalCount = missions.length;
  const xpAccumulated = missions.filter(m => m.completed).reduce((acc, curr) => acc + curr.xpReward, 0);

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5 text-center text-md-start">
        <div>
          <h2 className="display-6 fw-bold cosmic-title mb-1">Missions Terminal</h2>
          <p className="text-muted-custom mb-0">Complete directives to earn cosmic XP and expand your orbital reach.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn cosmic-btn cosmic-btn-primary d-flex align-items-center gap-2"
        >
          <Plus size={16} />
          <span>Deploy Custom Directive</span>
        </button>
      </div>

      {/* Add custom mission form */}
      {showAddForm && (
        <div className="card glass-card p-4 mb-4">
          <h3 className="h5 fw-bold text-primary-custom mb-3">Initialize Custom Directive</h3>
          <form onSubmit={handleAddMission}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label text-muted-custom small mb-1">Directive Objective</label>
                <input
                  type="text"
                  placeholder="e.g. Read 20 pages React guide"
                  className="form-control bg-dark bg-opacity-20 text-white"
                  value={newMission.title}
                  onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-muted-custom small mb-1">Difficulty Metric</label>
                <select 
                  className="form-select bg-dark bg-opacity-20 text-white"
                  value={newMission.difficulty}
                  onChange={(e) => setNewMission({ ...newMission, difficulty: e.target.value })}
                >
                  <option value="Easy">Easy (+30 XP)</option>
                  <option value="Medium">Medium (+40 XP)</option>
                  <option value="Hard">Hard (+50 XP)</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label text-muted-custom small mb-1">Planet Sector</label>
                <select 
                  className="form-select bg-dark bg-opacity-20 text-white"
                  value={newMission.planet}
                  onChange={(e) => setNewMission({ ...newMission, planet: e.target.value })}
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

              <div className="col-md-4">
                <label className="form-label text-muted-custom small mb-1">Timeline Target</label>
                <input
                  type="date"
                  className="form-control bg-dark bg-opacity-20 text-white"
                  value={newMission.dueDate}
                  onChange={(e) => setNewMission({ ...newMission, dueDate: e.target.value })}
                />
              </div>

              <div className="col-md-4 d-flex align-items-center pt-4">
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    id="importantCheck"
                    className="form-check-input bg-dark bg-opacity-50"
                    checked={newMission.isImportant}
                    onChange={(e) => setNewMission({ ...newMission, isImportant: e.target.checked })}
                  />
                  <label htmlFor="importantCheck" className="form-check-label text-muted-custom cursor-pointer small">
                    Flag as Critical Priority
                  </label>
                </div>
              </div>
            </div>
            
            <button type="submit" className="btn btn-sm cosmic-btn cosmic-btn-primary px-4">
              Deploy Directive
            </button>
          </form>
        </div>
      )}

      {/* SECTION: Filters panel */}
      <div className="card glass-card p-3 mb-4 d-flex flex-row align-items-center justify-content-between flex-wrap gap-2">
        <span className="small text-secondary-custom d-flex align-items-center gap-1.5 fw-bold">
          <Filter size={14} className="text-primary" />
          <span>Filters:</span>
        </span>
        <div className="d-flex flex-wrap gap-2">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="form-select form-select-sm bg-dark bg-opacity-50 text-white border-secondary border-opacity-10 py-1"
            style={{ width: '130px', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            <option value="">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Skipped">Skipped</option>
            <option value="Rescheduled">Rescheduled</option>
          </select>

          <select 
            value={filters.difficulty} 
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="form-select form-select-sm bg-dark bg-opacity-50 text-white border-secondary border-opacity-10 py-1"
            style={{ width: '130px', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            <option value="">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select 
            value={filters.planet} 
            onChange={(e) => setFilters({ ...filters, planet: e.target.value })}
            className="form-select form-select-sm bg-dark bg-opacity-50 text-white border-secondary border-opacity-10 py-1"
            style={{ width: '130px', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            <option value="">Sector: All</option>
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

          <select 
            value={filters.isImportant} 
            onChange={(e) => setFilters({ ...filters, isImportant: e.target.value })}
            className="form-select form-select-sm bg-dark bg-opacity-50 text-white border-secondary border-opacity-10 py-1"
            style={{ width: '140px', fontSize: '0.8rem', borderRadius: '8px' }}
          >
            <option value="">Priority: All</option>
            <option value="true">Important Only</option>
          </select>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="row g-4">
        
        {/* Main Quest List (Left Side) */}
        <div className="col-lg-8">
          <div className="card glass-card p-4">
            <h3 className="h4 fw-bold text-primary-custom mb-4 d-flex align-items-center gap-2">
              <Target size={20} className="text-primary" />
              <span>Active Quad Directives</span>
            </h3>

            {loading ? (
              <div className="py-5 text-center text-muted-custom">
                <RefreshCw size={24} className="spin-animation mb-2 text-primary" />
                <p>Syncing timelines...</p>
              </div>
            ) : missions.length === 0 ? (
              <div className="py-5 text-center text-muted-custom">
                No directives loaded in this sector matching filters.
              </div>
            ) : (
              <div>
                {missions.map((mission) => (
                  <MissionCard 
                    key={mission._id || mission.id}
                    mission={mission}
                    onToggle={handleToggleMissionStatus}
                    onToggleImportant={handleToggleImportant}
                    onReschedule={handleReschedule}
                    onSkip={handleSkip}
                    onDelete={handleDeleteMission}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quest Status Side Panel (Right Side) */}
        <div className="col-lg-4">
          <div className="card glass-card p-4">
            <h3 className="h4 fw-bold text-primary-custom mb-4">Command Overview</h3>
            
            <div className="d-flex flex-column gap-3">
              {/* Level Stat */}
              <div className="p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-15">
                <div className="d-flex justify-content-between align-items-center mb-1 text-muted-custom small">
                  <span>Current Level</span>
                  <Award size={16} className="text-secondary" />
                </div>
                <strong className="fs-4 text-primary-custom">Level {user?.level || 1}</strong>
              </div>

              {/* XP Stat */}
              <div className="p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-15">
                <div className="d-flex justify-content-between align-items-center mb-1 text-muted-custom small">
                  <span>XP Balance</span>
                  <Zap size={16} className="text-warning fill-current" />
                </div>
                <strong className="fs-4 text-primary-custom">{user?.xp || 0} XP</strong>
              </div>

              {/* Progress Summary */}
              <div className="p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-15">
                <span className="text-muted-custom small d-block mb-2">Today's Progress</span>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold text-primary-custom">{completedCount} / {totalCount} Completed</span>
                  <span className="text-success small fw-medium">+{xpAccumulated} XP earned</span>
                </div>
                
                {/* Visual completion progress bar */}
                <div className="cosmic-progress-container" style={{ height: '6px' }}>
                  <div 
                    className="cosmic-progress-bar"
                    style={{ 
                      width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                      backgroundColor: 'var(--success-color)'
                    }}
                  ></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Missions;
