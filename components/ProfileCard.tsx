import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Facebook, Github, Youtube, Globe, Server } from 'lucide-react';
import GlitchText from './GlitchText';
import { SocialLink } from '../types';

const AVATAR_IMAGE_URL = './avatar.jpg'; 

const socials: SocialLink[] = [
  { name: 'YouTube', url: 'https://www.youtube.com/@barian0517', icon: <Youtube size={20} />, color: '#ff0000' },
  { name: 'Facebook', url: 'https://www.facebook.com/barian0517/', icon: <Facebook size={20} />, color: '#1877f2' },
  { name: 'GitHub', url: 'https://github.com/Barian0517', icon: <Github size={20} />, color: '#ffffff' },
];

const mainLinks = [
  { name: '自我介紹', url: 'http://barian.moe/', icon: <Globe size={16} /> },
  { name: '我的YT', url: 'https://www.youtube.com/@barian0517', icon: <Youtube size={16} /> },
  { name: 'MC伺服器官網', url: 'https://mcweb.barian.moe', icon: <Server size={16} /> },
];

const ProfileCard: React.FC = () => {
  // 使用 MotionValue 直接儲存目標旋轉角度 (Degrees)
  const rotateXTarget = useMotionValue(0);
  const rotateYTarget = useMotionValue(0);

  // 使用 Spring 讓數值變化平滑，消除手抖或感測器雜訊
  // stiffness 較高讓反應更靈敏，damping 適中保持平滑
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateXSpring = useSpring(rotateXTarget, springConfig);
  const rotateYSpring = useSpring(rotateYTarget, springConfig);

  useEffect(() => {
    // --- 電腦端：滑鼠跟隨邏輯 ---
    const handleMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 計算滑鼠在螢幕中的相對位置 (-0.5 到 0.5)
      const normalizedX = (e.clientX / width) - 0.5;
      const normalizedY = (e.clientY / height) - 0.5;

      // 將位置轉換為角度
      // 滑鼠在左 (-X) -> 卡片向左轉 (-Y rot) => 這是 "Look At" 效果
      rotateYTarget.set(normalizedX * 20); 
      rotateXTarget.set(normalizedY * -20); 
    };

    // --- 手機端：陀螺儀跟隨邏輯 (Billboard/反向補償效果) ---
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      // 限制偵測的最大角度範圍
      const maxTilt = 20;

      // Gamma (左右傾斜)
      // 係數改為 0.3 (大幅降低幅度)，讓效果變成微弱的視差浮動
      const gamma = Math.min(Math.max(e.gamma, -maxTilt), maxTilt);
      rotateYTarget.set(gamma * -0.5); 
      
      // Beta (前後傾斜)
      // 基準點 45 度
      // 係數改為 -0.3 (大幅降低幅度)
      const beta = Math.min(Math.max(e.beta - 45, -maxTilt), maxTilt);
      rotateXTarget.set(beta * 0.5);
    };

    // 偵測是否支援 DeviceOrientation
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [rotateXTarget, rotateYTarget]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 relative z-10 perspective-1000">
      {/* perspective 設置於外層容器 */}
      <div style={{ perspective: '1200px' }} className="w-full max-w-4xl flex justify-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            rotateX: rotateXSpring,
            rotateY: rotateYSpring,
            transformStyle: "preserve-3d"
          }}
          className="relative flex flex-col md:flex-row w-full bg-[#1a2233]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 overflow-hidden"
        >
            {/* 卡片內的光暈效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00bfff]/5 via-transparent to-[#ff00ff]/5 pointer-events-none" />

            {/* Decorative Tech Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#00bfff]/50 rounded-tl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#ff00ff]/50 rounded-br-2xl pointer-events-none" />
            
            {/* Profile Image Section */}
            <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-12 flex flex-col items-center" style={{ transform: "translateZ(30px)" }}>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00bfff] to-[#ff00ff] rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <img 
                        src={AVATAR_IMAGE_URL}
                        alt="Avatar" 
                        className="relative w-[200px] h-[200px] md:w-[280px] md:h-[280px] object-cover rounded-xl shadow-2xl border-2 border-white/10"
                        onError={(e) => {
                          // 錯誤處理：使用內建圖示或顏色區塊，避免外部圖片依賴問題
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-[200px] h-[200px] md:w-[280px] md:h-[280px] bg-[#0b0f17] flex items-center justify-center rounded-xl border-2 border-white/10 text-white/20">
                              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                          `;
                        }}
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-left" style={{ transform: "translateZ(20px)" }}>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-['Orbitron'] tracking-wider">
                    <GlitchText text="幽影櫻" />
                </h1>
                
                <div className="space-y-4 text-gray-300 mb-8 font-['Zen_Maru_Gothic'] text-lg leading-relaxed">
                    <motion.p 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="border-l-2 border-[#00bfff] pl-4"
                    >
                        喜歡打遊戲，玩玩 Apex。
                    </motion.p>
                    <motion.p 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="border-l-2 border-[#ff00ff] pl-4"
                    >
                        最近大部分時間都在 Minecraft，
                        <br />
                        有架設 Minecraft 1.20.1 Forge 伺服器。
                    </motion.p>
                </div>

                {/* Social Icons */}
                <div className="flex gap-4 mb-8">
                    {socials.map((social) => (
                        <motion.a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -5, scale: 1.1 }}
                            className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-[#00bfff] transition-colors shadow-[0_0_10px_transparent] hover:shadow-[0_0_15px_#00bfff]"
                            style={{ color: social.color }}
                        >
                            {social.icon}
                        </motion.a>
                    ))}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

                {/* Action Links */}
                <div>
                    <p className="text-[#00bfff] font-['Orbitron'] text-sm mb-4 tracking-widest uppercase">System Links</p>
                    <div className="flex flex-wrap gap-3">
                        {mainLinks.map((link, i) => (
                            <motion.a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 bg-[#1a2233] border border-[#00bfff]/30 rounded-lg text-white font-bold hover:bg-[#00bfff] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,191,255,0.1)] hover:shadow-[0_0_20px_rgba(0,191,255,0.6)]"
                            >
                                {link.icon}
                                {link.name}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileCard;