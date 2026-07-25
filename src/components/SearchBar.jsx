import React from 'react';
import { Search } from 'lucide-react';

/**
 * SearchBar Component (Functional Component)
 * Demonstrates:
 * - Controlled input using value and onChange handlers
 * - Receiving state setters from parents via props
 * - Lucide React integration for search vector indicators
 */
function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="position-relative ms-lg-2" style={{ maxWidth: '240px', width: '100%' }}>
      {/* Icon placed absolutely inside input */}
      <span 
        className="position-absolute top-50 translate-middle-y start-0 ps-3 text-muted-custom"
        style={{ pointerEvents: 'none' }}
      >
        <Search size={16} />
      </span>
      
      {/* High-contrast accessible input field */}
      <input
        type="text"
        className="form-control rounded-pill ps-5 bg-dark bg-opacity-25 border border-secondary border-opacity-25 text-white"
        style={{ 
          fontSize: '0.88rem', 
          borderColor: 'var(--card-border)', 
          color: 'var(--text-primary)',
          height: '38px'
        }}
        placeholder="Search planets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search planets"
      />
    </div>
  );
}

export default SearchBar;
