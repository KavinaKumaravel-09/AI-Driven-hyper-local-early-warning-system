import { LocationWeather, WeatherAlert, SupportedLanguage } from '../types/weather';
import { LOCATIONS_DATA, RECENT_ALERTS } from '../data/mockWeatherData';

const STORAGE_KEYS = {
  ALERTS: 'weatherguard_cached_alerts_v1',
  LOCATIONS: 'weatherguard_cached_locations_v1',
  OFFLINE_QUEUE: 'weatherguard_offline_queue_v1',
  SELECTED_LANG: 'weatherguard_lang_v1',
  LAST_SYNC: 'weatherguard_last_sync_v1',
  OFFLINE_SIM: 'weatherguard_offline_simulation_mode'
};

export interface OfflineCacheStatus {
  isCached: boolean;
  itemCount: number;
  lastSynced: string;
  queuedBroadcastCount: number;
  storageEstimateKb: number;
}

/**
 * Loads cached alerts from localStorage, fallback to initial mock alerts
 */
export function loadCachedAlerts(): WeatherAlert[] {
  if (typeof window === 'undefined') return RECENT_ALERTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return RECENT_ALERTS;
}

/**
 * Saves alerts to local storage cache
 */
export function saveCachedAlerts(alerts: WeatherAlert[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch {
    // quota exceeded or private mode
  }
}

/**
 * Loads cached locations
 */
export function loadCachedLocations(): LocationWeather[] {
  if (typeof window === 'undefined') return LOCATIONS_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return LOCATIONS_DATA;
}

/**
 * Saves locations to local storage cache
 */
export function saveCachedLocations(locations: LocationWeather[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  } catch {
    // ignore
  }
}

/**
 * Add an emergency alert to the offline dispatch queue (e.g. when field network drops)
 */
export function queueOfflineBroadcast(alert: WeatherAlert): void {
  if (typeof window === 'undefined') return;
  try {
    const queue = getOfflineQueue();
    const queuedAlert = { ...alert, isOfflineQueued: true };
    queue.push(queuedAlert);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch {
    // ignore
  }
}

/**
 * Gets offline queued broadcasts
 */
export function getOfflineQueue(): WeatherAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Clears the offline dispatch queue and returns the synced items
 */
export function flushOfflineQueue(): WeatherAlert[] {
  const queued = getOfflineQueue();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  }
  return queued;
}

/**
 * Load saved language
 */
export function loadSavedLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const lang = localStorage.getItem(STORAGE_KEYS.SELECTED_LANG) as SupportedLanguage;
    if (lang && ['en', 'ta', 'hi', 'ml', 'te'].includes(lang)) {
      return lang;
    }
  } catch {
    // ignore
  }
  return 'en';
}

/**
 * Save user language choice
 */
export function saveSavedLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANG, lang);
  } catch {
    // ignore
  }
}

/**
 * Gets or sets the field offline simulation mode
 */
export function getOfflineSimulationMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.OFFLINE_SIM) === 'true';
}

export function setOfflineSimulationMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.OFFLINE_SIM, enabled ? 'true' : 'false');
}

/**
 * Get offline storage status summary
 */
export function getOfflineStatusSummary(): OfflineCacheStatus {
  if (typeof window === 'undefined') {
    return {
      isCached: true,
      itemCount: 128,
      lastSynced: 'Just now',
      queuedBroadcastCount: 0,
      storageEstimateKb: 480
    };
  }

  const queued = getOfflineQueue().length;
  const lastSyncRaw = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  const lastSynced = lastSyncRaw
    ? new Date(lastSyncRaw).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : 'Local Cache Preloaded';

  return {
    isCached: true,
    itemCount: 128,
    lastSynced,
    queuedBroadcastCount: queued,
    storageEstimateKb: 640
  };
}
