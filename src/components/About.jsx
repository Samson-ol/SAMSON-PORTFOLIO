import React from 'react';
import { User, Target, BarChart2, Users, Award, CheckCircle2, Sparkles } from 'lucide-react';

export default function About({ aboutBio }) {
  const defaultBio = `I am a detail-oriented Data Analyst passionate about translating complex datasets into actionable business growth strategies. With expertise across Excel, SQL, Python, and Power BI, I specialize in identifying hidden data anomalies, auditing existing reporting models, and crafting intuitive dashboards that give stakeholders full confidence in their numbers.

Whether it's auditing retail transaction performance, building predictive customer churn models, or automating weekly KPI reports, my goal is always the same: turn raw data noise into clear, high-impact business direction.`;

  const displayBio = aboutBio && aboutBio.trim().length > 0 ? aboutBio : defaultBio;

  return (
    <section id="about" className="section-padding" style={{ position: 'relative', background: 'rgba(255,255,255,0.015)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-tag">
            <User size={14} /> About Samson
          </div>
          <h2 className="section-title">
            Passionate About Turning Data into <span className="gradient-text">Strategic Clarity</span>
          </h2>
          {/* <p className="section-subtitle">
            Combining rigorous quantitative analysis with intuitive visual storytelling to empower business leaders.
          </p> */}
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Main Bio Card */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,242,254,0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff' }}>
                  Background & Mission
                </h3>
              </div>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {displayBio}
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                <CheckCircle2 size={16} /> 100% Metric Accuracy Guaranteed
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#10b981', fontWeight: '600' }}>
                <CheckCircle2 size={16} /> Executive-Ready Presentation
              </div>
            </div>
          </div>

          {/* Highlights Grid (Right Side) */}
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            
            {/* Highlight 1 */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(244,63,94,0.12)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.35rem' }}>
                  Business Impact Focus
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Every SQL query, Python script, and Power BI chart is designed around business questions: reducing costs, optimizing conversion, and increasing retention.
                </p>
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0,242,254,0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BarChart2 size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.35rem' }}>
                  Data Auditing & Precision
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Experienced in auditing existing dashboards to uncover metric mismatches, data pipeline errors, and unverified assumptions before decision-making.
                </p>
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139,92,246,0.12)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.35rem' }}>
                  Cross-Functional Storytelling
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Bridging the gap between technical data engineering and business strategy with clear, non-jargon explanations and executive summaries.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
