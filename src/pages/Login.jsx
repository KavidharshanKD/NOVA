import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Key, Mail, Orbit } from 'lucide-react';
import useAuth from '../hooks/useAuth';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    // Password criteria check (must match signup rules)
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{6,}$/;
    if (!regex.test(password)) {
      setLoading(false);
      setError("Password must contain at least 6 characters, one uppercase letter, one digit, and one special character.");
      return;
    }

    try {
      await login(email, password, rememberMe);
      setSuccess(true);
    } catch (err) {
      setSuccess(false);
      setError(err);
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
        <div className="col-md-6 col-lg-5 col-xl-4">
          
          <div className="card glass-card p-4 shadow-lg text-center" style={{ borderTop: '4px solid var(--primary-color)' }}>
            <div className="card-body p-0">
              
              <div className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3 bg-primary bg-opacity-10 text-primary" style={{ width: '60px', height: '60px' }}>
                <Orbit size={32} className="text-primary" />
              </div>
              
              <h2 className="h3 fw-bold text-primary-custom mb-1">Nova Terminal</h2>
              <p className="text-muted-custom small mb-4">Provide authorization keycodes to establish link.</p>

              <form onSubmit={handleSubmit} className="text-start">
                
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                    <Mail size={14} className="text-primary" aria-hidden="true" />
                    <span>Commander Email</span>
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-white"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)', height: '44px', borderRadius: '10px' }}
                    placeholder="commander@nova.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Commander Email Address"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="login-password" className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                    <Key size={14} className="text-primary" aria-hidden="true" />
                    <span>Access Cryptokey</span>
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-white"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)', height: '44px', borderRadius: '10px' }}
                    placeholder="Min 6 chars, 1 uppercase, 1 digit, 1 special"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Access Cryptokey password"
                    required
                  />
                </div>

                {/* Remember Me and Forgot Password Group */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="form-check-input bg-dark bg-opacity-50 border-secondary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe" className="form-check-label text-muted-custom small cursor-pointer">
                      Remember Me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-primary text-decoration-none small hover-opacity">
                    Forgot Cryptokey?
                  </Link>
                </div>

                {error && (
                  <div 
                    className="alert alert-danger border border-danger border-opacity-20 bg-danger bg-opacity-10 text-danger p-3 rounded mb-4 d-flex align-items-start gap-2"
                    style={{ fontSize: '0.85rem', lineHeight: '1.4' }}
                  >
                    <ShieldAlert size={16} className="mt-1 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success border border-success border-opacity-20 bg-success bg-opacity-10 text-success p-3 rounded mb-4 d-flex align-items-center gap-2">
                    <ShieldCheck size={18} />
                    <span className="fw-semibold">Authorization keycode valid! Connecting...</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn cosmic-btn cosmic-btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading || success}
                >
                  <ShieldCheck size={18} />
                  <span>{loading ? 'Validating Signatures...' : 'Verify Authorization'}</span>
                </button>

              </form>

              <div className="mt-4 text-center">
                <span className="text-muted-custom small">New quadrant commander? </span>
                <Link to="/signup" className="text-primary text-decoration-none small fw-semibold hover-opacity">
                  Register Coordinates
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
