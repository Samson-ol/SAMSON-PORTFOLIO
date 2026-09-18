import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/mockData';
import { ExternalLink, Terminal, Code, BarChart2, Filter, Layers, CheckCircle2, ArrowUpRight, Download } from 'lucide-react';

export default function CaseStudyGallery({ onSelectProject, customProjects }) {
  const [selectedDomain, setSelectedDomain] = useState('All');

  const projectList = customProjects || CASE_STUDIES;

  const domains = ['All', ...new Set(projectList.map(p => p.domain))];

  const filteredProjects = selectedDomain === 'All' 
    ? projectList 
    : projectList.filter(p => p.domain === selectedDomain);

  return (
    <section id="case-studies" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-tag">
            <Layers size={14} /> Structured Analytics Portfolio
          </div>
          <h2 className="section-title">
            Featured <span className="gradient-text">Data Analyst Projects</span>
          </h2>
          <p className="section-subtitle">
            Real-world business analytics projects built with the STAR method (Situation, Task, Action, Result). Includes interactive code explorer, data pipelines, and executive dashboards.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {domains.map((domain, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDomain(domain)}
              className={`btn ${selectedDomain === domain ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', borderRadius: 'var(--radius-full)' }}
            >
              {domain === 'All' && <Filter size={14} />}
              {domain}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="glass-card glass-card-glow"
              style={{ 
                padding: '2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justify: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Dashboard Preview Banner if provided */}
              {project.dashboardImage && (
                <div 
                  style={{ 
                    width: 'calc(100% + 4rem)', 
                    margin: '-2rem -2rem 1.25rem -2rem', 
                    height: '180px', 
                    overflow: 'hidden', 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectProject(project)}
                >
                  <img 
                    src={project.dashboardImage} 
                    alt={project.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      display: 'block' 
                    }} 
                  />
                </div>
              )}

              <div>
                {/* Domain Pill */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: 'var(--accent-cyan)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    background: 'rgba(0, 242, 254, 0.08)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(0, 242, 254, 0.2)'
                  }}>
                    {project.domain}
                  </span>
                </div>


                {/* Title & Short Description */}
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.8rem', lineHeight: 1.3 }}>
                  {project.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {project.shortDesc}
                </p>

                {/* Tech Pills */}

                {project.tools && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {project.tools.map((tool, idx) => (
                      <span key={idx} style={{ 
                        fontSize: '0.78rem', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        color: 'var(--text-muted)', 
                        padding: '0.2rem 0.65rem', 
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontWeight: '500'
                      }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                <button 
                  onClick={() => onSelectProject(project)}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Deep-Dive Case Study <ArrowUpRight size={16} />
                </button>

                {/* External Links if provided */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.35rem' }}>
                      <Code size={13} /> GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.35rem' }}>
                      <ExternalLink size={13} /> Power BI Report
                    </a>
                  )}
                  {project.fileUrl && (
                    <a href={project.fileUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.35rem' }}>
                      <Download size={13} /> Dataset
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
