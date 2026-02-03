'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

/**
 * Hook สำหรับ navigation ที่ smooth
 * ใช้แทน useRouter เพื่อให้มี transition animation
 */
export function useSmoothNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useCallback(async (path: string, delay: number = 150) => {
    setIsNavigating(true);
    
    // รอ animation เสร็จก่อน
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Navigate
    router.push(path);
    
    // Reset state หลัง navigate
    setTimeout(() => {
      setIsNavigating(false);
    }, 500);
  }, [router]);

  const back = useCallback(async (delay: number = 150) => {
    setIsNavigating(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    router.back();
    setTimeout(() => setIsNavigating(false), 500);
  }, [router]);

  return {
    navigate,
    back,
    isNavigating,
    router
  };
}

/**
 * ตัวอย่างการใช้งาน:
 * 
 * const { navigate, isNavigating } = useSmoothNavigation();
 * 
 * <button 
 *   onClick={() => navigate('/room')}
 *   disabled={isNavigating}
 *   className={isNavigating ? 'opacity-50' : ''}
 * >
 *   {isNavigating ? 'กำลังโหลด...' : 'เข้าห้อง'}
 * </button>
 */

export default useSmoothNavigation;