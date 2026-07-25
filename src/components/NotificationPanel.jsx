import React, { useState, useRef, useEffect } from 'react';
import { Bell, Zap, Trophy, BadgeCheck, Info, AlertTriangle, Trash2 } from 'lucide-react';
import { notificationService } from '../services/api';

/**
 * NotificationPanel Component (Functional Component)
 * Demonstrates:
 * - Local state toggling (isOpen)
 * - Array rendering of objects (mapping notifications list)
 * - Dynamic SVG icon selection based on event types (xp, achievement, mission, warning)
 * - Conditional layout classes
 */
function NotificationPanel({ notifications, setNotifications }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pick suitable Lucide icon for each log entry
  const getLogIcon = (type) => {
    switch (type) {
      case 'xp':
        return <Zap size={15} className="text-warning fill-warning" />;
      case 'achievement':
        return <Trophy size={15} className="text-secondary" />;
      case 'success':
      case 'mission':
        return <BadgeCheck size={15} className="text-success" />;
      case 'warning':
        return <AlertTriangle size={15} className="text-danger" />;
      default:
        return <Info size={15} className="text-info" />;
    }
  };

  const handleClearAll = async (e) => {
    e.stopPropagation();
    try {
      await notificationService.markRead();
      if (setNotifications) {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to clear notifications on server:", err);
    }
  };


  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Bell Button trigger */}
      <button 
        className="btn btn-outline-light rounded-circle p-2 d-flex align-items-center justify-content-center position-relative"
        style={{ 
          width: '40px', 
          height: '40px', 
          borderColor: 'var(--card-border)',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-primary)'
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Activity logs"
        title="Recent Activity"
      >
        <Bell size={18} />
        
        {/* Unread badge count (Logical && Rendering) */}
        {notifications.length > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark"
            style={{ fontSize: '0.68rem', padding: '4px 6px' }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {/* Activity Log dropdown wrapper (Conditional rendering via absolute display) */}
      {isOpen && (
        <div 
          className="card glass-card position-absolute end-0 mt-2 p-3 shadow-lg"
          style={{ 
            width: '320px', 
            zIndex: 1050, 
            background: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
            borderRadius: '16px'
          }}
        >
          <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom border-secondary border-opacity-10">
            <h5 className="h6 mb-0 fw-bold text-primary-custom d-flex align-items-center gap-2">
              <Bell size={15} className="text-primary" />
              <span>Cosmic Logs</span>
            </h5>
            
            {notifications.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="btn btn-link text-danger p-0 text-decoration-none fs-7 d-flex align-items-center gap-1"
                style={{ fontSize: '0.8rem' }}
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* List panel */}
          <div className="overflow-auto" style={{ maxHeight: '250px' }}>
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-muted-custom small">
                No recent activity in this quadrant.
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-2 rounded bg-dark bg-opacity-20 border border-secondary border-opacity-5 d-flex gap-2 align-items-start"
                  >
                    <span className="mt-1 flex-shrink-0">
                      {getLogIcon(item.type)}
                    </span>
                    <div className="flex-grow-1">
                      <p className="mb-0 text-secondary-custom lh-sm" style={{ fontSize: '0.82rem' }}>
                        {item.text}
                      </p>
                      <span className="text-muted-custom fs-9" style={{ fontSize: '0.7rem' }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
