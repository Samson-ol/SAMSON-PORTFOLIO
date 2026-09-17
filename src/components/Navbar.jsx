import React, { useState, useEffect } from 'react';
import { BarChart2, FileText, Mail, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenResume }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#case-studies' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 900,
      padding: '1rem 0',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10, 13, 20, 0.92)' : 'rgba(10, 13, 20, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: '#fff' }}>
          {/* <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0a0d14',
            fontWeight: 'bold',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)'
          }}>
            <BarChart2 size={22} />
          </div> */}
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
              SAMSON <span style={{ color: 'var(--accent-cyan)' }}>OLOYEDE</span>
            </div>
            {/* <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
              Data Analyst
            </div> */}
          </div>
        </a>

        {/* Desktop Nav Links & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-menu">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                color: 'var(--text-main)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'color 0.2s ease',
              }}
              className="nav-link-item"
            >
              {link.name}
            </a>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
            <button 
              onClick={onOpenResume} 
              className="btn btn-outline" 
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FileText size={15} /> Resume
            </button>
            
            <a 
              href="#contact" 
              className="btn btn-primary" 
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Mail size={15} /> Get In Touch
            </a>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'none', padding: '0.4rem' }}
          className="mobile-toggle"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(10, 13, 20, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginTop: '0.8rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: 'var(--text-main)',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {link.name}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenResume(); }} 
              className="btn btn-outline" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
            >
              <FileText size={17} /> Resume
            </button>
            
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
            >
              <Mail size={17} /> Get In Touch
            </a>
          </div>
        </div>
      )}

      <style>{`
        .nav-link-item:hover {
          color: var(--accent-cyan) !important;
        }
        @media (max-width: 900px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

