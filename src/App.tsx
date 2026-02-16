import { useState, useEffect } from 'react'; 
import { SpinnerWheel } from './components/SpinnerWheel';
import { SpinButton } from './components/SpinButton';
import { LeadFormModal } from './components/LeadFormModal';
import { ResultModal } from './components/ResultModal';
import { ConfettiLayer } from './components/ConfettiLayer';
import { prizes } from './config/prizes';
import { hasDeviceSpunBefore, markDeviceAsSpun, generateDeviceFingerprint, getSavedSpinResult, saveSpinResult } from './lib/fingerprint';
import type { LeadFormData } from './lib/validation';
import './index.css';

interface SpinResult {
  prize: {
    id: string;
    label: string;
    category: string;
  };
  couponCode: string;
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrizeIndex, setSelectedPrizeIndex] = useState<number | null>(null);
  const [, setSpinComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [userData, setUserData] = useState<LeadFormData | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  useEffect(() => {
    // Check if device has already spun (all protection layers)
    if (hasDeviceSpunBefore()) {
      setHasSpun(true);
      
      // Restore previous result if exists
      const savedResult = getSavedSpinResult();
      if (savedResult) {
        setSpinResult(savedResult.spinResult);
        setUserData(savedResult.userData);
      }
    }
  }, []);

  const handleFormSubmit = (data: LeadFormData) => {
    setUserData(data);
    setShowForm(false);
    handleSpin(data);
  };

  const handleSpin = async (formData: LeadFormData) => {
    if (hasSpun || isSpinning) return;

    setIsSpinning(true);
    setSelectedPrizeIndex(null);

    try {
      // Generate device fingerprint for additional security
      const fingerprint = generateDeviceFingerprint();
      
      let result;
      
      // Try Netlify Function first
      try {
        const response = await fetch('/.netlify/functions/spin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            interest: formData.interest,
            fingerprint: fingerprint,
          }),
        });

        if (!response.ok) {
          throw new Error('Netlify function not available');
        }

        result = await response.json();
      } catch { 
        console.log('Using local fallback for development');
         
        const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
        const random = Math.random() * totalWeight;
        let currentWeight = 0;
        let selectedPrize = prizes[0];
        
        for (const prize of prizes) {
          currentWeight += prize.weight;
          if (random <= currentWeight) {
            selectedPrize = prize;
            break;
          }
        }
        
        // Generate coupon code
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        
        result = {
          success: true,
          prize: {
            id: selectedPrize.id,
            label: selectedPrize.label,
            category: selectedPrize.category,
          },
          couponCode: `SPIN-${randomCode}`,
        };
      }

      if (!result.success) {
        if (result.error === 'already_spun') {
          alert('🚫 ' + (result.message || 'لقد قمت بالدوران من قبل'));
          setHasSpun(true);
          markDeviceAsSpun();
        } else {
          alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
        }
        setIsSpinning(false);
        return;
      }
 
      const prizeIndex = prizes.findIndex((p) => p.id === result.prize.id);
      setSelectedPrizeIndex(prizeIndex >= 0 ? prizeIndex : 0);

      // Store result
      setSpinResult({
        prize: result.prize,
        couponCode: result.couponCode,
      }); 
      markDeviceAsSpun();
      setHasSpun(true);
       
      saveSpinResult({
        spinResult: {
          prize: result.prize,
          couponCode: result.couponCode,
        },
        userData: formData,
      });
       
    } catch (error) {
      console.error('Spin error:', error);
      alert('⚠️ حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      setIsSpinning(false);
    }
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    setSpinComplete(true);
    setConfettiTrigger(true);
    
    // Show result modal after a brief delay
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleStartClick = () => {
    if (hasSpun) {
      alert('🔒 لقد قمت بالدوران من قبل على هذا الجهاز. يمكنك الدوران مرة واحدة فقط.');
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-white to-beige-100 flex flex-col items-center justify-center p-4">
      <ConfettiLayer trigger={confettiTrigger} />

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-rose-gold-700 mb-3 text-shadow-lg">
          عجلة الحظ
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">
          ادور واربح عروض حصرية ومميزة
        </p>
      </div>

      {/* Spinner Wheel */}
      <div className="mb-10 flex justify-center items-center w-full px-4">
        <SpinnerWheel
          isSpinning={isSpinning}
          selectedPrize={selectedPrizeIndex}
          onSpinComplete={handleSpinComplete}
        />
      </div>

      {/* Spin Button */}
      <div className="mb-8">
        <SpinButton
          onClick={handleStartClick}
          disabled={hasSpun}
          isSpinning={isSpinning}
        />
      </div>

      {/* Info */}
      {hasSpun && spinResult && userData && (
        <div className="bg-rose-gold-50 border-2 border-rose-gold-200 rounded-lg p-4 max-w-md text-center">
          <p className="text-rose-gold-700 font-semibold text-lg">
            لقد قمت بالدوران من قبل
          </p>
          <p className="text-sm text-gray-600 mt-1">
            يمكنك الدوران مرة واحدة فقط على هذا الجهاز
          </p>
          <button
            onClick={() => setShowResult(true)}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-rose-gold-500 to-rose-gold-600 hover:shadow-lg text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            عرض النتيجة مرة أخرى
          </button>
        </div>
      )}

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Result Modal */}
      {spinResult && userData && (
        <ResultModal
          isOpen={showResult}
          prize={{
            id: spinResult.prize.id,
            label: spinResult.prize.label,
            weight: 0,
            category: spinResult.prize.category,
          }}
          couponCode={spinResult.couponCode}
          userName={userData.name}
          userPhone={userData.phone}
          onClose={() => setShowResult(false)}
        />
      )}

    </div>
  );
}

export default App;
