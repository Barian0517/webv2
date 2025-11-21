import React, { useEffect, useState } from 'react';
import { NavLink } from '../types';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const links: NavLink[] = [
  { name: '首頁', url: '#home' },
  { name: '關於', url: '#about' },
  { name: '相關作品', url: '#projects' }
];

interface HeaderProps {
  onMusicClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMusicClick }) => {
  const [activeHash, setActiveHash] = useState('#home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setActiveHash(hash);
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-40 flex flex-col md:flex-row justify-between items-center px-6 py-4 backdrop-blur-sm bg-[#0b0f17]/60 border-b border-white/5 gap-4 md:gap-0"
    >
      <div className="text-[#00bfff] font-['Orbitron'] font-bold text-xl tracking-widest">
        BARIAN<span className="text-[#ff00ff]">.MOE</span>
      </div>
      
      <div className="flex items-center gap-8">
        <nav className="flex gap-6">
          {links.map((link) => {
            const isActive = activeHash === link.url;
            return (
              <a
                key={link.name}
                href={link.url}
                className={`relative transition-colors font-['Rajdhani'] font-bold text-lg group ${isActive ? 'text-[#00bfff]' : 'text-gray-300 hover:text-[#00bfff]'}`}
              >
                {link.name}
                <span 
                  className={`absolute -bottom-1 left-0 h-[2px] bg-[#ff00ff] transition-all duration-300 shadow-[0_0_8px_#ff00ff] ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                />
              </a>
            );
          })}
        </nav>

        {/* Music Toggle Button */}
        <button 
          onClick={onMusicClick}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#00bfff]/30 text-[#00bfff] hover:bg-[#00bfff]/10 hover:shadow-[0_0_10px_#00bfff] transition-all duration-300"
          title="Music Player"
        >
          <Music size={20} />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;