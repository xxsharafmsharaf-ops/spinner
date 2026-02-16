import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { prizes } from '../config/prizes';

interface SpinnerWheelProps {
  isSpinning: boolean;
  selectedPrize: number | null;
  onSpinComplete: () => void;
}

const SEGMENT_COUNT = prizes.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;

export function SpinnerWheel({ isSpinning, selectedPrize, onSpinComplete }: SpinnerWheelProps) {
  const controls = useAnimation();
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (isSpinning && selectedPrize !== null && !hasCompleted.current) {
      hasCompleted.current = true;
      
      // Calculate rotation: multiple full spins + target segment
      const baseRotation = 360 * 5; // 5 full spins
      const targetAngle = selectedPrize * SEGMENT_ANGLE;
      const finalRotation = baseRotation + (360 - targetAngle) + SEGMENT_ANGLE / 2;
      
      controls.start({
        rotate: finalRotation,
        transition: {
          duration: 4,
          ease: [0.17, 0.67, 0.83, 0.67], // Ease out cubic
        },
      }).then(() => {
        onSpinComplete();
      });
    }
  }, [isSpinning, selectedPrize, controls, onSpinComplete]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[60px] border-t-rose-gold-600 drop-shadow-lg" />
      </div>

      {/* Wheel */}
      <motion.div
        className="relative w-full aspect-square"
        animate={controls}
        style={{ transformOrigin: 'center' }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-2xl"
        >
          <defs>
            <pattern id="vienna-logo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="45" fill="white" stroke="#9f1239" strokeWidth="2" />
            </pattern>
          </defs>
          
          {/* Center circle */}
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="white"
            stroke="#9f1239"
            strokeWidth="6"
            className="drop-shadow-lg"
          />
          <text
            x="200"
            y="205"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-rose-gold-700 font-bold"
            style={{ fontFamily: 'Cairo, sans-serif', fontSize: '32px', fontWeight: '700', letterSpacing: '2px' }}
          >
            عجلة الحظ
          </text>

          {/* Segments */}
          {prizes.map((prize, index) => {
            const startAngle = (index * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const endAngle = ((index + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);
            const isRed = index % 2 === 0;
            const fillColor = isRed ? '#9f1239' : '#ffffff';
            const textColor = isRed ? '#ffffff' : '#9f1239';
            
            // Calculate path for segment
            const innerRadius = 120;
            const outerRadius = 190;
            const x1 = 200 + innerRadius * Math.cos(startAngle);
            const y1 = 200 + innerRadius * Math.sin(startAngle);
            const x2 = 200 + outerRadius * Math.cos(startAngle);
            const y2 = 200 + outerRadius * Math.sin(startAngle);
            const x3 = 200 + outerRadius * Math.cos(endAngle);
            const y3 = 200 + outerRadius * Math.sin(endAngle);
            const x4 = 200 + innerRadius * Math.cos(endAngle);
            const y4 = 200 + innerRadius * Math.sin(endAngle);
            
            const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;
            
            const pathData = [
              `M ${x1} ${y1}`,
              `L ${x2} ${y2}`,
              `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
              `L ${x4} ${y4}`,
              `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
            ].join(' ');

            // Text position
            const textAngle = (index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2 - 90) * (Math.PI / 180);
            const textRadius = (innerRadius + outerRadius) / 2;
            const textX = 200 + textRadius * Math.cos(textAngle);
            const textY = 200 + textRadius * Math.sin(textAngle);

            return (
              <g key={prize.id}>
                <path
                  d={pathData}
                  fill={fillColor}
                  stroke="#9f1239"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-semibold"
                  fill={textColor}
                  style={{ fontFamily: 'Cairo, sans-serif', fontSize: '16px', fontWeight: '700' }}
                  transform={`rotate(${index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2} ${textX} ${textY})`}
                >
                  {prize.label}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
