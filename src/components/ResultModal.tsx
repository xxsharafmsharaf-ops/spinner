import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Prize } from '../config/prizes';

interface ResultModalProps {
  isOpen: boolean;
  prize: Prize | null;
  couponCode: string;
  userName: string;
  userPhone: string;
  onClose: () => void;
}

export function ResultModal({
  isOpen,
  prize,
  couponCode,
  userName,
  userPhone,
  onClose,
}: ResultModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `مرحباً! فزت بـ ${prize?.label}\nكود الخصم: ${couponCode}\nشكراً لك!`
    );
    window.open(`https://wa.me/20${userPhone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  if (!isOpen || !prize) return null;
 
  const isLoss = prize.category === 'try-again' || prize.category === 'hard-luck';
  const isTryAgain = prize.category === 'try-again';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-white to-beige-50 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold-200/20 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-gold-300/20 rounded-full -ml-12 -mb-12" />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isLoss 
                  ? 'bg-gradient-to-br from-gray-400 to-gray-600' 
                  : 'bg-gradient-to-br from-rose-gold-400 to-rose-gold-600'
              }`}
            >
              <span className="text-4xl">
                {isLoss ? (isTryAgain ? '🔄' : '😔') : '🎉'}
              </span>
            </motion.div>

            <h2 className="text-3xl font-bold text-rose-gold-700 mb-2">
              {isLoss ? `${userName}` : `مبروك ${userName}!`}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {isLoss ? '' : 'لقد فزت بـ'}
            </p>

            {/* Prize highlight */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-white rounded-xl p-6 mb-6 shadow-lg ${
                isLoss 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
                  : 'bg-gradient-to-r from-rose-gold-500 to-rose-gold-600'
              }`}
            >
              <p className="text-2xl font-bold text-shadow-lg">
                {prize.label}
              </p>
              {isLoss && (
                <p className="text-sm mt-2 opacity-90">
                  {isTryAgain 
                    ? 'للأسف لم تفز هذه المرة، حاول مرة أخرى في وقت لاحق!' 
                    : 'للأسف لم يحالفك الحظ هذه المرة'}
                </p>
              )}
            </motion.div>

            {/* Coupon code - only show for winners */}
            {!isLoss && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">كود الخصم الخاص بك:</p>
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="px-6 py-3 bg-white border-2 border-rose-gold-300 rounded-lg font-mono text-xl font-bold text-rose-gold-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    {couponCode}
                  </motion.div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-3 bg-rose-gold-100 hover:bg-rose-gold-200 text-rose-gold-700 rounded-lg font-semibold transition-colors"
                    title="نسخ الكود"
                  >
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600 mt-2"
                  >
                    تم النسخ!
                  </motion.p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {!isLoss && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span>شارك على واتساب</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                إغلاق
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              {isLoss ? 'نتمنى لك حظاً أوفر في المرة القادمة!' : 'شكراً لزيارتك'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
