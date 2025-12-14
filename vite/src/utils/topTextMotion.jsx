import { motion } from 'framer-motion';

export default function TopTextMotion({ text }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -8,
        filter: 'brightness(0.8)'
      }}
      animate={{
        opacity: 1,
        y: 0,
        color: '#4B0082', // ⭐ Texto principal masculino
        filter: ['brightness(0.9)', 'brightness(1.2)', 'brightness(1)'],
        textShadow: [
          '0 0 2px #37474F', // sombra gris oscuro
          '0 0 6px #ECEFF1', // brillo sutil blanco
          '0 0 3px #37474F'
        ]
      }}
      transition={{
        duration: 1.2,
        ease: 'easeOut',
        textShadow: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'mirror'
        },
        filter: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'mirror'
        }
      }}
      style={{ display: 'inline-block', fontWeight: 'bold' }}
    >
      {text}
    </motion.div>
  );
}
