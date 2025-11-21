import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Background from './components/Background';
import MouseCanvas from './components/MouseCanvas';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';
import About from './components/About';
import Projects from './components/Projects';
import MiniGame from './components/MiniGame';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      // Get hash, remove #, default to 'home' if empty
      const hash = window.location.hash.replace('#', '') || 'home';
      setCurrentView(hash);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Set initial state
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden scanlines">
      {/* Visual Layers */}
      <Background />
      <MouseCanvas />
      
      {/* UI Layers */}
      <Header onMusicClick={() => setShowMusicPlayer(!showMusicPlayer)} />
      
      {/* Music Player Component (Always rendered to keep audio playing, visibility controlled by props) */}
      <MusicPlayer isOpen={showMusicPlayer} onClose={() => setShowMusicPlayer(false)} />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
             <ProfileCard key="home" />
          )}
          {currentView === 'about' && (
             <About key="about" />
          )}
           {currentView === 'projects' && (
             <Projects key="projects" />
          )}
        </AnimatePresence>
      </main>
      
      {/* Interactive Layers */}
      <MiniGame />
    </div>
  );
};

export default App;