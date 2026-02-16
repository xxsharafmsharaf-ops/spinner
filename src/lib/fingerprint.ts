 
export function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasFingerprint = '';
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasFingerprint.substring(0, 100),
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory || 'unknown',
  };
 
  const fingerprintString = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Check if device has spun before using ALL protection methods
 */
export function hasDeviceSpunBefore(): boolean {
  // Check localStorage (persists after browser close)
  if (localStorage.getItem('vienna_spin_completed') === 'true') {
    return true;
  }
  
  // Check sessionStorage
  if (sessionStorage.getItem('vienna_spin_completed') === 'true') {
    return true;
  }
  
  // Check cookie
  if (document.cookie.includes('vienna_spin=done')) {
    return true;
  }
  
  // Check device fingerprint
  const fingerprint = generateDeviceFingerprint();
  const storedFingerprints = localStorage.getItem('vienna_fingerprints');
  if (storedFingerprints) {
    const fingerprints = JSON.parse(storedFingerprints);
    if (fingerprints.includes(fingerprint)) {
      return true;
    }
  }
  
  // Check IndexedDB asynchronously (non-blocking)
  try {
    const request = indexedDB.open('ViennaSpinDB', 1);
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      if (db.objectStoreNames.contains('spins')) {
        const transaction = db.transaction(['spins'], 'readonly');
        const store = transaction.objectStore('spins');
        const getRequest = store.get('hasSpun');
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            // Force mark as spun if found in IndexedDB
            localStorage.setItem('vienna_spin_completed', 'true');
            sessionStorage.setItem('vienna_spin_completed', 'true');
          }
        };
      }
    };
  } catch (error) {
    console.error('IndexedDB check error:', error);
  }
  
  return false;
}

/**
 * Mark device as having spun using ALL protection methods
 */
export function markDeviceAsSpun(): void {
  // Set localStorage (persists after browser close)
  localStorage.setItem('vienna_spin_completed', 'true');
  
  // Set sessionStorage
  sessionStorage.setItem('vienna_spin_completed', 'true');
  
  // Set long-lasting cookie (10 years!)
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 10);
  document.cookie = `vienna_spin=done; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  
  // Store device fingerprint
  const fingerprint = generateDeviceFingerprint();
  const storedFingerprints = localStorage.getItem('vienna_fingerprints');
  let fingerprints = storedFingerprints ? JSON.parse(storedFingerprints) : [];
  
  if (!fingerprints.includes(fingerprint)) {
    fingerprints.push(fingerprint);
    localStorage.setItem('vienna_fingerprints', JSON.stringify(fingerprints));
  }
  
  // Store in IndexedDB for extra persistence
  try {
    const request = indexedDB.open('ViennaSpinDB', 1);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('spins')) {
        db.createObjectStore('spins');
      }
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(['spins'], 'readwrite');
      const store = transaction.objectStore('spins');
      store.put({ spun: true, timestamp: Date.now(), fingerprint }, 'hasSpun');
    };
  } catch (error) {
    console.error('IndexedDB error:', error);
  }
}

/**
 * Get spin result from localStorage (persists after browser close)
 */
export function getSavedSpinResult() {
  const saved = localStorage.getItem('vienna_spin_result');
  return saved ? JSON.parse(saved) : null;
}

/** 
 */
export function saveSpinResult(result: any): void {
  localStorage.setItem('vienna_spin_result', JSON.stringify(result));
}
