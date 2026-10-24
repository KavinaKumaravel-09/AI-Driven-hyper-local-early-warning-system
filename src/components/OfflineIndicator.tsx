import React, { useState } from 'react';
import {
  WifiOff,
  Wifi,
  Database,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { OfflineCacheStatus } from '../utils/offlineStorage';

interface OfflineIndicatorProps {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
  cacheStatus: OfflineCacheStatus;
  onSyncOfflineQueue: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  isSimulatedOffline,
  onToggleSimulateOffline,
  cacheStatus,
  onSyncOfflineQueue
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncOfflineQueue();
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2000);
    }, 600);
  };

  return (
    <div className="w-full">
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600 shadow-xs transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-600/30">
                <WifiOff className="w-4 h-4 text-slate-900 animate-pulse" />
              </span>
              <div>
                <span className="font-bold">
                  {isSimulatedOffline ? 'Field Offline Disaster Mode Active' : 'Offline Mode — Network Disconnected'}
                </span>
                <span className="hidden md:inline text-amber-950 ml-2">
                  Operating with local cached telemetry, radar grids, and GIS risk vectors.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {cacheStatus.queuedBroadcastCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-700 text-white font-bold text-[10px] animate-pulse">
                  {cacheStatus.queuedBroadcastCount} Broadcasts Queued Offline
                </span>
              )}

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-amber-950 font-medium">
                <HardDrive className="w-3 h-3" />
                {cacheStatus.itemCount} stations cached
              </span>

              {isSimulatedOffline && (
                <button
                  onClick={onToggleSimulateOffline}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-900 font-bold text-[11px] shadow-xs cursor-pointer transition"
                >
                  Return to Online Feed
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sync Success notification */}
      {syncSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Offline queue successfully synchronized with SEOC State Dispatch network!</span>
        </div>
      )}
    </div>
  );
};
