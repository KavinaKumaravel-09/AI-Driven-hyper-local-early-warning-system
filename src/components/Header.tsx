import React, { useEffect, useState } from 'react';
import {
  Menu,
  RefreshCw,
  Radio,
  Shield,
  Bell,
  Globe,
  Volume2,
  Wifi,
  WifiOff,
  ChevronDown
} from 'lucide-react';
import { TabKey } from './Sidebar';
import { SupportedLanguage } from '../types/weather';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: TabKey;
  onOpenMobileMenu: () => void;
  onRefreshData?: () => void;
  onOpenBroadcastModal?: () => void;
  activeAlertCount: number;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  onOpenVoiceTestModal: () => void;
  isVoicePlaying?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onRefreshData,
  onOpenBroadcastModal,
  activeAlertCount,
  selectedLanguage,
  onSelectLanguage,
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  onOpenVoiceTestModal,
  isVoicePlaying = false
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdatedText, setLastUpdatedText] = useState<string>('Just now');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdatedText('Refreshing feeds...');
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedText('Just now');
      if (onRefreshData) onRefreshData();
    }, 700);
  };

  const getPageMeta = (tab: TabKey) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: 'Severe Weather Intelligence Dashboard',
          subtitle: 'AI-powered hyper-local monitoring and early warning'
        };
      case 'map':
        return {
          title: 'Hyper-Local Risk Map',
          subtitle: 'Real-time AI-predicted severe weather risk by location'
        };
      case 'weather-data':
        return {
          title: 'Multi-Source Weather Data',
          subtitle: 'Real-time telemetry from AWS, Doppler Radar, INSAT-3D, and IoT sensor meshes'
        };
      case 'ai-predictions':
        return {
          title: 'Hyper-Local 2–6 Hour AI Nowcasting Engine',
          subtitle: 'Deep ConvLSTM, radar extrapolations, and probabilistic convective cell tracking'
        };
      case 'alerts':
        return {
          title: 'Disaster Warning & Alert Center',
          subtitle: 'Multilingual CAP bulletins, voice alerts, and multi-channel emergency broadcast'
        };
      case 'risk-analysis':
        return {
          title: 'GIS Multi-Hazard Risk Analysis',
          subtitle: 'Topographical vulnerabilities, flood depth simulations, and demographic exposure'
        };
      case 'model-performance':
        return {
          title: 'AI Model Verification & Metrics',
          subtitle: 'Real-time accuracy benchmarking, Critical Success Index (CSI), and false-alarm metrics'
        };
      case 'about':
        return {
          title: 'About WeatherGuard AI System',
          subtitle: 'Smart India Hackathon operational early warning prototype architecture'
        };
    }
  };

  const meta = getPageMeta(currentTab);
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Mobile hamburger + Titles */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {meta.title}
              </h1>
              {/* Region Pill */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <Shield className="w-3 h-3 text-blue-600" />
                TN-SEOC Node
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions, Language, Offline Toggle, Voice Alert & Broadcast */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Online / Offline Simulator Toggle */}
          <button
            onClick={onToggleSimulatedOffline}
            title={isOnline ? 'Switch to Offline Disaster Mode' : 'Restore Online Network Mode'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span>Offline Mode</span>
              </>
            )}
          </button>

          {/* Multilingual Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white text-slate-800 text-xs font-semibold transition cursor-pointer"
              title="Select Alert & Broadcast Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentLangObj?.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Alert Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${
                        selectedLanguage === lang.code ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.nativeName} ({lang.label})</span>
                      <span className="text-xs">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Voice Alert Testing Studio Button */}
          <button
            onClick={onOpenVoiceTestModal}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
              isVoicePlaying
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
            }`}
            title="Open Voice Alert & Siren Audio Studio"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isVoicePlaying ? 'text-rose-600 animate-bounce' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">Voice & Sirens</span>
          </button>

          {/* In-app PWA Install Button */}
          <PWAInstallButton />

          {/* Quick Refresh */}
          <button
            onClick={handleRefresh}
            title="Refresh weather feeds"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 hover:border-blue-200 transition-colors focus:outline-hidden"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Dispatch Warning Broadcast Button */}
          {onOpenBroadcastModal && (
            <button
              onClick={onOpenBroadcastModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Issue Warning</span>
              {activeAlertCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-rose-800 text-[10px] font-bold">
                  {activeAlertCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
