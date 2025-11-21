import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MiniGame: React.FC = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clickCount, setClickCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);

  const moveBox = useCallback(() => {
    // Avoid spawning too close to edges
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    setPosition({ x: newX, y: newY });
  }, []);

  useEffect(() => {
    moveBox();
  }, [moveBox]);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3 && !showScore) {
      setShowScore(true);
      setScore(3); // Start at 3 points
    } else if (showScore) {
      setScore(prev => prev + 1);
    }
    moveBox();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGameActive(false);
  };

  if (!isGameActive) return null;

  return (
    <>
      <AnimatePresence>
        {showScore && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed left-4 top-1/2 -translate-y-1/2 bg-black/80 border border-[#00bfff] p-4 rounded-lg backdrop-blur-md z-40 neon-shadow min-w-[120px]"
            style={{
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.3)'
            }}
          >
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 bg-[#ff00ff] hover:bg-[#d400d4] text-white rounded-full p-1 shadow-[0_0_10px_#ff00ff] transition-colors z-50 flex items-center justify-center border border-white/20"
              title="關閉遊戲"
            >
              <X size={14} strokeWidth={3} />
            </button>

            <h3 className="text-[#00bfff] font-['Orbitron'] text-sm mb-1">SYSTEM SCORE</h3>
            <p className="text-[#ff00ff] text-3xl font-bold font-['Orbitron']">{score}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        onClick={handleClick}
        initial={false}
        animate={{ top: position.y, left: position.x }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed w-8 h-8 rounded-lg cursor-pointer z-50 group"
        style={{
          background: 'linear-gradient(45deg, #00bfff, #ff00ff)',
          boxShadow: '0 0 15px #00bfff, 0 0 25px #ff00ff'
        }}
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.8 }}
      >
      </motion.div>
    </>
  );
};

export default MiniGame;