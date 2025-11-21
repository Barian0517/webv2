import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Code2 } from 'lucide-react';
import { Repository } from '../types';
import GlitchText from './GlitchText';

const Projects: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Fetch repos from GitHub API
        const response = await fetch('https://api.github.com/users/Barian0517/repos?sort=pushed&direction=desc');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setRepos(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return (
    <div className="min-h-screen p-4 pt-28 pb-20 relative z-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4">
           <h2 className="text-3xl md:text-4xl font-bold text-white font-['Orbitron'] tracking-wider">
            <GlitchText text="相關作品" />
            <span className="text-[#90ee90] text-lg ml-4 font-['Rajdhani'] opacity-70">/ GITHUB REPOSITORIES</span>
          </h2>
          <div className="text-[#90ee90] font-['Rajdhani'] hidden md:block">
             Fetching from: github.com/Barian0517
          </div>
        </div>
       

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-[#00bfff] text-xl font-['Orbitron'] animate-pulse">LOADING SYSTEM DATA...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{ repo: Repository; index: number }> = ({ repo, index }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to guess a preview image from the repo (e.g. preview.png or preview.jpg in main branch)
    // This is a heuristic since the API doesn't provide screenshots directly.
    // We start with preview.png
    const tryImg = `https://raw.githubusercontent.com/Barian0517/${repo.name}/main/preview.png`;
    setImgSrc(tryImg);
  }, [repo.name]);

  const handleImgError = () => {
    // If preview.png fails, we revert to null to show the fallback gradient
    setImgSrc(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-[#1a2233]/60 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden hover:border-[#00bfff]/50 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_20px_rgba(0,191,255,0.15)]"
    >
      {/* Image Area */}
      <div className="h-48 w-full overflow-hidden bg-[#0f1623] relative">
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={repo.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImgError}
          />
        ) : (
          // Fallback Gradient Pattern
          <div 
            className="w-full h-full flex flex-col items-center justify-center relative"
            style={{
               background: `linear-gradient(135deg, #1a2233 0%, #0b0f17 100%)`
            }}
          >
             <div className="absolute inset-0 opacity-20" style={{
                 backgroundImage: 'radial-gradient(circle at 2px 2px, #00bfff 1px, transparent 0)',
                 backgroundSize: '20px 20px'
             }}></div>
             <Code2 size={48} className="text-[#00bfff]/30 mb-2" />
             <span className="text-white/20 font-['Orbitron'] text-sm">{repo.language || 'PROJECT'}</span>
          </div>
        )}
        
        {/* Language Tag Overlay */}
        {repo.language && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full text-xs text-[#00bfff] font-bold shadow-lg">
            {repo.language}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 font-['Zen_Maru_Gothic'] group-hover:text-[#00bfff] transition-colors">
          {repo.name}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {repo.description || "No description provided for this project."}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
            <a 
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#3b4148] text-white py-2 rounded-lg transition-colors text-sm font-medium border border-white/5"
            >
              <Github size={16} />
              Github
            </a>
            {repo.homepage && (
               <a 
               href={repo.homepage}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 flex items-center justify-center gap-2 bg-[#90ee90]/20 hover:bg-[#90ee90]/30 text-[#90ee90] py-2 rounded-lg transition-colors text-sm font-medium border border-[#90ee90]/20"
             >
               <ExternalLink size={16} />
               Demo
             </a>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;