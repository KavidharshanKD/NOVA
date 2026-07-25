import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Mail, ArrowLeft, Orbit } from 'lucide-react';
import useAuth from '../hooks/useAuth';

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setSuccess(data.message || 'Recovery keycodes dispatched successfully. Verify inbox.');
      setLoading(false);
    } catch (err) {
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
              
              <h2 className="h3 fw-bold text-primary-custom mb-1">Recover Coordinate</h2>
              <p className="text-muted-custom small mb-4">Provide authorization mail to recover cryptokey access link.</p>

              <form onSubmit={handleSubmit} className="text-start">
                <div className="mb-4">
                  <label className="form-label text-secondary-custom small fw-semibold d-flex align-items-center gap-2">
                    <Mail size={14} className="text-primary" />
                    <span>Registered Email Address</span>
                  </label>
                  <input
                    type="email"
                    className="form-control bg-dark bg-opacity-25 border border-secondary border-opacity-20 text-white"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-primary)', height: '44px', borderRadius: '10px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="alert alert-danger border border-danger border-opacity-20 bg-danger bg-opacity-10 text-danger p-3 rounded mb-4 d-flex align-items-start gap-2 small">
                    <ShieldAlert size={16} className="mt-1 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success border border-success border-opacity-20 bg-success bg-opacity-10 text-success p-3 rounded mb-4 d-flex align-items-start gap-2 small">
                    <ShieldCheck size={18} className="flex-shrink-0 mt-1" />
                    <span>{success}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn cosmic-btn cosmic-btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  <span>{loading ? 'Dispatched Request...' : 'Send Recovery cryptokey'}</span>
                </button>
              </form>

              <div className="mt-4 text-center d-flex align-items-center justify-content-center gap-2">
                <ArrowLeft size={14} className="text-primary" />
                <Link to="/" className="text-primary text-decoration-none small fw-semibold hover-opacity">
                  Back to Terminal
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
