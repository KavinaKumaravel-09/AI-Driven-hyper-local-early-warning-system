import { useEffect, useState } from 'react';
import { getOfflineSimulationMode, setOfflineSimulationMode } from '../utils/offlineStorage';

export function useOnlineStatus() {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    return getOfflineSimulationMode();
  });

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      setOfflineSimulationMode(next);
      return next;
    });
  };

  const isEffectiveOnline = isBrowserOnline && !isSimulatedOffline;

  return {
    isOnline: isEffectiveOnline,
    isBrowserOnline,
    isSimulatedOffline,
    toggleSimulatedOffline
  };
}
