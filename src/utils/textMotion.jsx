import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function TextMotion({ text }) {
  const [keyIndex, setKeyIndex] = useState(0);

  // 🔄 Restart animation every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKeyIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const letters = text.split('');

  return (
    <span key={keyIndex}>
      {letters.map((letter, idx) => (
        <motion.span
          key={idx}
          initial={{
            opacity: 0,
            y: 12,
            filter: 'blur(10px) brightness(0.5)',
            color: '#5E35B1'
          }}
          animate={{
            opacity: 1,
            y: 0,
            // ✨ Brightness + glow + de-blur animation
            filter: [
              'blur(10px) brightness(0.5)',
              'blur(2px) brightness(1.6)', // bright glow peak
              'blur(0px) brightness(1)' // clean final
            ],
            // 🎨 Color cycle
            color: '#5E35B1',
            // 💡 Subtle neon glow
            textShadow: ['0 0 2px #EDE7F6', '0 0 8px #EDE7F6', '0 0 2px #EDE7F6']
          }}
          transition={{
            delay: 0.06 * idx, // left-to-right effect
            duration: 0.8,
            filter: { duration: 0.8 },
            color: { duration: 0.9 },
            textShadow: { duration: 1 }
          }}
          style={{ display: 'inline-block' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}
