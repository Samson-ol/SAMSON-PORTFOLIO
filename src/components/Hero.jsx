import React from 'react';
import { ArrowRight, Terminal, FileText, CheckCircle2, User, Sparkles, Settings, BarChart2, ShieldCheck } from 'lucide-react';

import { TECH_STACK } from '../data/mockData';

export default function Hero({ onOpenResume, heroImage, onOpenAdmin }) {
  return (
    <section className="hero-section" style={{ paddingTop: '8rem', paddingBottom: '4.5rem', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        
        {/* Top Announcement Tag */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div className="badge-tag pulse-glow" style={{ maxWidth: '100%', fontSize: '0.8rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }}></span>
            Available for Full-time Roles & High-Impact Analytics Projects
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="hero-grid">
          
          {/* Left Column: Text & Value Proposition */}
          <div className="hero-text-col">
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.1rem, 4.5vw, 4rem)', fontWeight: '800', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Transforming Complex Data into <br className="desktop-only-br" />
              <span className="gradient-text">Measurable Business Growth</span>
            </h1>
            
            <p className="hero-subtitle" style={{ fontSize: '1.12rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Data Analyst specializing in Excel, SQL, Python, and executive BI dashboards. 
              Turning raw datasets into strategic insights that cut costs and optimize revenue.
            </p>

            {/* Primary Action Buttons */}
            <div className="hero-btn-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <a href="#case-studies" className="btn btn-primary hero-btn">
                Explore Projects <ArrowRight size={18} />
              </a>
              <button onClick={onOpenResume} className="btn btn-secondary hero-btn">
                <FileText size={18} /> View Resume
              </button>
            </div>

            {/* Hoverable Tech Stack Badges */}
            <div className="hero-tech-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
              <span className="hero-tech-label" style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginRight: '0.4rem' }}>
                Core Toolbelt:
              </span>
              {TECH_STACK.map((tech, idx) => (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ 
                    padding: '0.35rem 0.85rem', 
                    fontSize: '0.82rem', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem',
                    color: 'var(--text-main)',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <CheckCircle2 size={13} style={{ color: 'var(--accent-cyan)' }} />
                  {tech.name}
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Prominent Executive Headshot Frame */}
          {heroImage && (
            <div className="hero-img-col" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div 
                className="glass-card hero-image-card"
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  aspectRatio: '4 / 5',
                  maxHeight: '440px',
                  borderRadius: '24px',
                  padding: '8px',
                  background: 'linear-gradient(145deg, rgba(0,242,254,0.15) 0%, rgba(139,92,246,0.15) 100%)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), var(--glow-cyan)',
                  position: 'relative',
                  overflow: 'hidden',
                  margin: '0 auto'
                }}
              >
                {/* Raw unedited photo presentation */}
                <img 
                  src={heroImage} 
                  alt="Samson Oloyede" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover', 
                    borderRadius: '16px',
                    display: 'block'
                  }} 
                />
              </div>
            </div>
          )}

        </div>

      </div>

      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: ${heroImage ? '1fr 380px' : '1fr'};
          gap: 3.5rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-text-col {
          text-align: ${heroImage ? 'left' : 'center'};
        }
        .hero-subtitle {
          max-width: ${heroImage ? '680px' : '750px'};
          margin: ${heroImage ? '0 0 2.25rem 0' : '0 auto 2.25rem auto'};
        }
        .hero-btn-group, .hero-tech-group {
          justify-content: ${heroImage ? 'flex-start' : 'center'};
        }
        .hero-btn {
          padding: 0.9rem 1.8rem;
          font-size: 1.02rem;
        }

        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-text-col {
            text-align: center !important;
          }
          .hero-subtitle {
            margin: 0 auto 2.25rem auto !important;
          }
          .hero-btn-group, .hero-tech-group {
            justify-content: center !important;
          }
          .hero-tech-label {
            display: block !important;
            width: 100% !important;
            text-align: center !important;
            margin-right: 0 !important;
            margin-bottom: 0.5rem !important;
          }
        }

        @media (max-width: 640px) {
          .hero-section {
            padding-top: 6rem !important;
            padding-bottom: 3rem !important;
          }
          .hero-title {
            font-size: 2.1rem !important;
          }
          .desktop-only-br {
            display: none;
          }
          .hero-btn-group {
            flex-direction: column;
            width: 100%;
          }
          .hero-btn {
            width: 100%;
            justify-content: center;
          }
          .hero-image-card {
            max-width: 310px !important;
            max-height: 380px !important;
          }
          .hero-tech-group {
            justify-content: center !important;
            gap: 0.5rem !important;
          }
          .hero-tech-label {
            display: block !important;
            width: 100% !important;
            text-align: center !important;
            margin-right: 0 !important;
            margin-bottom: 0.4rem !important;
          }
        }
      `}</style>
    </section>
  );
}
