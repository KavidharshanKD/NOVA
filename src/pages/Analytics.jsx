import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, Target, Zap, Activity, BookOpen, Briefcase, HeartPulse } from 'lucide-react';
import { analyticsService } from '../services/api';

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const stats = await analyticsService.getAnalytics();
        setData(stats);
      } catch (err) {
        console.error("Failed to load analytics registries:", err);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted-custom">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p>Retrieving galactic progress ledger...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-5 text-center text-muted-custom">
        <p>No analytics data loaded for this sector. Complete daily missions first!</p>
      </div>
    );
  }

  // Custom tooltips matching cosmic styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-dark bg-opacity-90 border border-secondary border-opacity-25 rounded shadow-lg text-start" style={{ fontSize: '0.8rem' }}>
          <p className="mb-1 text-white fw-bold">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="mb-0" style={{ color: p.color || p.fill }}>
              {p.name}: <span className="fw-bold">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#6366F1', '#F59E0B', '#22C55E', '#8B5CF6', '#3B82F6', '#EC4899', '#14B8A6', '#EF4444', '#F43F5E'];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-5 text-center text-md-start">
        <h2 className="display-6 fw-bold cosmic-title mb-1">Galactic Ledger & Analytics</h2>
        <p className="text-muted-custom">Deep analysis metrics of your cognitive growth and planetary progress.</p>
      </div>

      {/* Overview stats cards */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card glass-card p-4 text-center">
            <h4 className="text-muted-custom small uppercase fw-bold mb-2">XP Rank</h4>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <Zap size={22} className="text-warning fill-current" />
              <strong className="fs-3 text-primary-custom">{data.summary.currentXp} XP</strong>
            </div>
            <p className="text-muted-custom small mb-0">Lvl {data.summary.level} – {data.summary.title}</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card glass-card p-4 text-center">
            <h4 className="text-muted-custom small uppercase fw-bold mb-2">Directive Completion</h4>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <Target size={22} className="text-success" />
              <strong className="fs-3 text-primary-custom">{data.summary.completionRate}%</strong>
            </div>
            <p className="text-muted-custom small mb-0">{data.summary.completedMissions} of {data.summary.totalMissions} directives</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card glass-card p-4 text-center">
            <h4 className="text-muted-custom small uppercase fw-bold mb-2">Productivity Index</h4>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <Activity size={22} className="text-info" />
              <strong className="fs-3 text-primary-custom">
                {data.productivityTrend.length > 0 ? data.productivityTrend[data.productivityTrend.length - 1].productivity : 75}/100
              </strong>
            </div>
            <p className="text-muted-custom small mb-0">Steady orbital growth detected</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Graphs Grid */}
      <div className="row g-4 mb-4">
        
        {/* Weekly Progress & XP Growth */}
        <div className="col-lg-8">
          <div className="card glass-card p-4">
            <h3 className="h5 fw-bold text-primary-custom mb-4">Weekly Directive & XP Load</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={data.weeklyProgress} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="xp" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorXp)" name="XP Earned" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mission Completion ratio */}
        <div className="col-lg-4">
          <div className="card glass-card p-4">
            <h3 className="h5 fw-bold text-primary-custom mb-4">Missions Split</h3>
            <div style={{ width: '100%', height: 300 }} className="d-flex flex-column align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.missionCompletion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.missionCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--success-color)' : 'rgba(255,255,255,0.08)'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="d-flex gap-4 mt-2 justify-content-center">
                <span className="small text-secondary-custom d-flex align-items-center gap-1.5">
                  <span className="d-inline-block rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: 'var(--success-color)' }}></span>
                  Completed: {data.missionCompletion[0]?.value || 0}
                </span>
                <span className="small text-secondary-custom d-flex align-items-center gap-1.5">
                  <span className="d-inline-block rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: 'rgba(255,255,255,0.2)' }}></span>
                  Pending: {data.missionCompletion[1]?.value || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Planet Distribution */}
        <div className="col-lg-6">
          <div className="card glass-card p-4">
            <h3 className="h5 fw-bold text-primary-custom mb-4">Planets Distribution Progress</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.planetDistribution}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={9} />
                  <Radar name="Planet Orbit Progress %" dataKey="progress" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Productivity Score Trend */}
        <div className="col-lg-6">
          <div className="card glass-card p-4">
            <h3 className="h5 fw-bold text-primary-custom mb-4">Daily Productivity Trend</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={data.productivityTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="productivity" stroke="#22C55E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Productivity Index" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* XP Growth Line */}
        <div className="col-lg-12">
          <div className="card glass-card p-4">
            <h3 className="h5 fw-bold text-primary-custom mb-4">Galactic Cumulative XP Growth</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={data.xpGrowth} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorXpGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="totalXp" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorXpGrowth)" name="Cumulative XP" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;
