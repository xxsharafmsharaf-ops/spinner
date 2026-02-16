import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leadFormSchema, type LeadFormData, interestCategories } from '../lib/validation';
import { z } from 'zod';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
}

export function LeadFormModal({ isOpen, onClose, onSubmit }: LeadFormModalProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    interest: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = leadFormSchema.parse(formData);
      setErrors({});
      onSubmit(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof LeadFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LeadFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-rose-gold-700 mb-2">
              مرحباً بك في عجلة الحظ!
            </h2>
            <p className="text-gray-600">
              املأ البيانات التالية للبدء
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                الاسم
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  focus:outline-none focus:ring-2 focus:ring-rose-gold-500
                  transition-all
                  ${errors.name ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="أدخل اسمك"
                dir="rtl"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  focus:outline-none focus:ring-2 focus:ring-rose-gold-500
                  transition-all
                  ${errors.phone ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="01XXXXXXXXX"
                dir="ltr"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="interest" className="block text-sm font-semibold text-gray-700 mb-2">
                فئة الاهتمام
              </label>
              <select
                id="interest"
                value={formData.interest}
                onChange={(e) => handleChange('interest', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-lg border-2
                  focus:outline-none focus:ring-2 focus:ring-rose-gold-500
                  transition-all bg-white
                  ${errors.interest ? 'border-red-500' : 'border-gray-300'}
                `}
                dir="rtl"
              >
                <option value="">اختر فئة الاهتمام</option>
                {interestCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.interest && (
                <p className="mt-1 text-sm text-red-500">{errors.interest}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-rose-gold-500 to-rose-gold-600 text-white font-semibold hover:shadow-lg transition-all"
              >
                ابدأ الدوران
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
