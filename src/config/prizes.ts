export interface Prize {
  id: string;
  label: string; // Arabic label
  weight: number; // Probability weight (higher = more likely)
  category: string;
}

export const prizes: Prize[] = [
  {
    id: '1',
    label: 'عرض الاخوات',
    weight: 10,
    category: 'family',
  },
  {
    id: '2',
    label: 'عرض الاهتمام',
    weight: 15,
    category: 'special',
  },
  {
    id: '3',
    label: 'عرض الفنانين',
    weight: 12,
    category: 'artists',
  },
  {
    id: '4',
    label: 'عرض الكبير',
    weight: 8,
    category: 'premium',
  },
  {
    id: '5',
    label: 'عرض الكرم',
    weight: 15,
    category: 'generosity',
  },
  {
    id: '6',
    label: 'عرض الكييفه',
    weight: 12,
    category: 'group',
  },
  {
    id: '7',
    label: 'عرض البؤساء',
    weight: 10,
    category: 'special',
  },
  {
    id: '8',
    label: 'عرض الحلويات',
    weight: 18,
    category: 'sweets',
  },
];

// Calculate total weight for probability distribution
export const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);

// Function to select a prize based on weighted probability
export function selectPrize(): Prize {
  const random = Math.random() * totalWeight;
  let currentWeight = 0;
  
  for (const prize of prizes) {
    currentWeight += prize.weight;
    if (random <= currentWeight) {
      return prize;
    }
  }
  
  // Fallback to last prize (should never happen)
  return prizes[prizes.length - 1];
}
