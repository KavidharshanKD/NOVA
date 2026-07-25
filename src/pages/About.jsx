import React from 'react';
import { Sparkles, Info, Compass, Layers, Zap, Palette, HelpCircle, Code } from 'lucide-react';

/**
 * About Page (Functional Component)
 * Refactored to:
 * - Implement Lucide SVG icons next to technology cards and details
 * - Ensure proper text contrast and high visibility
 */
function About() {
  const reactConceptsList = [
    { name: "JSX Rendering", description: "All pages compile logic directly into readable XML-like structures." },
    { name: "Functional Components", description: "Entire codebase uses standard React hook-based functions." },
    { name: "Parent to Child Props", description: "Dashboard passes configuration data downstream to PlanetCards." },
    { name: "Separate Files", description: "Every component is isolated into its own file for maintainability." },
    { name: "useState Hook", description: "Universe manages Mission Status and planet counting dynamically." },
    { name: "Conditional Rendering", description: "Progress badges display stateful text warnings dynamically." },
    { name: "Logical && Operator", description: "Awarding 'Planet Master' badges only when progress equals 100%." },
    { name: "Parent-Child Updates", description: "Universe page updates global planet count via parent handler." },
    { name: "React Router Navigation", description: "Seamless page transitions via client-side routing routes." },
  ];

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="mb-5 text-center text-md-start">
        <h2 className="display-6 fw-bold cosmic-title mb-1">About Nova Project</h2>
        <p className="text-muted-custom">Exploring personal development and React framework fundamentals.</p>
      </div>

      <div className="row g-4">
        {/* Project Description Column */}
        <div className="col-lg-6">
          <div className="card glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Info size={24} className="text-primary" />
              <h3 className="h4 fw-bold mb-0 text-primary-custom">Project Vision</h3>
            </div>
            <p className="subtitle-text mb-4">
              Nova is a growth tracker that gamifies self-improvement. By representing core life pillars—Learning, Career, Health, and Projects—as planets, users can visualize their focus as a balanced, expanding universe.
            </p>
            <p className="text-muted-custom mb-4">
              Version 1.0 represents the frontend core prototype designed for laboratory assessments. It establishes clean UI structures without complex databases or APIs, keeping the learning curve shallow and focusable.
            </p>
            
            <h4 className="h6 text-uppercase text-secondary fw-semibold mb-3">Technologies Used</h4>
            <div className="d-flex flex-wrap gap-3">
              <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-25 px-3 py-2 rounded d-flex align-items-center gap-2 text-secondary-custom">
                <Code size={16} className="text-primary" />
                <span>React 18</span>
              </span>
              <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-25 px-3 py-2 rounded d-flex align-items-center gap-2 text-secondary-custom">
                <Zap size={16} className="text-warning" />
                <span>Vite Builder</span>
              </span>
              <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-25 px-3 py-2 rounded d-flex align-items-center gap-2 text-secondary-custom">
                <Compass size={16} className="text-info" />
                <span>React Router</span>
              </span>
              <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-25 px-3 py-2 rounded d-flex align-items-center gap-2 text-secondary-custom">
                <Layers size={16} className="text-secondary" />
                <span>Bootstrap 5</span>
              </span>
              <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-25 px-3 py-2 rounded d-flex align-items-center gap-2 text-secondary-custom">
                <Palette size={16} className="text-danger" />
                <span>Vanilla CSS</span>
              </span>
            </div>
          </div>
        </div>

        {/* React Concepts Reference Column */}
        <div className="col-lg-6">
          <div className="card glass-card p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Sparkles size={24} className="text-primary" />
              <h3 className="h4 fw-bold mb-0 text-primary-custom">Implemented React Concepts</h3>
            </div>
            <div className="row g-3">
              {reactConceptsList.map((concept, index) => (
                <div className="col-md-6" key={index}>
                  <div className="p-3 rounded bg-dark bg-opacity-25 border border-secondary border-opacity-10 h-100">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <HelpCircle size={14} className="text-primary" />
                      <strong className="text-info">{concept.name}</strong>
                    </div>
                    <span className="text-muted-custom fs-7" style={{ fontSize: '0.82rem', display: 'block', lineHeight: '1.3' }}>
                      {concept.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
