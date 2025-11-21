import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music } from 'lucide-react';
import { Song } from '../types';

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isOpen, onClose }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load songs using Vite's import.meta.glob
  useEffect(() => {
    const loadSongs = async () => {
      // This assumes files are in src/assets/mp3/
      // Fix: Cast import.meta to any to access glob method which is a Vite extension
      const modules = (import.meta as any).glob('/src/assets/mp3/*.mp3', { eager: true });
      
      const songList: Song[] = Object.entries(modules).map(([path, module]) => {
        // Extract filename as title
        const fileName = path.split('/').pop()?.replace('.mp3', '') || 'Unknown Track';
        return {
          title: decodeURIComponent(fileName),
          url: (module as any).default
        };
      });

      setSongs(songList);
    };

    loadSongs();
  }, []);

  // Handle Play/Pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleNext = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  if (songs.length === 0) {
    // If hidden, don't render anything, or render empty state if open
    if (!isOpen) return null;
    return (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed top-20 right-4 bg-[#0b0f17]/90 border border-[#00bfff]/30 p-4 rounded-xl z-50 backdrop-blur-md text-white w-64"
        >
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-[#00bfff] font-['Orbitron'] text-sm">MUSIC PLAYER</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16}/></button>
             </div>
             <div className="text-xs text-gray-400">No MP3 files found in src/assets/mp3/</div>
        </motion.div>
    );
  }

  return (
    <>
      <audio 
        ref={audioRef} 
        src={songs[currentSongIndex].url} 
        onEnded={handleNext}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 right-4 w-72 bg-[#1a2233]/90 backdrop-blur-xl border border-[#00bfff]/30 rounded-xl p-5 z-50 shadow-[0_0_20px_rgba(0,191,255,0.2)]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Music size={16} className="text-[#ff00ff]" />
                <h3 className="text-[#00bfff] font-['Orbitron'] text-sm tracking-wider">SYS.AUDIO</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Now Playing Info */}
            <div className="mb-4 overflow-hidden">
              <div className="text-white font-['Zen_Maru_Gothic'] font-bold truncate text-lg">
                {songs[currentSongIndex].title}
              </div>
              <div className="text-[#00bfff]/70 text-xs font-['Rajdhani']">
                TRACK {currentSongIndex + 1} / {songs.length}
              </div>
            </div>

            {/* Visualizer Animation */}
            <div className="h-12 flex items-end justify-between gap-1 mb-4 px-2">
               {[...Array(12)].map((_, i) => (
                 <div 
                   key={i}
                   className={`w-1.5 bg-gradient-to-t from-[#00bfff] to-[#ff00ff] rounded-t-sm transition-all duration-100 ease-in-out ${isPlaying ? 'animate-pulse' : 'h-1'}`}
                   style={{ 
                     height: isPlaying ? `${Math.random() * 100}%` : '10%',
                     animationDuration: `${0.4 + Math.random() * 0.5}s`
                   }}
                 />
               ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mb-4">
              <button onClick={handlePrev} className="text-gray-300 hover:text-[#00bfff] transition-colors">
                <SkipBack size={24} />
              </button>
              <button 
                onClick={togglePlay} 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00bfff] to-[#ff00ff] flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
              </button>
              <button onClick={handleNext} className="text-gray-300 hover:text-[#00bfff] transition-colors">
                <SkipForward size={24} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00bfff] [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;