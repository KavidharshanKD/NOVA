import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary Component (Class Component)
 * Handles crash recovery across child component subtrees.
 * Displays a premium cosmic error dashboard when rendering crashes.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an active runtime overflow:", error, errorInfo);
  }

  handleReset = () => {
    // Clear storage token and redirect to reload baseline state
    localStorage.removeItem('nova_auth_token');
    localStorage.removeItem('nova_user_info');
    sessionStorage.removeItem('nova_auth_token');
    sessionStorage.removeItem('nova_user_info');
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="d-flex align-items-center justify-content-center min-vh-100 p-3"
          style={{
            background: 'radial-gradient(circle at center, #0F172A 0%, #020617 100%)',
            color: 'var(--text-primary)'
          }}
        >
          <div 
            className="card glass-card p-5 text-center" 
            style={{ 
              maxWidth: '520px', 
              borderColor: 'rgba(239, 68, 68, 0.2)',
              boxShadow: '0 12px 40px rgba(239, 68, 68, 0.1)'
            }}
          >
            <div className="d-flex justify-content-center mb-4 text-danger">
              <div 
                className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <AlertCircle size={42} />
              </div>
            </div>

            <h2 className="h4 fw-bold text-white mb-2">TIMELINE OVERFLOW DETECTED</h2>
            <p className="text-muted-custom small mb-4">
              Nova encountered an unexpected telemetry synchronization error. The cosmic timeline has drifted. Please reset coordinates to return to base.
            </p>

            <div className="mb-4 p-3 rounded bg-dark bg-opacity-40 border border-secondary border-opacity-10 text-start text-danger fs-8">
              <code className="text-danger font-monospace" style={{ wordBreak: 'break-all', fontSize: '0.8rem' }}>
                {this.state.error?.toString() || 'Unknown timeline anomaly'}
              </code>
            </div>

            <div className="d-flex flex-column gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-outline-light d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill"
                style={{ fontSize: '0.9rem' }}
              >
                <RefreshCw size={15} />
                <span>Re-sync Timeline</span>
              </button>
              <button 
                onClick={this.handleReset}
                className="btn btn-link text-muted-custom small hover-opacity text-decoration-none"
              >
                Reset Coordinates & Return to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
