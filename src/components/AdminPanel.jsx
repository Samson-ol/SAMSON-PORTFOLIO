import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Image, FileText, Save, Download, Sparkles, Check, Database, Code, Upload, Link as LinkIcon, ExternalLink, BarChart3, Table, BookOpen, Lock, ShieldCheck, Key, Eye, EyeOff, LogOut, Loader2, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import { uploadToCloudinary, addProjectToDB, deleteProjectFromDB, saveProfileSettingsToDB, subscribeToMessages, deleteMessageFromDB } from '../services/firebase';

const AVAILABLE_TOOLS = [
  "Excel",
  "Power BI",
  "Python",
  "SQL",
  "Tableau",
  "dbt",
  "R",
  "Snowflake",
  "Google Analytics",
  "Financial Modeling"
];

export default function AdminPanel({ isOpen, onClose, projects, setProjects, heroImage, setHeroImage, resumeUrl, setResumeUrl }) {
  const [activeTab, setActiveTab] = useState('profile'); // profile | projects | messages
  const [tempHeroImage, setTempHeroImage] = useState(heroImage || '');
  const [tempResumeUrl, setTempResumeUrl] = useState(resumeUrl || '');
  const [savedMessage, setSavedMessage] = useState('');
  const [mdFileName, setMdFileName] = useState('');
  const [messages, setMessages] = useState([]);

  // Subscribe to Realtime Client Messages
  useEffect(() => {
    if (isOpen) {
      const unsub = subscribeToMessages((list) => {
        setMessages(list);
      });
      return () => unsub();
    }
  }, [isOpen]);

  // Uploading Loading States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingPbix, setIsUploadingPbix] = useState(false);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('samson_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('samson_admin_password') || 'samson2026';
  });
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // New Project State
  const [newProject, setNewProject] = useState({
    title: '',
    domain: 'SaaS & Subscription',
    shortDesc: '',
    documentation: '', // Detailed analysis walkthrough & summary
    selectedTools: ['Excel', 'Power BI'],
    githubUrl: '',
    demoUrl: '',
    pbixFile: null,
    excelFile: null,
    parsedSheets: null,
    hasSqlQuery: false,
    hasPythonCode: false,
    sqlQuery: '',
    pythonCode: '',
    situation: '',
    task: '',
    action: '',
    result: ''
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passcode === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('samson_admin_auth', 'true');
      setAuthError('');
      setPasscode('');
      confetti({ particleCount: 40, spread: 50 });
    } else {
      setAuthError('Invalid admin passcode. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('samson_admin_auth');
    setPasscode('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPasswordInput.trim().length < 4) {
      setSavedMessage('Passcode must be at least 4 characters.');
      return;
    }
    const updatedPass = newPasswordInput.trim();
    setAdminPassword(updatedPass);
    localStorage.setItem('samson_admin_password', updatedPass);
    await saveProfileSettingsToDB({ adminPassword: updatedPass });
    setSavedMessage('Admin passcode updated & saved to Cloud database!');
    setNewPasswordInput('');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  if (!isOpen) return null;

  const handleMdFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setNewProject(prev => ({
          ...prev,
          documentation: evt.target.result
        }));
        setMdFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        const result = await uploadToCloudinary(file);
        setTempHeroImage(result.url);
        setHeroImage(result.url);
        await saveProfileSettingsToDB({ heroImage: result.url });
        setSavedMessage('Headshot photo uploaded to Cloudinary & saved to Database!');
        confetti({ particleCount: 50, spread: 50 });
      } catch (err) {
        console.error("Headshot upload failed:", err);
        setSavedMessage('Failed to upload image to Cloudinary.');
      } finally {
        setIsUploadingImage(false);
        setTimeout(() => setSavedMessage(''), 4000);
      }
    }
  };

  const handleResumeFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingResume(true);
      try {
        const result = await uploadToCloudinary(file);
        setTempResumeUrl(result.url);
        setResumeUrl(result.url);
        await saveProfileSettingsToDB({ resumeUrl: result.url });
        setSavedMessage('PDF Resume uploaded to Cloudinary & saved to Database!');
        confetti({ particleCount: 50, spread: 50 });
      } catch (err) {
        console.error("Resume upload failed:", err);
        setSavedMessage('Failed to upload resume to Cloudinary.');
      } finally {
        setIsUploadingResume(false);
        setTimeout(() => setSavedMessage(''), 4000);
      }
    }
  };

  const handlePbixFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingPbix(true);
      try {
        const result = await uploadToCloudinary(file);
        setNewProject(prev => ({
          ...prev,
          pbixFile: {
            name: file.name,
            size: result.size,
            data: result.url
          }
        }));
        setSavedMessage(`Power BI file "${file.name}" uploaded to Cloudinary!`);
      } catch (err) {
        console.error("PBIX upload error:", err);
        setSavedMessage('Failed to upload .pbix file.');
      } finally {
        setIsUploadingPbix(false);
        setTimeout(() => setSavedMessage(''), 4000);
      }
    }
  };

  const handleExcelFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingExcel(true);
      try {
        // Parse sheets for Dataset Explorer preview
        const reader = new FileReader();
        reader.onloadend = async (evt) => {
          try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const sheetsData = {};
            workbook.SheetNames.forEach(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              if (json && json.length > 0) {
                const headers = json[0];
                const rows = json.slice(1, 50).map((row, rIdx) => {
                  const rowObj = { id: rIdx + 1 };
                  headers.forEach((h, hIdx) => {
                    rowObj[h || `Col_${hIdx+1}`] = row[hIdx] !== undefined ? row[hIdx] : '';
                  });
                  return rowObj;
                });
                sheetsData[sheetName] = rows;
              }
            });

            // Upload Excel file to Cloudinary
            const result = await uploadToCloudinary(file);
            setNewProject(prev => ({
              ...prev,
              excelFile: {
                name: file.name,
                size: result.size,
                data: result.url
              },
              parsedSheets: sheetsData
            }));
            setSavedMessage(`Excel workbook "${file.name}" uploaded to Cloudinary!`);

          } catch (err) {
            console.error("Excel parse error:", err);
          } finally {
            setIsUploadingExcel(false);
            setTimeout(() => setSavedMessage(''), 4000);
          }
        };
        reader.readAsArrayBuffer(file);

      } catch (err) {
        console.error("Excel upload error:", err);
        setIsUploadingExcel(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setHeroImage(tempHeroImage);
    setResumeUrl(tempResumeUrl);
    try {
      await saveProfileSettingsToDB({
        heroImage: tempHeroImage,
        resumeUrl: tempResumeUrl
      });
      localStorage.setItem('samson_hero_image', tempHeroImage);
      localStorage.setItem('samson_resume_url', tempResumeUrl);
      setSavedMessage('Profile & Resume settings saved to Cloud Database!');
    } catch (err) {
      setSavedMessage('Profile settings updated in state!');
    }
    confetti({ particleCount: 50, spread: 50 });
    setTimeout(() => setSavedMessage(''), 4000);
  };

  const toggleToolSelect = (tool) => {
    if (newProject.selectedTools.includes(tool)) {
      setNewProject({
        ...newProject,
        selectedTools: newProject.selectedTools.filter(t => t !== tool)
      });
    } else {
      setNewProject({
        ...newProject,
        selectedTools: [...newProject.selectedTools, tool]
      });
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setIsSavingProject(true);
    try {
      const createdProject = {
        title: newProject.title,
        domain: newProject.domain,
        shortDesc: newProject.shortDesc,
        documentation: newProject.documentation,
        tools: newProject.selectedTools.length > 0 ? newProject.selectedTools : ['Excel', 'Power BI'],
        githubUrl: newProject.githubUrl,
        demoUrl: newProject.demoUrl,
        pbixFile: newProject.pbixFile,
        excelFile: newProject.excelFile,
        parsedSheets: newProject.parsedSheets,
        featured: false,
        starMethod: {
          situation: newProject.situation || 'Business scenario needing analytics.',
          task: newProject.task || 'Formulated analytics goals & data processing rules.',
          action: newProject.action || `Executed analysis utilizing ${newProject.selectedTools.join(', ')}.`,
          result: newProject.result || 'Achieved measurable business performance lift.'
        },
        sqlQuery: newProject.hasSqlQuery ? newProject.sqlQuery : null,
        pythonCode: newProject.hasPythonCode ? newProject.pythonCode : null,
        sampleData: newProject.parsedSheets && Object.keys(newProject.parsedSheets).length > 0
          ? newProject.parsedSheets[Object.keys(newProject.parsedSheets)[0]]
          : [
              { id: '1', metric: 'Sample Data Row 1', value: 100 },
              { id: '2', metric: 'Sample Data Row 2', value: 200 }
            ]
      };

      // Save to Firebase Firestore Database
      const docId = await addProjectToDB(createdProject);
      
      const updatedProjects = [{ id: docId, ...createdProject }, ...projects];
      setProjects(updatedProjects);
      
      setSavedMessage(`Project "${newProject.title}" saved to Cloud Database!`);
      confetti({ particleCount: 70, spread: 60 });
      
      setNewProject({
        title: '',
        domain: 'SaaS & Subscription',
        shortDesc: '',
        documentation: '',
        selectedTools: ['Excel', 'Power BI'],
        githubUrl: '',
        demoUrl: '',
        pbixFile: null,
        excelFile: null,
        parsedSheets: null,
        hasSqlQuery: false,
        hasPythonCode: false,
        sqlQuery: '',
        pythonCode: '',
        situation: '',
        task: '',
        action: '',
        result: ''
      });
      setMdFileName('');
    } catch (err) {
      console.error("Save project error:", err);
      setSavedMessage("Error saving project to database.");
    } finally {
      setIsSavingProject(false);
      setTimeout(() => setSavedMessage(''), 4000);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await deleteProjectFromDB(id);
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      setSavedMessage("Project deleted from Cloud Database.");
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error("Delete project error:", err);
    }
  };

  const handleExportData = () => {
    const exportObject = { heroImage, resumeUrl, projects };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "samson_portfolio_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {!isAuthenticated ? (
        /* LOGIN VERIFICATION SCREEN */
        <div className="modal-content" style={{ maxWidth: '440px', background: '#0a0e1a', padding: '2.5rem', borderRadius: '20px', border: '1px solid rgba(0,242,254,0.3)', boxShadow: '0 25px 50px rgba(0,0,0,0.7), var(--glow-cyan)' }} onClick={e => e.stopPropagation()}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(139,92,246,0.2) 100%)', border: '1px solid rgba(0,242,254,0.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '1rem', boxShadow: '0 0 20px rgba(0,242,254,0.2)' }}>
              <ShieldCheck size={32} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              Admin Security Portal
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Enter your admin passcode to verify identity and upload projects.
            </p>
          </div>

          {authError && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admin Passcode:
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="Enter passcode..."
                  value={passcode}
                  onChange={(e) => { setPasscode(e.target.value); setAuthError(''); }}
                  style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.75rem 2.5rem 0.75rem 0.85rem', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', justifyContent: 'center', fontSize: '0.95rem', fontWeight: '700' }}>
              <Key size={18} /> Verify Passcode & Unlock
            </button>
          </form>

        </div>
      ) : (
        /* FULL AUTHENTICATED CONTROL CENTER */
        <div className="modal-content" style={{ maxWidth: '950px', background: '#0a0e1a', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Portfolio Control Center
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                Admin Panel & Project Creator
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={handleExportData} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Download size={14} /> Export Backup
              </button>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: '#fca5a5', borderColor: 'rgba(239,68,68,0.4)' }} title="Log out and lock session">
                <LogOut size={14} /> Lock Session
              </button>
              <button className="close-modal-btn" onClick={onClose} style={{ position: 'static' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Saved Alert Banner */}
          {savedMessage && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <Check size={18} /> {savedMessage}
            </div>
          )}

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === 'profile' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'profile' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '0.6rem 0', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <Image size={16} /> Hero Photo & Settings
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === 'projects' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'projects' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '0.6rem 0', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <Plus size={16} /> Add / Manage Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              style={{
                background: 'none', border: 'none',
                borderBottom: activeTab === 'messages' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'messages' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                padding: '0.6rem 0', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <Mail size={16} /> Client Inquiries ({messages.length})
            </button>
          </div>

          {/* TAB 1: PROFILE PHOTO, RESUME & SECURITY */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Image size={18} style={{ color: 'var(--accent-cyan)' }} /> Hero Section Headshot Photo
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#090d16', border: '2px solid var(--accent-cyan)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tempHeroImage ? (
                      <img src={tempHeroImage} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No Photo</span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Upload Image File or Paste Image URL:
                    </label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} style={{ marginBottom: '0.8rem', display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }} />
                    {isUploadingImage && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Loader2 size={14} className="spin-icon" /> Uploading headshot to Cloudinary...
                      </div>
                    )}
                    <input type="text" placeholder="Or paste image URL (e.g. https://...)" value={tempHeroImage} onChange={(e) => setTempHeroImage(e.target.value)} style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff', outline: 'none', fontSize: '0.88rem' }} />
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} style={{ color: 'var(--accent-purple)' }} /> Official PDF Resume Attachment
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Upload PDF Resume File or Link to Google Drive PDF:
                    </label>
                    <input type="file" accept="application/pdf" onChange={handleResumeFileUpload} disabled={isUploadingResume} style={{ marginBottom: '0.8rem', display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem' }} />
                    {isUploadingResume && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', marginBottom: '0.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Loader2 size={14} className="spin-icon" /> Uploading PDF resume to Cloudinary...
                      </div>
                    )}
                    <input type="text" placeholder="Paste Google Drive PDF or cloud link..." value={tempResumeUrl} onChange={(e) => setTempResumeUrl(e.target.value)} style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff', outline: 'none', fontSize: '0.88rem' }} />
                  </div>
                </div>
              </div>

              {/* Security & Change Passcode Section */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lock size={18} style={{ color: 'var(--accent-cyan)' }} /> Security & Admin Passcode
                </h3>

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Change Admin Passcode (Default: <code style={{ color: 'var(--accent-cyan)' }}>samson2026</code>):
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new passcode..."
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.6rem', color: '#fff', outline: 'none', fontSize: '0.88rem' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}>
                    <Key size={15} /> Update Passcode
                  </button>
                </form>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handleSaveProfile} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
                  <Save size={16} /> Save Profile Settings
                </button>
              </div>
            </div>
          )}

        {/* TAB 2: ADD & MANAGE PROJECTS */}
        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            
            <form onSubmit={handleAddProject} className="glass-card" style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} style={{ color: 'var(--accent-cyan)' }} /> Add New Analytics Project
              </h3>

              {/* Title & Domain */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DSN 2026 AI Bootcamp Hackathon Project"
                    value={newProject.title}
                    onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Domain</label>
                  <select
                    value={newProject.domain}
                    onChange={e => setNewProject({ ...newProject, domain: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                  >
                    <option value="SaaS & Subscription">SaaS & Subscription</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="Healthcare & Operations">Healthcare & Operations</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Marketing & Growth">Marketing & Growth</option>
                  </select>
                </div>
              </div>

              {/* Tools Selector Checkboxes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                  Select Tools Used for this Project:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {AVAILABLE_TOOLS.map((tool, idx) => {
                    const isSelected = newProject.selectedTools.includes(tool);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleToolSelect(tool)}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem', borderRadius: 'var(--radius-full)' }}
                      >
                        {isSelected && <Check size={12} />} {tool}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Project Documentation / Analysis Walkthrough */}
              <div style={{ background: 'rgba(139,92,246,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(139,92,246,0.2)', display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={16} /> Project Analysis Walkthrough & Documentation (.md File or Text):
                  </label>
                  
                  <label className="btn btn-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Upload size={14} style={{ color: 'var(--accent-cyan)' }} /> Upload .md File
                    <input type="file" accept=".md,.txt,.markdown" onChange={handleMdFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                {mdFileName && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Check size={14} /> Documentation imported from <strong>{mdFileName}</strong>
                  </div>
                )}

                <textarea
                  rows={6}
                  placeholder="Upload a .md Markdown file above or type formatted Markdown here (# Headings, **bold**, lists, code blocks)..."
                  value={newProject.documentation}
                  onChange={e => setNewProject({ ...newProject, documentation: e.target.value })}
                  style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.75rem', color: '#fff', borderRadius: 'var(--radius-sm)', lineHeight: 1.5, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                />
              </div>

              {/* File Uploads: Power BI (.pbix) & Excel (.xlsx) */}
              <div style={{ background: 'rgba(0,242,254,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,242,254,0.2)', display: 'grid', gap: '1rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <BarChart3 size={16} style={{ color: 'var(--accent-cyan)' }} /> Power BI (.pbix) & Excel (.xlsx) Uploads
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  
                  {/* Upload Power BI .pbix File */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Upload Power BI Report (.pbix):
                    </label>
                    <input 
                      type="file" 
                      accept=".pbix" 
                      onChange={handlePbixFileUpload}
                      style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} 
                    />
                    {newProject.pbixFile && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '0.3rem', fontWeight: '600' }}>
                        ✓ {newProject.pbixFile.name} ({newProject.pbixFile.size}) Attached
                      </div>
                    )}
                  </div>

                  {/* Upload Excel .xlsx File */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Upload Excel Workbook (.xlsx):
                    </label>
                    <input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      onChange={handleExcelFileUpload}
                      style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} 
                    />
                    {newProject.excelFile && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: '0.3rem', fontWeight: '600' }}>
                        ✓ {newProject.excelFile.name} ({newProject.excelFile.size}) Parsed
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* GitHub Link & Power BI Web Link */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>GitHub Repository URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={newProject.githubUrl}
                    onChange={e => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.55rem', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Power BI Embed / Web Report Link</label>
                  <input
                    type="text"
                    placeholder="https://app.powerbi.com/..."
                    value={newProject.demoUrl}
                    onChange={e => setNewProject({ ...newProject, demoUrl: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.55rem', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Short Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of analytical goals..."
                  value={newProject.shortDesc}
                  onChange={e => setNewProject({ ...newProject, shortDesc: e.target.value })}
                  style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              {/* STAR Method Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: '700' }}>S — Situation</label>
                  <input
                    type="text"
                    placeholder="Business context..."
                    value={newProject.situation}
                    onChange={e => setNewProject({ ...newProject, situation: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: '700' }}>T — Task</label>
                  <input
                    type="text"
                    placeholder="Core analytical objective..."
                    value={newProject.task}
                    onChange={e => setNewProject({ ...newProject, task: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>A — Action</label>
                  <input
                    type="text"
                    placeholder="Tools & analysis applied..."
                    value={newProject.action}
                    onChange={e => setNewProject({ ...newProject, action: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>R — Result</label>
                  <input
                    type="text"
                    placeholder="Quantified outcome..."
                    value={newProject.result}
                    onChange={e => setNewProject({ ...newProject, result: e.target.value })}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Conditional Code Toggles */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'grid', gap: '0.8rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                  Code Snippet Configuration:
                </div>
                
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <input 
                      type="checkbox" 
                      checked={newProject.hasSqlQuery} 
                      onChange={e => setNewProject({ ...newProject, hasSqlQuery: e.target.checked })} 
                    /> Include SQL Query
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <input 
                      type="checkbox" 
                      checked={newProject.hasPythonCode} 
                      onChange={e => setNewProject({ ...newProject, hasPythonCode: e.target.checked })} 
                    /> Include Python Code
                  </label>
                </div>

                {newProject.hasSqlQuery && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '0.2rem' }}>Production SQL Query</label>
                    <textarea
                      rows={3}
                      placeholder="SELECT category, SUM(revenue) FROM..."
                      value={newProject.sqlQuery}
                      onChange={e => setNewProject({ ...newProject, sqlQuery: e.target.value })}
                      style={{ width: '100%', background: '#05080f', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#67e8f9', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                    />
                  </div>
                )}

                {newProject.hasPythonCode && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-purple)', marginBottom: '0.2rem' }}>Python Script</label>
                    <textarea
                      rows={3}
                      placeholder="import pandas as pd..."
                      value={newProject.pythonCode}
                      onChange={e => setNewProject({ ...newProject, pythonCode: e.target.value })}
                      style={{ width: '100%', background: '#05080f', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
                  <Plus size={16} /> Add Project to Portfolio
                </button>
              </div>

            </form>

            {/* List of Existing Projects */}
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                Existing Portfolio Projects ({projects.length}):
              </h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1rem', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>{p.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                        <span>{p.domain}</span>
                        <span>•</span>
                        <span>{p.tools ? p.tools.join(', ') : ''}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteProject(p.id)}
                      className="btn"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: CLIENT INQUIRIES & MESSAGES */}
        {activeTab === 'messages' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} style={{ color: 'var(--accent-cyan)' }} /> Recruiter & Client Inquiries ({messages.length})
            </h3>

            {messages.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No client messages yet. When recruiters or clients submit the contact form, their inquiries will appear here in real-time!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(0,242,254,0.2)', display: 'grid', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                          {msg.name} <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '500' }}>({msg.email})</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontWeight: '600', marginTop: '0.15rem' }}>
                          Subject: {msg.subject}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                      </div>
                    </div>

                    <p style={{ background: '#070a10', padding: '0.85rem', borderRadius: 'var(--radius-sm)', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line', border: '1px solid var(--border-color)' }}>
                      {msg.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
                        <Mail size={13} /> Reply via Email
                      </a>
                      <button onClick={() => deleteMessageFromDB(msg.id)} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.35rem 0.8rem', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )}
    </div>
  );
}
