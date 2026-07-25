import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Globe, Sparkles, BookOpen, Clock, Target, 
  Settings as SettingsIcon, Award, Zap, Coins, CheckSquare, 
  Trash2, ShieldCheck, ShieldAlert
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { profileService, settingsService } from '../services/api';

function Profile() {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('callsign'); // 'callsign' | 'preferences' | 'stats'
  
  // Profile edit states
  const [profileData, setProfileData] = useState({
    firstName: '',
    ageGroup: '18-24',
    education: 'Bachelors',
    occupation: 'Student',
    country: '',
    dailyFreeTime: '3-4 hours',
    primaryGoal: 'Learn React',
    learningStyle: 'Visual'
  });

  // Settings states
  const [settingsData, setSettingsData] = useState({
    darkMode: true,
    accentColor: '#6366F1',
    fontSize: 'medium',
    notificationsEnabled: true,
    language: 'en'
  });

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ success: '', error: '' });

  useEffect(() => {
    if (!user) return;
    
    const loadProfileAndSettings = async () => {
      try {
        const profile = await profileService.getProfile();
        setProfileData({
          firstName: profile.firstName || '',
          ageGroup: profile.ageGroup || '18-24',
          education: profile.education || 'Bachelors',
          occupation: profile.occupation || 'Student',
          country: profile.country || '',
          dailyFreeTime: profile.dailyFreeTime || '3-4 hours',
          primaryGoal: profile.primaryGoal || 'Learn React',
          learningStyle: profile.learningStyle || 'Visual'
        });

        const settings = await settingsService.getSettings();
        setSettingsData({
          darkMode: settings.darkMode,
          accentColor: settings.accentColor || '#6366F1',
          fontSize: settings.fontSize || 'medium',
          notificationsEnabled: settings.notificationsEnabled,
          language: settings.language || 'en'
        });
      } catch (err) {
        console.error("Failed to load user parameters:", err);
      }
      setLoading(false);
    };

    loadProfileAndSettings();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ success: '', error: '' });
    try {
      const updated = await profileService.updateProfile(profileData);
      setFeedback({ success: 'Callsign parameters re-compiled successfully! ML recommendations updated.', error: '' });
      await refreshProfile();
    } catch (err) {
      setFeedback({ success: '', error: err.response?.data?.error || 'Failed to update profile.' });
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ success: '', error: '' });
    try {
      const updated = await settingsService.updateSettings(settingsData);
      setFeedback({ success: 'Preferences saved and applied. Theme settings synchronized.', error: '' });
      // If theme mode changed, trigger App.jsx reload/state sync by refreshing profile
      await refreshProfile();
      // Apply body/app classes immediately
      const root = document.querySelector('.app-wrapper');
      if (root) {
        if (settingsData.darkMode) {
          root.classList.remove('light-theme');
          root.classList.add('dark-theme');
        } else {
          root.classList.remove('dark-theme');
          root.classList.add('light-theme');
        }
      }
    } catch (err) {
      setFeedback({ success: '', error: 'Failed to save settings.' });
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted-custom">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading profile configuration registers...</p>
      </div>
    );
  }

  // Accent color choices mapping
  const accents = [
    { name: 'Indigo Space', hex: '#6366F1' },
    { name: 'Violet Nebula', hex: '#8B5CF6' },
    { name: 'Teal Aurora', hex: '#14B8A6' },
    { name: 'Emerging Green', hex: '#22C55E' },
    { name: 'Warning Orange', hex: '#F59E0B' },
    { name: 'Supernova Red', hex: '#EF4444' }
  ];

  return (
    <div className="container py-4">
      {/* Top calls banner */}
      <div className="card glass-card p-4 mb-4 text-center text-md-start">
        <div className="row align-items-center g-4">
          <div className="col-md-auto text-center">
            {/* Custom Glowing Avatar */}
            <div 
              className="rounded-circle d-inline-flex align-items-center justify-content-center border border-2 border-primary text-primary"
              style={{ 
                width: '100px', 
                height: '100px', 
                fontSize: '2.5rem', 
                fontWeight: 'bold',
                backgroundColor: 'rgba(99,102,241,0.06)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
              }}
            >
              {profileData.firstName.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="col-md">
            <h2 className="display-6 fw-bold text-primary-custom mb-1">{profileData.firstName}</h2>
            <p className="text-secondary-custom small d-flex align-items-center gap-1 justify-content-center justify-content-md-start mb-2">
              <Award size={15} className="text-primary" />
              <span>{user?.title || "Explorer"}</span>
              <span className="text-muted">&bull;</span>
              <span>Level {user?.level || 1} Rank</span>
            </p>
            <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start flex-wrap">
              <span className="badge status-badge d-flex align-items-center gap-1 bg-dark bg-opacity-20 border border-secondary border-opacity-10 text-warning">
                <Zap size={12} className="fill-current" />
                <span>{user?.xp || 0} XP</span>
              </span>
              <span className="badge status-badge d-flex align-items-center gap-1 bg-dark bg-opacity-20 border border-secondary border-opacity-10 text-info">
                <Coins size={12} />
                <span>{user?.coins || 10} Coins</span>
              </span>
              <span className="text-muted-custom small">Joined: {user?.joinedDate ? new Date(user.joinedDate).toLocaleDateString([], { month: 'long', year: 'numeric' }) : "July 2026"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation panel */}
      <div className="d-flex gap-2 mb-4 border-bottom border-secondary border-opacity-10 pb-2 flex-wrap">
        <button 
          onClick={() => { setActiveTab('callsign'); setFeedback({ success: '', error: '' }); }}
          className={`btn btn-link nav-link px-3 py-1 text-decoration-none fw-semibold ${activeTab === 'callsign' ? 'text-primary border-bottom border-2 border-primary fw-bold' : 'text-muted-custom'}`}
        >
          Sector Callsign
        </button>
        <button 
          onClick={() => { setActiveTab('preferences'); setFeedback({ success: '', error: '' }); }}
          className={`btn btn-link nav-link px-3 py-1 text-decoration-none fw-semibold ${activeTab === 'preferences' ? 'text-primary border-bottom border-2 border-primary fw-bold' : 'text-muted-custom'}`}
        >
          Preferences Console
        </button>
        <button 
          onClick={() => { setActiveTab('stats'); setFeedback({ success: '', error: '' }); }}
          className={`btn btn-link nav-link px-3 py-1 text-decoration-none fw-semibold ${activeTab === 'stats' ? 'text-primary border-bottom border-2 border-primary fw-bold' : 'text-muted-custom'}`}
        >
          Galaxy Stats
        </button>
      </div>

      {/* Feedback Messages */}
      {feedback.success && (
        <div className="alert alert-success border border-success border-opacity-20 bg-success bg-opacity-10 text-success p-3 rounded mb-4 d-flex align-items-center gap-2 small">
          <ShieldCheck size={18} />
          <span>{feedback.success}</span>
        </div>
      )}
      {feedback.error && (
        <div className="alert alert-danger border border-danger border-opacity-20 bg-danger bg-opacity-10 text-danger p-3 rounded mb-4 d-flex align-items-center gap-2 small">
          <ShieldAlert size={18} />
          <span>{feedback.error}</span>
        </div>
      )}

      {/* Tab: Callsign Details Edit */}
      {activeTab === 'callsign' && (
        <div className="card glass-card p-4">
          <h3 className="h5 fw-bold text-primary-custom mb-4 d-flex align-items-center gap-2">
            <User size={18} className="text-primary" />
            <span>Configure Telemetry Metrics</span>
          </h3>

          <form onSubmit={handleProfileSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">First Name Callsign</label>
                  <input
                    type="text"
                    className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-25 text-white"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">Origin Country Coordinate</label>
                  <input
                    type="text"
                    className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-25 text-white"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">Age Group</label>
                  <select 
                    value={profileData.ageGroup} 
                    onChange={(e) => setProfileData({ ...profileData, ageGroup: e.target.value })}
                    className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                  >
                    <option value="18-24">18-24 solar cycles</option>
                    <option value="25-34">25-34 solar cycles</option>
                    <option value="35-44">35-44 solar cycles</option>
                    <option value="45+">45+ solar cycles</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">Education Level</label>
                  <select 
                    value={profileData.education} 
                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                    className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                  >
                    <option value="High School">High School</option>
                    <option value="Bachelors">Bachelors</option>
                    <option value="Masters">Masters</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">Occupation Sector</label>
                  <select 
                    value={profileData.occupation} 
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Manager">Manager</option>
                    <option value="Designer">Designer</option>
                    <option value="Other">Other Profile</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">Daily Free Time Window</label>
                  <select 
                    value={profileData.dailyFreeTime} 
                    onChange={(e) => setProfileData({ ...profileData, dailyFreeTime: e.target.value })}
                    className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                  >
                    <option value="1-2 hours">1-2 hours</option>
                    <option value="3-4 hours">3-4 hours</option>
                    <option value="5+ hours">5+ hours</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">Primary Target Goal</label>
                  <select 
                    value={profileData.primaryGoal} 
                    onChange={(e) => setProfileData({ ...profileData, primaryGoal: e.target.value })}
                    className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                  >
                    <option value="Learn React">Learn React & Coding</option>
                    <option value="Career Advancement">Career Advancement</option>
                    <option value="Physical Fitness">Physical Fitness</option>
                    <option value="Mindfulness">Mindfulness & Peace</option>
                    <option value="Side Projects">Side Projects Development</option>
                    <option value="Financial Stability">Financial Stability</option>
                    <option value="Aesthetic Design">Aesthetic UI Design</option>
                    <option value="Better Relationships">Better Relationships</option>
                    <option value="Creative Writing">Creative Writing</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label text-muted-custom small mb-1">Cognitive Learning Style</label>
                  <select 
                    value={profileData.learningStyle} 
                    onChange={(e) => setProfileData({ ...profileData, learningStyle: e.target.value })}
                    className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                  >
                    <option value="Visual">Visual (Charts, UI)</option>
                    <option value="Auditory">Auditory (Lectures, Audio)</option>
                    <option value="Reading/Writing">Reading & Writing</option>
                    <option value="Kinesthetic">Kinesthetic (Practical Labs)</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="btn cosmic-btn cosmic-btn-primary px-4 mt-3">
              Re-compile Parameters
            </button>
          </form>
        </div>
      )}

      {/* Tab: Preferences & Settings Edit */}
      {activeTab === 'preferences' && (
        <div className="card glass-card p-4">
          <h3 className="h5 fw-bold text-primary-custom mb-4 d-flex align-items-center gap-2">
            <SettingsIcon size={18} className="text-primary" />
            <span>Preferences & Settings Control</span>
          </h3>

          <form onSubmit={handleSettingsSubmit}>
            <div className="row g-4">
              {/* Dark mode toggle */}
              <div className="col-md-6">
                <div className="form-check form-switch p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-10 d-flex align-items-center justify-content-between">
                  <div>
                    <label htmlFor="themeSwitch" className="form-check-label text-primary-custom fw-semibold small cursor-pointer d-block">
                      Dark Mode Theme
                    </label>
                    <span className="text-muted-custom small">Disable to invoke Light theme vectors.</span>
                  </div>
                  <input
                    type="checkbox"
                    id="themeSwitch"
                    className="form-check-input ms-0 cursor-pointer"
                    style={{ width: '45px', height: '24px' }}
                    checked={settingsData.darkMode}
                    onChange={(e) => setSettingsData({ ...settingsData, darkMode: e.target.checked })}
                  />
                </div>
              </div>

              {/* Notifications enable */}
              <div className="col-md-6">
                <div className="form-check form-switch p-3 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-10 d-flex align-items-center justify-content-between">
                  <div>
                    <label htmlFor="notifsSwitch" className="form-check-label text-primary-custom fw-semibold small cursor-pointer d-block">
                      Notifications Alert
                    </label>
                    <span className="text-muted-custom small">Deliver real-time directive and achievement logs.</span>
                  </div>
                  <input
                    type="checkbox"
                    id="notifsSwitch"
                    className="form-check-input ms-0 cursor-pointer"
                    style={{ width: '45px', height: '24px' }}
                    checked={settingsData.notificationsEnabled}
                    onChange={(e) => setSettingsData({ ...settingsData, notificationsEnabled: e.target.checked })}
                  />
                </div>
              </div>

              {/* Accent Color selection */}
              <div className="col-md-12">
                <label className="form-label text-muted-custom small mb-2 d-block">System Accent Color</label>
                <div className="d-flex gap-2 flex-wrap">
                  {accents.map((acc, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSettingsData({ ...settingsData, accentColor: acc.hex })}
                      className="btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 py-1 border border-secondary border-opacity-15"
                      style={{ 
                        backgroundColor: settingsData.accentColor === acc.hex ? `${acc.hex}22` : 'rgba(0,0,0,0.1)',
                        borderColor: settingsData.accentColor === acc.hex ? acc.hex : 'rgba(255,255,255,0.05)',
                        color: settingsData.accentColor === acc.hex ? acc.hex : 'var(--text-muted)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span className="d-inline-block rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: acc.hex }}></span>
                      <span>{acc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size */}
              <div className="col-md-6">
                <label className="form-label text-muted-custom small mb-1">Font Size Window</label>
                <select
                  value={settingsData.fontSize}
                  onChange={(e) => setSettingsData({ ...settingsData, fontSize: e.target.value })}
                  className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                >
                  <option value="small">Small size vectors</option>
                  <option value="medium">Medium standard size</option>
                  <option value="large">Large visibility scaling</option>
                </select>
              </div>

              {/* Language selection */}
              <div className="col-md-6">
                <label className="form-label text-muted-custom small mb-1">Interface Language</label>
                <select
                  value={settingsData.language}
                  onChange={(e) => setSettingsData({ ...settingsData, language: e.target.value })}
                  className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white"
                >
                  <option value="en">English (Universal Log)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn cosmic-btn cosmic-btn-primary px-4 mt-4">
              Apply Preferences
            </button>
          </form>
        </div>
      )}

      {/* Tab: Stats */}
      {activeTab === 'stats' && (
        <div className="card glass-card p-4 text-center">
          <h3 className="h5 fw-bold text-primary-custom mb-4 text-start">Galactic Sector Records</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-3 bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded">
                <Zap size={32} className="text-warning mb-2 fill-current" />
                <h4 className="fs-5 text-primary-custom mb-1">{user?.xp || 0} Points</h4>
                <span className="text-muted-custom small">Accumulated Experience balance</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded">
                <Coins size={32} className="text-info mb-2" />
                <h4 className="fs-5 text-primary-custom mb-1">{user?.coins || 10} Gold</h4>
                <span className="text-muted-custom small">Universal exchange credits</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 bg-dark bg-opacity-20 border border-secondary border-opacity-10 rounded">
                <CheckSquare size={32} className="text-success mb-2" />
                <h4 className="fs-5 text-primary-custom mb-1">Level {user?.level || 1} Rank</h4>
                <span className="text-muted-custom small">{user?.title || "Explorer"} Class</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
