import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const canSynchronize = isOnline && isAuthenticated;
  
  return {
    isOnline,
    canSynchronize
  };
}

export default useNetworkStatus; 