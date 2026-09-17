import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Upload, ExternalLink, FileCheck, Phone, Mail, MapPin, Calendar, Globe } from 'lucide-react';

export default function ResumeModal({ isOpen, onClose, resumeUrl, onUploadResume }) {
  const [blobUrl, setBlobUrl] = useState('');

  useEffect(() => {
    if (resumeUrl && resumeUrl.startsWith('data:application/pdf')) {
      try {
        const base64Data = resumeUrl.split(',')[1];
        const binaryStr = atob(base64Data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);

        return () => {
          URL.revokeObjectURL(createdUrl);
        };
      } catch (e) {
        console.error("Error creating blob URL:", e);
      }
    } else if (resumeUrl) {
      setBlobUrl(resumeUrl);
    }
  }, [resumeUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUploadResume) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploadResume(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const activePdfUrl = blobUrl || resumeUrl;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1050px', 
          width: '95%',
          background: '#090d16', 
          height: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '1.75rem' 
        }} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Top Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '1.2rem' }}>
              <FileText size={22} /> SAMSON OLOYEDE — Official Resume
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Data Analyst • +2348104054759 • oloyedes212@gmail.com • Lagos State
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {activePdfUrl && (
              <>
                <a 
                  href={activePdfUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-outline" 
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>
                <a 
                  href={activePdfUrl} 
                  download="SAMSON_OLOYEDE_RESUME.pdf" 
                  className="btn btn-primary" 
                  style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  <Download size={15} /> Download PDF
                </a>
              </>
            )}
            <button className="close-modal-btn" onClick={onClose} style={{ position: 'static' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {activePdfUrl ? (
            <div style={{ flex: 1, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#fff' }}>
              <object
                data={activePdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ width: '100%', height: '100%', display: 'block', minHeight: '600px' }}
              >
                <embed 
                  src={activePdfUrl} 
                  type="application/pdf" 
                  width="100%" 
                  height="100%" 
                />
                <div style={{ padding: '2rem', textAlign: 'center', background: '#0a0e1a', color: '#fff' }}>
                  <FileCheck size={48} style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }} />
                  <h3>Official PDF Resume Attached</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Click below to view your full PDF document in native viewer:</p>
                  <a href={activePdfUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <ExternalLink size={16} /> Open Full PDF Resume
                  </a>
                </div>
              </object>
            </div>
          ) : (
            /* Upload Dropzone if no resume uploaded yet */
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-accent)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,242,254,0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Upload size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>
                Upload Samson's Official PDF Resume
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.6 }}>
                Select your official resume PDF file from your computer. Once uploaded, recruiters will see and download your exact resume.
              </p>

              <label className="btn btn-primary" style={{ cursor: 'pointer', padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
                <FileText size={18} /> Select PDF Resume File
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
