import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Image, FileText, Save, Download, Sparkles, Check, Database, Code, Upload, Link as LinkIcon, ExternalLink, BarChart3, Table, BookOpen, Lock, ShieldCheck, Key, Eye, EyeOff, LogOut, Loader2, Mail, Briefcase, User, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import { uploadToCloudinary, addProjectToDB, updateProjectInDB, deleteProjectFromDB, saveProfileSettingsToDB, subscribeToMessages, deleteMessageFromDB, addExperienceToDB, updateExperienceInDB, deleteExperienceFromDB } from '../services/firebase';

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

function formatMonthYear(ymString) {
  if (!ymString) return '';
  const parts = ymString.split('-');
  if (parts.length < 2) return ymString;
  const [year, month] = parts;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mIndex = parseInt(month, 10) - 1;
  return `${monthNames[mIndex] || month} ${year}`;
}

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  projects, 
  setProjects, 
  heroImage, 
  setHeroImage, 
  resumeUrl, 
  setResumeUrl,
  aboutBio,
  setAboutBio,
  experiences,
  setExperiences
}) {
  const [activeTab, setActiveTab] = useState('profile'); // profile | projects | experience | messages
  const [tempHeroImage, setTempHeroImage] = useState(heroImage || '');
  const [tempResumeUrl, setTempResumeUrl] = useState(resumeUrl || '');
  const [tempAboutBio, setTempAboutBio] = useState(aboutBio || '');
  const [savedMessage, setSavedMessage] = useState('');
  const [mdFileName, setMdFileName] = useState('');
  const [messages, setMessages] = useState([]);

  // Editing Project State
  const [editingProjectId, setEditingProjectId] = useState(null);

  // Editing Experience State
  const [editingExpId, setEditingExpId] = useState(null);

  const [newExperience, setNewExperience] = useState({
    role: '',
    company: '',
    location: 'Lagos State, Nigeria',
    startDate: '',
    endDate: '',
    isCurrent: true,
    period: '',
    description: '',
    achievementsText: '',
    toolsText: 'Power BI, SQL, Excel, Python'
  });

  // Keep temp states in sync with props
  useEffect(() => {
    setTempHeroImage(heroImage || '');
    setTempResumeUrl(resumeUrl || '');
    setTempAboutBio(aboutBio || '');
  }, [heroImage, resumeUrl, aboutBio]);

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
  const [isUploadingDashboardImage, setIsUploadingDashboardImage] = useState(false);
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

  // Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    domain: 'SaaS & Subscription',
    shortDesc: '',
    documentation: '',
    dashboardImage: '',
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

  const handleDashboardImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingDashboardImage(true);
      try {
        const result = await uploadToCloudinary(file);
        setNewProject(prev => ({
          ...prev,
          dashboardImage: result.url
        }));
        setSavedMessage(`Dashboard preview screenshot uploaded to Cloudinary!`);
      } catch (err) {
        console.error("Dashboard image upload error:", err);
        setSavedMessage('Failed to upload dashboard screenshot.');
      } finally {
        setIsUploadingDashboardImage(false);
        setTimeout(() => setSavedMessage(''), 4000);
      }
    }
  };

  const handleExcelFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingExcel(true);
      try {
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
    if (setAboutBio) setAboutBio(tempAboutBio);
    try {
      await saveProfileSettingsToDB({
        heroImage: tempHeroImage,
        resumeUrl: tempResumeUrl,
        aboutBio: tempAboutBio
      });
      localStorage.setItem('samson_hero_image', tempHeroImage);
      localStorage.setItem('samson_resume_url', tempResumeUrl);
      localStorage.setItem('samson_about_bio', tempAboutBio);
      setSavedMessage('Profile, Resume & Bio settings saved to Cloud Database!');
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

  // Populate form for Editing a Project
  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setNewProject({
      title: project.title || '',
      domain: project.domain || 'SaaS & Subscription',
      shortDesc: project.shortDesc || '',
      documentation: project.documentation || '',
      dashboardImage: project.dashboardImage || '',
      selectedTools: project.tools || ['Excel', 'Power BI'],
      githubUrl: project.githubUrl || '',
      demoUrl: project.demoUrl || '',
      pbixFile: project.pbixFile || null,
      excelFile: project.excelFile || null,
      parsedSheets: project.parsedSheets || null,
      hasSqlQuery: Boolean(project.sqlQuery),
      hasPythonCode: Boolean(project.pythonCode),
      sqlQuery: project.sqlQuery || '',
      pythonCode: project.pythonCode || '',
      situation: project.starMethod?.situation || '',
      task: project.starMethod?.task || '',
      action: project.starMethod?.action || '',
      result: project.starMethod?.result || ''
    });
    setActiveTab('projects');
    const formEl = document.getElementById('admin-project-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEditProject = () => {
    setEditingProjectId(null);
    setNewProject({
      title: '',
      domain: 'SaaS & Subscription',
      shortDesc: '',
      documentation: '',
      dashboardImage: '',
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
  };

  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();
    setIsSavingProject(true);
    try {
      const createdProject = {
        title: newProject.title,
        domain: newProject.domain,
        shortDesc: newProject.shortDesc,
        documentation: newProject.documentation,
        dashboardImage: newProject.dashboardImage || null,
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

      if (editingProjectId) {
        // Update Existing Project
        await updateProjectInDB(editingProjectId, createdProject);
        const updatedList = projects.map(p => p.id === editingProjectId ? { id: editingProjectId, ...createdProject } : p);
        setProjects(updatedList);
        setSavedMessage(`Project "${newProject.title}" updated successfully!`);
        setEditingProjectId(null);
      } else {
        // Add New Project
        const docId = await addProjectToDB(createdProject);
        const updatedProjects = [{ id: docId, ...createdProject }, ...projects];
        setProjects(updatedProjects);
        setSavedMessage(`Project "${newProject.title}" saved to Cloud Database!`);
      }

      confetti({ particleCount: 70, spread: 60 });
      handleCancelEditProject();
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

  const handleDeleteMessage = async (id) => {
    try {
      await deleteMessageFromDB(id);
      setSavedMessage("Message deleted.");
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  // Structured Date Handler for Experience
  const handleExpDateChange = (start, end, current) => {
    const formattedStart = formatMonthYear(start);
    let periodStr = '';
    if (current) {
      periodStr = formattedStart ? `${formattedStart} — Present` : 'Present';
    } else {
      const formattedEnd = formatMonthYear(end);
      if (formattedStart && formattedEnd) {
        periodStr = `${formattedStart} — ${formattedEnd}`;
      } else if (formattedStart) {
        periodStr = formattedStart;
      } else if (formattedEnd) {
        periodStr = `Until ${formattedEnd}`;
      }
    }
    setNewExperience(prev => ({
      ...prev,
      startDate: start,
      endDate: end,
      isCurrent: current,
      period: periodStr || prev.period
    }));
  };

  // Work Experience Handlers
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    const achievements = newExperience.achievementsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    
    const tools = newExperience.toolsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const expData = {
      role: newExperience.role,
      company: newExperience.company,
      location: newExperience.location,
      startDate: newExperience.startDate,
      endDate: newExperience.endDate,
      isCurrent: newExperience.isCurrent,
      period: newExperience.period || (newExperience.isCurrent ? 'Present' : 'Past'),
      description: newExperience.description,
      achievements,
      tools
    };

    try {
      if (editingExpId) {
        await updateExperienceInDB(editingExpId, expData);
        setSavedMessage(`Work Experience updated successfully!`);
        setEditingExpId(null);
      } else {
        await addExperienceToDB(expData);
        setSavedMessage(`New Work Experience added!`);
      }
      confetti({ particleCount: 50, spread: 50 });
      setNewExperience({
        role: '',
        company: '',
        location: 'Lagos State, Nigeria',
        startDate: '',
        endDate: '',
        isCurrent: true,
        period: '',
        description: '',
        achievementsText: '',
        toolsText: 'Power BI, SQL, Excel, Python'
      });
    } catch (err) {
      console.error("Save experience error:", err);
      setSavedMessage("Failed to save experience.");
    } finally {
      setTimeout(() => setSavedMessage(''), 4000);
    }
  };

  const handleEditExperience = (exp) => {
    setEditingExpId(exp.id);
    setNewExperience({
      role: exp.role || '',
      company: exp.company || '',
      location: exp.location || 'Lagos State, Nigeria',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent !== undefined ? exp.isCurrent : true,
      period: exp.period || '',
      description: exp.description || '',
      achievementsText: exp.achievements ? exp.achievements.join('\n') : '',
      toolsText: exp.tools ? exp.tools.join(', ') : 'Power BI, SQL, Excel, Python'
    });
  };

  const handleDeleteExperience = async (expId) => {
    try {
      await deleteExperienceFromDB(expId);
      setSavedMessage("Experience entry deleted.");
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error("Delete experience error:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1050px', 
          width: '95%', 
          background: '#090d16', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          padding: '2rem' 
        }} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '1.3rem' }}>
              <ShieldCheck size={24} /> SAMSON OLOYEDE — Admin Portal
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Manage website content, update projects, experience lane & client inquiries.
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isAuthenticated && (
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }}>
                <LogOut size={14} /> Lock Session
              </button>
            )}
            <button className="close-modal-btn" onClick={onClose} style={{ position: 'static' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Status Alert Banner */}
        {savedMessage && (
          <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={18} /> {savedMessage}
          </div>
        )}

        {/* AUTH LOCK SCREEN */}
        {!isAuthenticated ? (
          <div className="glass-card" style={{ padding: '3rem 2rem', maxWidth: '460px', margin: '2rem auto', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,242,254,0.12)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
              <Lock size={28} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '0.4rem' }}>
              Admin Security Verification
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Enter your passcode to manage projects, edit profile, and read client messages.
            </p>

            <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Enter admin passcode"
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 2.5rem 0.75rem 1rem', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {authError && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem', textAlign: 'left', fontWeight: '600' }}>
                  ⚠️ {authError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', justifyContent: 'center', fontSize: '0.95rem' }}>
                <ShieldCheck size={16} /> Unlock Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD CONTENT */
          <div>
            
            {/* Top Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: activeTab === 'profile' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: activeTab === 'profile' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  padding: '0.6rem 0', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <Image size={16} /> Profile & Settings
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
                <Plus size={16} /> Add / Edit Projects ({projects.length})
              </button>

              <button
                onClick={() => setActiveTab('experience')}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: activeTab === 'experience' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: activeTab === 'experience' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  padding: '0.6rem 0', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <Briefcase size={16} /> Experience Lane ({experiences ? experiences.length : 0})
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

            {/* TAB 1: PROFILE PHOTO, RESUME, ABOUT BIO & SECURITY */}
            {activeTab === 'profile' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                
                {/* About Me Bio Editor */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={18} style={{ color: 'var(--accent-cyan)' }} /> About Me Biography
                  </h3>
                  <textarea 
                    rows={4}
                    placeholder="Write a brief overview about your data analytics journey..."
                    value={tempAboutBio}
                    onChange={e => setTempAboutBio(e.target.value)}
                    style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: '#fff', outline: 'none', fontSize: '0.9rem', lineHeight: 1.6 }}
                  />
                </div>

                {/* Hero Headshot Photo Upload */}
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

                {/* PDF Resume Upload */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={18} style={{ color: 'var(--accent-purple)' }} /> Official PDF Resume Attachment
                  </h3>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                        Upload Official Resume PDF File:
                      </label>
                      <input type="file" accept="application/pdf" onChange={handleResumeFileUpload} disabled={isUploadingResume} style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }} />
                      {isUploadingResume && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '0.4rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Loader2 size={14} className="spin-icon" /> Uploading PDF resume to Cloudinary...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Profile Button */}
                <div>
                  <button onClick={handleSaveProfile} className="btn btn-primary" style={{ padding: '0.75rem 1.8rem' }}>
                    <Save size={16} /> Save Profile & Resume Settings
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CREATE / EDIT PORTFOLIO PROJECTS */}
            {activeTab === 'projects' && (
              <div style={{ display: 'grid', gap: '2rem' }}>
                
                {/* Editing Indicator Banner */}
                {editingProjectId && (
                  <div style={{ background: 'rgba(0,242,254,0.1)', border: '1px solid var(--accent-cyan)', padding: '0.8rem 1.25rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Edit2 size={18} /> Editing Project: "{newProject.title}"
                    </div>
                    <button type="button" onClick={handleCancelEditProject} className="btn btn-secondary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
                      Cancel Editing
                    </button>
                  </div>
                )}

                {/* Project Form */}
                <form id="admin-project-form" onSubmit={handleAddOrUpdateProject} className="glass-card" style={{ padding: '1.5rem', display: 'grid', gap: '1.2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} /> {editingProjectId ? 'Update Project Details' : 'Add New Analytics Case Study'}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Project Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. E-Commerce Sales Performance Dashboard"
                        value={newProject.title}
                        onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                        style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Domain / Industry</label>
                      <select
                        value={newProject.domain}
                        onChange={e => setNewProject({ ...newProject, domain: e.target.value })}
                        style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                      >
                        <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                        <option value="SaaS & Subscription">SaaS & Subscription</option>
                        <option value="Financial & ROI Analytics">Financial & ROI Analytics</option>
                        <option value="Healthcare Analytics">Healthcare Analytics</option>
                        <option value="Marketing & Acquisition">Marketing & Acquisition</option>
                      </select>
                    </div>
                  </div>

                  {/* Tools Checkboxes */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Tools Applied:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {AVAILABLE_TOOLS.map(tool => (
                        <button
                          type="button"
                          key={tool}
                          onClick={() => toggleToolSelect(tool)}
                          className={`btn ${newProject.selectedTools.includes(tool) ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Markdown File Upload & Documentation */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <BookOpen size={15} /> Project Documentation (Markdown / STAR Walkthrough)
                      </label>
                      
                      <label className="btn btn-outline" style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                        <Upload size={12} /> Upload .md File
                        <input type="file" accept=".md, .txt" onChange={handleMdFileUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                    
                    {mdFileName && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginBottom: '0.5rem', fontWeight: '600' }}>
                        ✓ Imported content from {mdFileName}
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

                  {/* File Uploads: Power BI (.pbix), Excel (.xlsx), Dashboard Screenshot */}
                  <div style={{ background: 'rgba(0,242,254,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,242,254,0.2)', display: 'grid', gap: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BarChart3 size={16} style={{ color: 'var(--accent-cyan)' }} /> Power BI (.pbix), Excel (.xlsx) & Screenshot Uploads
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

                      {/* Upload Dashboard Screenshot / Preview Image */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                          Dashboard Screenshot / Preview Image:
                        </label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleDashboardImageUpload}
                          style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} 
                        />
                        {isUploadingDashboardImage && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Loader2 size={12} className="spin-icon" /> Uploading image to Cloudinary...
                          </div>
                        )}
                        {newProject.dashboardImage && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <img src={newProject.dashboardImage} alt="Dashboard preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                            <button 
                              type="button" 
                              onClick={() => setNewProject({ ...newProject, dashboardImage: '' })}
                              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Remove Image
                            </button>
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

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    {editingProjectId && (
                      <button type="button" onClick={handleCancelEditProject} className="btn btn-secondary">
                        Cancel Editing
                      </button>
                    )}
                    <button type="submit" disabled={isSavingProject} className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>
                      {editingProjectId ? <Save size={16} /> : <Plus size={16} />}
                      {editingProjectId ? 'Update Project' : 'Add Project to Portfolio'}
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

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleEditProject(p)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(p.id)}
                            className="btn"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)' }}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: WORK EXPERIENCE LANE */}
            {activeTab === 'experience' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Briefcase size={18} style={{ color: 'var(--accent-cyan)' }} /> Work Experience & Career Journey
                </h3>

                {/* Experience Add/Edit Form */}
                <form onSubmit={handleSaveExperience} className="glass-card" style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    {editingExpId ? 'Edit Experience Entry' : 'Add New Work Experience'}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Job Role / Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead Data Analyst"
                        value={newExperience.role}
                        onChange={e => setNewExperience({ ...newExperience, role: e.target.value })}
                        style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Company / Organization</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Data Science Nigeria"
                        value={newExperience.company}
                        onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
                        style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos State, Nigeria"
                        value={newExperience.location}
                        onChange={e => setNewExperience({ ...newExperience, location: e.target.value })}
                        style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                      />
                    </div>
                  </div>

                  {/* Structured Date Selector */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'grid', gap: '0.8rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={15} /> Select Work Dates (Auto-Sorts Most Recent First)
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'center' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Start Date (Month & Year)</label>
                        <input
                          type="month"
                          value={newExperience.startDate}
                          onChange={e => handleExpDateChange(e.target.value, newExperience.endDate, newExperience.isCurrent)}
                          style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.5rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>End Date (Month & Year)</label>
                        <input
                          type="month"
                          disabled={newExperience.isCurrent}
                          value={newExperience.endDate}
                          onChange={e => handleExpDateChange(newExperience.startDate, e.target.value, newExperience.isCurrent)}
                          style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.5rem', color: newExperience.isCurrent ? 'var(--text-subtle)' : '#fff', borderRadius: 'var(--radius-sm)', opacity: newExperience.isCurrent ? 0.5 : 1 }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1rem' }}>
                        <input
                          type="checkbox"
                          id="isCurrentRole"
                          checked={newExperience.isCurrent}
                          onChange={e => handleExpDateChange(newExperience.startDate, newExperience.endDate, e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
                        />
                        <label htmlFor="isCurrentRole" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '600', cursor: 'pointer' }}>
                          I currently work here
                        </label>
                      </div>
                    </div>

                    {newExperience.period && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                        ✓ Formatted Period: "{newExperience.period}"
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Role Summary & Description</label>
                    <textarea
                      rows={2}
                      placeholder="Overview of core responsibilities and team impact..."
                      value={newExperience.description}
                      onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
                      style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Key Accomplishments (One bullet per line)</label>
                    <textarea
                      rows={3}
                      placeholder="Audited retail dashboard and restored 100% metric precision&#10;Built Power BI DAX model automating weekly executive reporting..."
                      value={newExperience.achievementsText}
                      onChange={e => setNewExperience({ ...newExperience, achievementsText: e.target.value })}
                      style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Tools Applied (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="Power BI, SQL, Excel, Python"
                      value={newExperience.toolsText}
                      onChange={e => setNewExperience({ ...newExperience, toolsText: e.target.value })}
                      style={{ width: '100%', background: '#070a10', border: '1px solid var(--border-color)', padding: '0.6rem', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    {editingExpId && (
                      <button type="button" onClick={() => { setEditingExpId(null); setNewExperience({ role: '', company: '', location: 'Lagos State, Nigeria', startDate: '', endDate: '', isCurrent: true, period: '', description: '', achievementsText: '', toolsText: 'Power BI, SQL, Excel, Python' }); }} className="btn btn-secondary">
                        Cancel
                      </button>
                    )}
                    <button type="submit" className="btn btn-primary">
                      <Save size={16} /> {editingExpId ? 'Update Experience Entry' : 'Add Experience Entry'}
                    </button>
                  </div>
                </form>

                {/* List of Existing Experiences */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                    Work Experience Entries ({experiences ? experiences.length : 0}):
                  </h4>

                  {experiences && experiences.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {experiences.map(exp => (
                        <div key={exp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem', background: '#070a10', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                          <div>
                            <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.98rem' }}>{exp.role} — <span style={{ color: 'var(--accent-cyan)' }}>{exp.company}</span></div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{exp.period} • {exp.location}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEditExperience(exp)} className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
                              <Edit2 size={14} /> Edit
                            </button>
                            <button onClick={() => handleDeleteExperience(exp.id)} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No experience entries in cloud database yet. Add your first experience entry above!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CLIENT INQUIRIES & MESSAGES */}
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
                      <div key={msg.id} className="glass-card" style={{ padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                          <div>
                            <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{msg.name}</div>
                            <a href={`mailto:${msg.email}`} style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', textDecoration: 'none' }}>
                              {msg.email}
                            </a>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                            </span>
                            <button 
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="btn"
                              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid rgba(239,68,68,0.3)' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>
                          Subject: {msg.subject}
                        </div>

                        <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.5, background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
