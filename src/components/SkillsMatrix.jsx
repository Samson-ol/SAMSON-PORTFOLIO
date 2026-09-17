import React from 'react';
import { BarChart3, Database, PieChart, Code2, MessageSquare, Lightbulb, Sparkles } from 'lucide-react';

const COMPETENCIES = [
  {
    title: "Data Analysis",
    icon: BarChart3,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.15)",
    description: "Proficient in using Python and other tools to analyze complex datasets, extract actionable insights, and optimize business performance."
  },
  {
    title: "SQL Database Management",
    icon: Database,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.15)",
    description: "Strong SQL skills for managing and querying databases, ensuring data accuracy, and supporting informed business decisions."
  },
  {
    title: "Data Visualization",
    icon: PieChart,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.15)",
    description: "Expertise in using Excel, Power BI, and Tableau to create interactive dashboards and visual reports that enhance data-driven decision-making."
  },
  {
    title: "Python Data Analytics",
    icon: Code2,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.15)",
    description: "Skilled in Python data libraries (Pandas, NumPy) for automated data extraction, cleaning, exploratory data analysis, and predictive modeling."
  },
  {
    title: "Effective Communication & Presentation",
    icon: MessageSquare,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.15)",
    description: "Skilled in communicating and presenting data insights to both technical and non-technical audiences."
  },
  {
    title: "Problem Solving & Analytical Thinking",
    icon: Lightbulb,
    color: "#a855f7",
    bg: "rgba(168, 85, 247, 0.15)",
    description: "Exceptional problem-solving abilities and analytical thinking, critical for interpreting data trends and offering strategic business solutions."
  }
];

export default function SkillsMatrix() {
  return (
    <section id="skills" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="badge-tag">
            <Sparkles size={14} /> Analytical Toolbelt
          </div>
          <h2 className="section-title">
            Core <span className="gradient-text">Competencies</span>
          </h2>
          <p className="section-subtitle">
            These are the key skills that drive my data analysis work, enabling impactful insights, leadership, and effective communication in data-driven environments.
          </p>
        </div>

        {/* Core Competencies Grid */}
        <div className="competencies-grid">
          {COMPETENCIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  padding: '2rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.25rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(18, 24, 36, 0.75)',
                  transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Top Icon Badge & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: item.bg,
                    border: `1px solid ${item.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    flexShrink: 0
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', lineHeight: 1.35 }}>
                    {item.title}
                  </h3>
                </div>

                {/* Description text */}
                <p style={{ color: '#94a3b8', fontSize: '0.94rem', lineHeight: 1.65, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .competencies-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 992px) {
          .competencies-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .competencies-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
