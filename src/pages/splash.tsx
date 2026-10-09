import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Splash() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  // Auto-progress
  useEffect(() => {
    const duration = 4000; // 4 seconds
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      if (currentStep >= steps) {
        clearInterval(timer);
        router.push('/');
      }
    }, interval);

    return () => clearInterval(timer);
  }, [router]);

  // Tap anywhere to skip
  const handleSkip = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Universal AI University | Sports Person of the Year</title>
      </Head>
      <main 
        onClick={handleSkip}
        className="min-h-screen bg-[#07090F] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative selection:bg-transparent"
      >
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090F] via-[#0B101E] to-[#07090F] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

        {/* Floating Logo with 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 bg-black/50 p-6 rounded-[2rem] border border-white/5 shadow-2xl mb-12 backdrop-blur-md"
        >
          <img src="/images/uaiu-logo.png" alt="UAI" className="w-24 h-24 object-contain drop-shadow-xl" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-center z-10"
        >
          <h1 className="font-headline-xl text-5xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-[#8AB4F8] drop-shadow-sm">UNIVERSAL AI UNIV</span>
            <span className="text-[#FFC107] drop-shadow-sm">ERSITY</span>
          </h1>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-[#8AB4F8] font-headline-lg text-2xl font-bold tracking-widest uppercase mb-8"
          >
            Sports Person of the Year
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-white/40 font-body-md text-sm font-medium tracking-wide"
          >
            Where Champions Rise • Equal Grit, Unlimited Glory
          </motion.p>
        </motion.div>

        {/* Progress Bar & Skip */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-20 flex flex-col items-center z-10 w-full"
        >
          <div className="w-48 h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8AB4F8] to-[#FFC107] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
            <span className="text-[#FFC107] text-xs">⚡</span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Tap anywhere to skip</span>
          </div>
        </motion.div>
      </main>
    </>
  );
}
