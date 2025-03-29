'use client';

import { motion, useScroll } from 'framer-motion';

export default function ProgressHeader() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-2 origin-left z-50"
      style={{
        scaleX: scrollYProgress,
        background:
          'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 3s infinite linear',
      }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
    />
  );
}
