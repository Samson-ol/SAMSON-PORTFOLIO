import React, { useState, useEffect } from 'react';
import { Terminal, Play, RotateCcw, Database, AlertCircle, CheckCircle2, Table, Code } from 'lucide-react';
import { PRESET_SQL_QUERIES } from '../data/mockData';
import { executeSQLQuery } from '../utils/sqlEngine';

export default function SQLSandbox() {
  const [activeQuery, setActiveQuery] = useState(PRESET_SQL_QUERIES[0].sql);
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    runQuery(PRESET_SQL_QUERIES[0].sql);
  }, []);

  const runQuery = (sqlToRun) => {
    setExecuting(true);
    setTimeout(() => {
      const res = executeSQLQuery(sqlToRun);
      setQueryResult(res);
      setExecuting(false);
    }, 150);
  };

  return (
    <section id="sql-sandbox" className="section-padding" style={{ background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <div className="badge-tag">
            <Terminal size={14} /> In-Browser SQL Engine
          </div>
          <h2 className="section-title">
            Interactive <span className="gradient-text">SQL Query Simulator</span>
          </h2>
          <p className="section-subtitle">
            Recruiters & hiring managers can test custom SQL queries on relational database tables (<code style={{ color: 'var(--accent-cyan)' }}>orders</code> & <code style={{ color: 'var(--accent-cyan)' }}>customers</code>) executed in real time!
          </p>
        </div>

        {/* Sandbox Container */}
        <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
          
          {/* Preset Buttons */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Database size={14} /> Quick Preset Queries:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {PRESET_SQL_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveQuery(preset.sql);
                    runQuery(preset.sql);
                  }}
                  className={`btn ${activeQuery === preset.sql ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* SQL Editor Area */}
          <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16', padding: '0.6rem 1rem', borderTopLeftRadius: 'var(--radius-sm)', borderTopRightRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                SQL Editor (AlaSQL Engine)
              </span>
              <button 
                onClick={() => {
                  setActiveQuery(PRESET_SQL_QUERIES[0].sql);
                  runQuery(PRESET_SQL_QUERIES[0].sql);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
            <textarea
              value={activeQuery}
              onChange={(e) => setActiveQuery(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                background: '#05080f',
                color: '#67e8f9',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderBottomLeftRadius: 'var(--radius-sm)',
                borderBottomRightRadius: 'var(--radius-sm)',
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.5
              }}
            />
          </div>

          {/* Run Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => runQuery(activeQuery)} 
              disabled={executing}
              className="btn btn-primary" 
              style={{ padding: '0.7rem 1.8rem' }}
            >
              <Play size={16} /> {executing ? 'Executing SQL...' : 'Run Query'}
            </button>
          </div>

          {/* Result Status & Table */}
          {queryResult && (
            <div>
              {/* Message Banner */}
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: queryResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: queryResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                color: queryResult.success ? '#34d399' : '#f87171'
              }}>
                {queryResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {queryResult.success ? queryResult.message : queryResult.error}
              </div>

              {/* Data Table Output */}
              {queryResult.success && queryResult.data.length > 0 && (
                <div style={{ overflowX: 'auto', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--accent-cyan)', borderBottom: '1px solid var(--border-color)' }}>
                        {queryResult.columns.map((col, idx) => (
                          <th key={idx} style={{ padding: '0.8rem 1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.data.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          {queryResult.columns.map((col, cIdx) => (
                            <td key={cIdx} style={{ padding: '0.75rem 1rem', color: '#e2e8f0' }}>
                              {typeof row[col] === 'number' && !Number.isInteger(row[col]) ? row[col].toFixed(2) : String(row[col])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
