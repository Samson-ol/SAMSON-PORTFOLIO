import React from 'react';
import { Briefcase, Calendar, Building2, CheckCircle2 } from 'lucide-react';

const DEFAULT_EXPERIENCES = [
  {
    id: "exp-1",
    role: "Lead Data Analyst & BI Consultant",
    company: "Freelance / Analytics Advisory",
    location: "Lagos State, Nigeria",
    period: "2023 — Present",
    description: "End-to-end data analytics, SQL database optimization, and Power BI dashboard development for retail, e-commerce, and tech clients.",
    achievements: [
      "Audited client management dashboards, correcting metric discrepancies for 100% decision accuracy.",
      "Built DAX-powered Power BI models reducing weekly executive reporting time by 15+ hours."
    ],
    tools: ["Power BI", "SQL", "Excel", "Python"]
  },
  {
    id: "exp-2",
    role: "Data Science & Analytics Scholar",
    company: "Data Science Nigeria (DSN)",
    location: "Lagos State, Nigeria",
    period: "2024 — 2026",
    description: "Advanced Data Analytics Track focusing on statistical modeling, dashboard auditing, and business intelligence.",
    achievements: [
      "Audited retail transaction datasets in DSN Hackathon, rebuilding a validated DAX executive model."
    ],
    tools: ["Python", "SQL", "Excel", "Power BI"]
  }
];

export default function Experience({ experiences }) {
  const displayExperiences = React.useMemo(() => {
    const list = [...(experiences && experiences.length > 0 ? experiences : DEFAULT_EXPERIENCES)];
    return list.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      const dateA = a.startDate ? new Date(a.startDate) : (a.period?.includes('Present') ? new Date('2099-01-01') : new Date('2000-01-01'));
      const dateB = b.startDate ? new Date(b.startDate) : (b.period?.includes('Present') ? new Date('2099-01-01') : new Date('2000-01-01'));
      return dateB - dateA;
    });
  }, [experiences]);

  return (
    <section id="experience" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="badge-tag">
            <Briefcase size={14} /> Career Progression Path
          </div>
          <h2 className="section-title">
            Experience <span className="gradient-text">Milestone Path</span>
          </h2>
          <p className="section-subtitle">
            Curated career milestones connected step-by-step from foundational analytical scholarship to lead analytics advisory.
          </p>
        </div>

        {/* Stacked Cards Path Container */}
        <div className="experience-sketch-container" style={{ position: 'relative', maxWidth: '750px', margin: '0 auto', paddingLeft: '3.2rem' }}>
          
          {displayExperiences.map((item, idx) => {
            const isFirst = idx === 0;

            return (
              <div 
                key={item.id || idx} 
                style={{ 
                  position: 'relative', 
                  marginBottom: idx === displayExperiences.length - 1 ? 0 : '2.8rem' 
                }}
              >
                
                {/* Curved Connector Arrow to Card Above (matching exact user sketch) */}
                {!isFirst && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      left: '-3.2rem', 
                      top: '-2.4rem', 
                      height: '4rem', 
                      width: '3.2rem', 
                      pointerEvents: 'none',
                      zIndex: 3
                    }}
                  >
                    <svg width="100%" height="100%" viewBox="0 0 50 70" fill="none" style={{ overflow: 'visible', filter: 'drop-shadow(0 0 6px rgba(0,242,254,0.6))' }}>
                      <path 
                        d="M 38 65 C 2 50 2 20 38 8" 
                        stroke="url(#arrowGradient)" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        fill="none" 
                      />
                      {/* Arrowhead pointing into card above */}
                      <polygon 
                        points="38,2 46,9 36,15" 
                        fill="var(--accent-cyan)" 
                      />
                      <defs>
                        <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#00f2fe" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}

                {/* Main Experience Rounded Box Card */}
                <div 
                  className="glass-card glass-card-glow" 
                  style={{ 
                    padding: '1.4rem 1.6rem', 
                    borderRadius: '18px', 
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                    background: 'rgba(18, 24, 36, 0.85)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Top Line: Period Badge & Company */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-cyan)', background: 'rgba(0,242,254,0.1)', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(0,242,254,0.25)' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {item.period}
                    </span>

                    <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                      <Building2 size={14} style={{ color: 'var(--accent-purple)' }} /> {item.company}
                      {item.location && <span style={{ color: 'var(--text-muted)' }}>• {item.location}</span>}
                    </span>
                  </div>

                  {/* Role Title */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {item.role}
                  </h3>

                  {/* Concise Description */}
                  {item.description && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '0.75rem' }}>
                      {item.description}
                    </p>
                  )}

                  {/* Key Highlights */}
                  {item.achievements && item.achievements.length > 0 && (
                    <div style={{ marginBottom: '0.8rem', display: 'grid', gap: '0.4rem' }}>
                      {item.achievements.map((ach, aIdx) => (
                        <div key={aIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '0.2rem' }} />
                          <span>{ach}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tool Badges */}
                  {item.tools && item.tools.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {item.tools.map((tool, tIdx) => (
                        <span 
                          key={tIdx} 
                          style={{ 
                            fontSize: '0.75rem', 
                            background: 'rgba(0, 242, 254, 0.06)', 
                            color: 'var(--accent-cyan)', 
                            padding: '0.15rem 0.6rem', 
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(0,242,254,0.2)',
                            fontWeight: '600'
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .experience-sketch-container {
            padding-left: 2.2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
