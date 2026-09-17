import React, { useState } from 'react';
import { X, CheckCircle2, Code2, Terminal, Table, Copy, Check, FileText, Lightbulb, ExternalLink, Code, Download, FileSpreadsheet, Layers, BookOpen } from 'lucide-react';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({ gfm: true, breaks: true });

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  // Code Tabs Logic
  const hasSql = project.sqlQuery && project.sqlQuery.trim().length > 0;
  const hasPython = project.pythonCode && project.pythonCode.trim().length > 0;
  const hasCodeSection = hasSql || hasPython;

  // Sheet Tabs Logic for Excel
  const parsedSheetNames = project.parsedSheets ? Object.keys(project.parsedSheets) : [];
  const [activeSheet, setActiveSheet] = useState(parsedSheetNames[0] || null);

  const [activeTab, setActiveTab] = useState('star'); // star | code | dataset
  const [codeTab, setCodeTab] = useState(hasSql ? 'sql' : 'python'); // sql | python
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine rows to display in Dataset Explorer
  const currentSheetRows = activeSheet && project.parsedSheets 
    ? project.parsedSheets[activeSheet] 
    : project.sampleData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '1000px', background: '#0a0e1a', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="close-modal-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', background: 'rgba(0,242,254,0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              {project.domain}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-purple)', background: 'rgba(139,92,246,0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              {project.tools ? project.tools.join(' • ') : 'Analytics Case Study'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', lineHeight: 1.3, marginBottom: '0.8rem' }}>
            {project.title}
          </h2>

          {/* Action Buttons (GitHub, Power BI, Excel Download) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                <Code size={14} /> View on GitHub
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                <ExternalLink size={14} /> Open Live Power BI Report
              </a>
            )}
            {project.pbixFile && (
              <a href={project.pbixFile.data} download={project.pbixFile.name} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                <Download size={14} /> Download {project.pbixFile.name} ({project.pbixFile.size})
              </a>
            )}
            {project.excelFile && (
              <a href={project.excelFile.data} download={project.excelFile.name} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                <FileSpreadsheet size={14} /> Download Excel Workbook (.xlsx)
              </a>
            )}
          </div>
        </div>

        {/* Clean Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', gap: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('star')}
            style={{
              background: 'none', border: 'none',
              borderBottom: activeTab === 'star' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'star' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '0.8rem 0', fontWeight: '600', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
            }}
          >
            <Lightbulb size={16} /> STAR Methodology & Summary
          </button>

          {/* Conditional Code Tab */}
          {hasCodeSection && (
            <button
              onClick={() => setActiveTab('code')}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === 'code' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'code' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '0.8rem 0', fontWeight: '600', fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
              }}
            >
              <Terminal size={16} /> Code Explorer
            </button>
          )}

          <button
            onClick={() => setActiveTab('dataset')}
            style={{
              background: 'none', border: 'none',
              borderBottom: activeTab === 'dataset' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              color: activeTab === 'dataset' ? 'var(--accent-cyan)' : 'var(--text-muted)',
              padding: '0.8rem 0', fontWeight: '600', fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
            }}
          >
            <Table size={16} /> Dataset Explorer
          </button>
        </div>

        {/* TAB 1: STAR METHODOLOGY & PROJECT DOCUMENTATION */}
        {activeTab === 'star' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Custom Documentation / Analysis Summary if provided */}
            {project.documentation && project.documentation.trim().length > 0 && (
              <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0,242,254,0.06) 0%, rgba(139,92,246,0.06) 100%)', border: '1px solid rgba(0,242,254,0.25)' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BookOpen size={18} /> Project Analysis Walkthrough & Documentation
                </div>
                <div 
                  className="markdown-body" 
                  dangerouslySetInnerHTML={{ __html: marked.parse(project.documentation) }} 
                />
              </div>
            )}

            {/* STAR Methodology Grid */}
            <div style={{ display: 'grid', gap: '1.2rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-rose)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  S — Situation & Business Challenge
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>{project.starMethod.situation}</p>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  T — Analytical Task & Core Goals
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>{project.starMethod.task}</p>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  A — Actions Taken & Tools Applied ({project.tools ? project.tools.join(', ') : ''})
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>{project.starMethod.action}</p>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                  R — Quantified Business Results & Impact
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: '500' }}>{project.starMethod.result}</p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: CODE & QUERY EXPLORER */}
        {activeTab === 'code' && hasCodeSection && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {hasSql && (
                  <button onClick={() => setCodeTab('sql')} className={`btn ${codeTab === 'sql' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    <Terminal size={14} /> Production SQL Query
                  </button>
                )}
                {hasPython && (
                  <button onClick={() => setCodeTab('python')} className={`btn ${codeTab === 'python' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    <Code2 size={14} /> Python Pipeline
                  </button>
                )}
              </div>

              <button onClick={() => handleCopyCode(codeTab === 'sql' ? project.sqlQuery : project.pythonCode)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            <div className="code-wrapper" style={{ maxHeight: '380px' }}>
              <pre><code>{codeTab === 'sql' ? project.sqlQuery : project.pythonCode}</code></pre>
            </div>
          </div>
        )}

        {/* TAB 3: DATASET EXPLORER */}
        {activeTab === 'dataset' && (
          <div>
            {/* Sheet Tabs if parsed Excel workbook */}
            {parsedSheetNames.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {parsedSheetNames.map((sheet, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSheet(sheet)}
                    className={`btn ${activeSheet === sheet ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
                  >
                    <Layers size={12} /> Sheet: {sheet}
                  </button>
                ))}
              </div>
            )}

            {/* Data Table */}
            {currentSheetRows && currentSheetRows.length > 0 ? (
              <div style={{ overflowX: 'auto', background: '#090d16', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', maxHeight: '420px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--border-color)' }}>
                      {Object.keys(currentSheetRows[0]).map((key, i) => (
                        <th key={i} style={{ padding: '0.8rem 1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSheetRows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        {Object.values(row).map((val, i) => (
                          <td key={i} style={{ padding: '0.8rem 1rem', color: 'var(--text-main)' }}>{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No dataset rows available.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
