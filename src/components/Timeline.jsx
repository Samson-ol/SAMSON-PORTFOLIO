import React from 'react';
import { CAREER_TIMELINE } from '../data/mockData';
import { Briefcase, Calendar, Building2, CheckCircle2 } from 'lucide-react';

export default function Timeline() {
  return (
    <section className="section-padding" style={{ background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div className="section-header">
          <div className="badge-tag">
            <Briefcase size={14} /> Career Journey
          </div>
          <h2 className="section-title">
            Professional <span className="gradient-text">Experience & Timeline</span>
          </h2>
          <p className="section-subtitle">
            Track record of driving analytical transformation and business value across high-growth organizations.
          </p>
        </div>

        {/* Timeline Items */}
        <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid rgba(0, 242, 254, 0.2)' }}>
          {CAREER_TIMELINE.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '2.5rem', position: 'relative' }}>
              
              {/* Bullet Node */}
              <div style={{
                position: 'absolute',
                left: '-2.55rem',
                top: '0.2rem',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#0a0d14',
                border: '3px solid var(--accent-cyan)',
                boxShadow: '0 0 10px rgba(0, 242, 254, 0.5)'
              }} />

              {/* Content Card */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', background: 'rgba(0,242,254,0.08)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                    {item.period}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Building2 size={14} /> {item.company}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                  {item.role}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
