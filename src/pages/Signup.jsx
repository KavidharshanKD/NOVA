import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, User, Mail, Lock, Globe, Sparkles, BookOpen, Clock, Target } from 'lucide-react';
import useAuth from '../hooks/useAuth';

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    ageGroup: '18-24',
    education: 'Bachelors',
    occupation: 'Student',
    country: '',
    dailyFreeTime: '3-4 hours',
    primaryGoal: 'Learn React',
    learningStyle: 'Visual'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Password strength check (identical criteria as Login)
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{6,}$/;
    if (!regex.test(formData.password)) {
      setError("Password must contain at least 6 characters, one uppercase letter, one digit, and one special character.");
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-md-10 col-lg-8">
          <div className="card glass-card p-4 shadow-lg text-center" style={{ borderTop: '4px solid var(--primary-color)' }}>
            <div className="card-body p-0">
              
              <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3 bg-primary bg-opacity-10 text-primary" style={{ width: '50px', height: '50px' }}>
                <Sparkles size={26} className="text-primary" />
              </div>
              
              <h2 className="h3 fw-bold text-primary-custom mb-1">Establish Cosmic Signature</h2>
              <p className="text-muted-custom small mb-4">Register your metrics to compile recommendations.</p>

              <form onSubmit={handleSubmit} className="text-start">
                <div className="row g-3">
                  
                  {/* Personal Block */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                        <User size={14} className="text-primary" />
                        <span>First Name</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                        <Mail size={14} className="text-primary" />
                        <span>Email Sector</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                        <Lock size={14} className="text-primary" />
                        <span>Security Cryptokey</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Uppercase, digit & symbol"
                        className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                        <Globe size={14} className="text-primary" />
                        <span>Origin Country</span>
                      </label>
                      <input
                        type="text"
                        name="country"
                        className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Profile Metrics */}
                  <div className="col-md-4 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold">Age Group</label>
                      <select 
                        name="ageGroup" 
                        value={formData.ageGroup} 
                        onChange={handleChange}
                        className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                      >
                        <option value="18-24">18-24 solar cycles</option>
                        <option value="25-34">25-34 solar cycles</option>
                        <option value="35-44">35-44 solar cycles</option>
                        <option value="45+">45+ solar cycles</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold">Education</label>
                      <select 
                        name="education" 
                        value={formData.education} 
                        onChange={handleChange}
                        className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                      >
                        <option value="High School">High School</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold">Occupation</label>
                      <select 
                        name="occupation" 
                        value={formData.occupation} 
                        onChange={handleChange}
                        className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                      >
                        <option value="Student">Student</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Manager">Manager</option>
                        <option value="Designer">Designer</option>
                        <option value="Other">Other Profile</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        <span>Daily Free Time</span>
                      </label>
                      <select 
                        name="dailyFreeTime" 
                        value={formData.dailyFreeTime} 
                        onChange={handleChange}
                        className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                      >
                        <option value="1-2 hours">1-2 hours</option>
                        <option value="3-4 hours">3-4 hours</option>
                        <option value="5+ hours">5+ hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                        <Target size={14} className="text-primary" />
                        <span>Primary Goal</span>
                      </label>
                      <select 
                        name="primaryGoal" 
                        value={formData.primaryGoal} 
                        onChange={handleChange}
                        className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
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

                  <div className="col-md-4 col-sm-6">
                    <div className="mb-3">
                      <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                        <BookOpen size={14} className="text-primary" />
                        <span>Learning Style</span>
                      </label>
                      <select 
                        name="learningStyle" 
                        value={formData.learningStyle} 
                        onChange={handleChange}
                        className="form-select bg-dark bg-opacity-75 border border-secondary border-opacity-20 text-white"
                        style={{ height: '40px', borderRadius: '10px' }}
                      >
                        <option value="Visual">Visual (Charts, UI)</option>
                        <option value="Auditory">Auditory (Lectures, Audio)</option>
                        <option value="Reading/Writing">Reading & Writing</option>
                        <option value="Kinesthetic">Kinesthetic (Practical Labs)</option>
                      </select>
                    </div>
                  </div>

                </div>

                {error && (
                  <div className="alert alert-danger border border-danger border-opacity-20 bg-danger bg-opacity-10 text-danger p-3 rounded my-3 d-flex align-items-start gap-2 small">
                    <ShieldAlert size={16} className="mt-1 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success border border-success border-opacity-20 bg-success bg-opacity-10 text-success p-3 rounded my-3 d-flex align-items-center gap-2 small">
                    <ShieldCheck size={18} />
                    <span className="fw-semibold">Cosmic signature verified! Teleporting to dashboard...</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn cosmic-btn cosmic-btn-primary w-100 py-2 mt-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading || success}
                >
                  <ShieldCheck size={18} />
                  <span>{loading ? 'Compiling Parameters...' : 'Establish Profile Link'}</span>
                </button>
              </form>

              <div className="mt-4 text-center">
                <span className="text-muted-custom small">Already linked coordinates? </span>
                <Link to="/" className="text-primary text-decoration-none small fw-semibold hover-opacity">
                  Sign In Terminal
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
