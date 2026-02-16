import { z } from 'zod';

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
    .max(50, 'الاسم طويل جداً'),
  phone: z
    .string()
    .regex(
      /^(\+20|0)?1[0-9]{9}$/,
      'رقم الهاتف غير صحيح. يرجى إدخال رقم مصري صحيح'
    ),
  interest: z
    .string()
    .min(1, 'يرجى اختيار فئة الاهتمام'),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const interestCategories = [
  { value: 'skincare', label: 'العناية بالبشرة' },
  { value: 'beauty', label: 'التجميل' },
  { value: 'desserts', label: 'الحلويات' },
  { value: 'clinic', label: 'العيادات' },
  { value: 'general', label: 'عام' },
];
