import React from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-[#1a2233]/80 backdrop-blur-xl border border-[#00bfff]/30 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_30px_rgba(0,191,255,0.15)]"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#ff00ff]/50 rounded-tr-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#00bfff]/50 rounded-bl-2xl pointer-events-none" />
        <div className="absolute -right-10 top-1/2 w-40 h-40 bg-[#ff00ff]/10 blur-3xl rounded-full pointer-events-none" />
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-['Orbitron'] tracking-wider border-b border-white/10 pb-4">
          <GlitchText text="關於我" />
          <span className="text-[#00bfff] text-lg ml-4 font-['Rajdhani'] opacity-70">/ ABOUT ME</span>
        </h2>

        <div className="space-y-6 text-gray-200 font-['Zen_Maru_Gothic'] text-lg leading-relaxed">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-white/5 rounded-lg border-l-4 border-[#00bfff]"
          >
            <p>
              我是 <strong className="text-[#00bfff]">幽影櫻</strong>，一個喜歡資訊與遊戲的人。
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="mb-2">
              有在架設 <span className="text-[#ff00ff]">Minecraft 伺服器</span>、研究各種資訊相關知識。
            </p>
            <p>
              也了解過 AI、Docker、虛擬機（PVE）、YOLOv8、Linux CT 使用。
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-white/5 rounded-lg border-r-4 border-[#ff00ff] text-right"
          >
            <p>
              最近主要投入在 <span className="text-[#ff00ff] font-bold">Minecraft</span> 相關的技術研究。
            </p>
          </motion.div>
        </div>
        
        {/* Tech Stats Decoration */}
        <div className="mt-10 pt-6 border-t border-white/10 flex justify-between text-xs font-['Rajdhani'] text-[#00bfff]/60">
            <span>SYS.STATUS: ONLINE</span>
            <span>LOCATION: TAIWAN</span>
            <span>ROLE: ADMIN</span>
        </div>
      </motion.div>
    </div>
  );
};

export default About;