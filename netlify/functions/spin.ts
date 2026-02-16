import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Prize configuration (matching frontend)
interface Prize {
  id: string;
  label: string;
  weight: number;
  category: string;
}

const prizes: Prize[] = [
  { id: '1', label: 'عرض الاخوات', weight: 10, category: 'family' },
  { id: '2', label: 'عرض الاهتمام', weight: 15, category: 'special' },
  { id: '3', label: 'عرض الفنانين', weight: 12, category: 'artists' },
  { id: '4', label: 'عرض الكبير', weight: 8, category: 'premium' },
  { id: '5', label: 'عرض الكرم', weight: 15, category: 'generosity' },
  { id: '6', label: 'عرض الكييفه', weight: 12, category: 'group' },
  { id: '7', label: 'عرض البؤساء', weight: 10, category: 'special' },
  { id: '8', label: 'عرض شله الحلويات', weight: 18, category: 'sweets' },
];

const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);

function selectPrize(): Prize {
  const random = Math.random() * totalWeight;
  let currentWeight = 0;
  
  for (const prize of prizes) {
    currentWeight += prize.weight;
    if (random <= currentWeight) {
      return prize;
    }
  }
  
  return prizes[prizes.length - 1];
}

function generateCouponCode(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SPIN-${random}`;
}

interface SpinRequest {
  name: string;
  phone: string;
  interest: string;
  fingerprint: string;
}

interface SpinResponse {
  success: boolean;
  prize?: {
    id: string;
    label: string;
    category: string;
  };
  couponCode?: string;
  error?: string;
  message?: string;
}

// In-memory storage for IPs and fingerprints (will reset on function cold start)
// For production, use Netlify Blobs or KV store
const spunDevices = new Set<string>();

// Get client IP from headers
function getClientIP(headers: Record<string, string | string[] | undefined>): string {
  const forwardedFor = headers['x-forwarded-for'];
  if (forwardedFor) {
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return ip.split(',')[0].trim();
  }
  
  const realIP = headers['x-real-ip'];
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }
  
  return '127.0.0.1';
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
): Promise<{ statusCode: number; body: string; headers?: Record<string, string> }> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed',
      } as SpinResponse),
    };
  }

  try {
    const body: SpinRequest = JSON.parse(event.body || '{}');

    if (!body.name || !body.phone || !body.interest) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields',
        } as SpinResponse),
      };
    }

    const clientIP = getClientIP(event.headers);
    const deviceFingerprint = body.fingerprint || '';
    const deviceKey = `${clientIP}-${deviceFingerprint}`;
    
    // Check if device has already spun
    if (spunDevices.has(deviceKey) || spunDevices.has(clientIP)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'already_spun',
          message: 'لقد قمت بالدوران من قبل. يمكنك الدوران مرة واحدة فقط.',
        } as SpinResponse),
      };
    }

    // Mark device as spun
    spunDevices.add(deviceKey);
    spunDevices.add(clientIP);

    const prize = selectPrize();
    const couponCode = generateCouponCode();

    // Log spin (optional - can be sent to external service)
    console.log('Spin:', {
      ip: clientIP,
      fingerprint: deviceFingerprint,
      name: body.name,
      phone: body.phone,
      prize: prize.label,
      couponCode,
      timestamp: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        prize: {
          id: prize.id,
          label: prize.label,
          category: prize.category,
        },
        couponCode,
      } as SpinResponse),
    };
  } catch (error) {
    console.error('Spin function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      } as SpinResponse),
    };
  }
};
