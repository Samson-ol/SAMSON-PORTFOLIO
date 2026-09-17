import React from 'react';
import { BarChart2, Globe, Mail, ArrowUp, Code, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#05070c', borderTop: '1px solid var(--border-color)', padding: '3rem 0 2rem 0', color: 'var(--text-muted)' }}>
      <div className="container">
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Logo & Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0d14',
              fontWeight: 'bold'
            }}>
              <BarChart2 size={18} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: '#fff', fontSize: '1rem' }}>
              SAMSON OLOYEDE <span style={{ color: 'var(--accent-cyan)' }}>• PORTFOLIO</span>
            </span>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://github.com/Samson-ol" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <Code size={14} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/samson-oloyede-64037228b/" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <Globe size={14} /> LinkedIn
            </a>
            <button onClick={scrollToTop} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              <ArrowUp size={14} /> Back to Top
            </button>
          </div>


        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-subtle)', gap: '1rem' }}>
          <div>
            © {new Date().getFullYear()} Samson Oloyede. All rights reserved.
          </div>
          {/* <a 
            href="#admin" 
            style={{ color: 'var(--text-subtle)', textDecoration: 'none', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.6 }}
            title="Private Admin Control Center (or press Ctrl + Shift + A)"
          >
            🔒 Admin Portal
          </a> */}
        </div>

      </div>
    </footer>
  );
}
