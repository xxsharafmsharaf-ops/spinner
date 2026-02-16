import { motion } from 'framer-motion';

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export function SpinButton({ onClick, disabled, isSpinning }: SpinButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isSpinning}
      className={`
        relative px-16 py-5 rounded-full font-bold text-xl md:text-2xl
        bg-gradient-to-r  cursor-pointer from-rose-gold-500 to-rose-gold-600
        text-white shadow-lg hover:shadow-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:shadow-lg
        ${isSpinning ? 'cursor-wait' : 'hover:scale-105 active:scale-95'}
      `}
      whileHover={!disabled && !isSpinning ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isSpinning ? { scale: 0.95 } : {}}
    >
      <span className="relative z-10 text-shadow">
        {isSpinning ? 'جاري الدوران...' : 'دور العجلة'}
      </span>
      
      {isSpinning && (
        <motion.div
          className="absolute inset-0 rounded-full bg-rose-gold-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
}
