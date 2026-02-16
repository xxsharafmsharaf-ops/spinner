import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiLayerProps {
  trigger: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

const colors = [
  '#ec4899', // rose-gold-500
  '#f472b6', // rose-gold-400
  '#db2777', // rose-gold-600
  '#fbcfe8', // rose-gold-200
  '#9f1239', // rose-gold-800
];

export function ConfettiLayer({ trigger }: ConfettiLayerProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger) {
      // Generate 50 confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setPieces(newPieces);

      // Clear pieces after animation
      setTimeout(() => {
        setPieces([]);
      }, 3000);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: `${piece.y}vh`,
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 360,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.5,
                delay: piece.delay,
                ease: 'easeOut',
              }}
              className="absolute w-3 h-3"
              style={{
                backgroundColor: piece.color,
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
