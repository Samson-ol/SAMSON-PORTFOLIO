import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CaseStudyGallery from './components/CaseStudyGallery';
import ProjectModal from './components/ProjectModal';
import SkillsMatrix from './components/SkillsMatrix';
import ResumeModal from './components/ResumeModal';
import AdminPanel from './components/AdminPanel';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CASE_STUDIES } from './data/mockData';
import { subscribeToProjects, subscribeToProfileSettings, saveProfileSettingsToDB } from './services/firebase';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  
  // Private Admin Route / Shortcut state
  const [adminOpen, setAdminOpen] = useState(() => {
    return (
      window.location.hash === '#admin' ||
      window.location.search.includes('admin=true') ||
      window.location.pathname === '/admin'
    );
  });

  // State with LocalStorage & Firebase Persistence
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('samson_custom_projects');
    return saved ? JSON.parse(saved) : CASE_STUDIES;
  });

  const [heroImage, setHeroImage] = useState(() => {
    return localStorage.getItem('samson_hero_image') || '';
  });

  const [resumeUrl, setResumeUrl] = useState(() => {
    return localStorage.getItem('samson_resume_url') || '';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true') ||
        window.location.pathname === '/admin'
      ) {
        setAdminOpen(true);
      }
    };

    const handleKeyDown = (e) => {
      // Secret Admin shortcut: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminOpen(prev => !prev);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);

    // Realtime Projects Subscription from Firestore
    const unsubProjects = subscribeToProjects((remoteProjects) => {
      if (remoteProjects && remoteProjects.length > 0) {
        setProjects(remoteProjects);
        try {
          localStorage.setItem('samson_custom_projects', JSON.stringify(remoteProjects));
        } catch (e) {}
      }
    });

    // Realtime Profile Settings Subscription (hero photo, resume URL)
    const unsubSettings = subscribeToProfileSettings((remoteSettings) => {
      if (remoteSettings) {
        if (remoteSettings.heroImage !== undefined) {
          setHeroImage(remoteSettings.heroImage);
          try { localStorage.setItem('samson_hero_image', remoteSettings.heroImage); } catch (e) {}
        }
        if (remoteSettings.resumeUrl !== undefined) {
          setResumeUrl(remoteSettings.resumeUrl);
          try { localStorage.setItem('samson_resume_url', remoteSettings.resumeUrl); } catch (e) {}
        }
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
      unsubProjects();
      unsubSettings();
    };
  }, []);

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleUploadResume = (newResume) => {
    setResumeUrl(newResume);
    saveProfileSettingsToDB({ resumeUrl: newResume });
  };

  return (
    <div className="app-root">
      <Navbar 
        onOpenResume={() => setResumeOpen(true)} 
      />
      
      <main>
        <Hero 
          onOpenResume={() => setResumeOpen(true)} 
          heroImage={heroImage}
        />
        
        <CaseStudyGallery 
          onSelectProject={(project) => setSelectedProject(project)} 
          customProjects={projects}
        />

        <SkillsMatrix />
        <Contact />
      </main>

      <Footer />

      {/* Modals */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      <ResumeModal 
        isOpen={resumeOpen} 
        onClose={() => setResumeOpen(false)} 
        resumeUrl={resumeUrl}
        onUploadResume={handleUploadResume}
      />

      <AdminPanel 
        isOpen={adminOpen}
        onClose={handleCloseAdmin}
        projects={projects}
        setProjects={setProjects}
        heroImage={heroImage}
        setHeroImage={setHeroImage}
        resumeUrl={resumeUrl}
        setResumeUrl={setResumeUrl}
      />
    </div>
  );
}
