import React from 'react';
import {
  Volume2,
  VolumeX,
  Square,
  Play,
  RotateCcw,
  Radio,
  BellRing,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { SupportedLanguage, WeatherAlert } from '../types/weather';
import { SUPPORTED_LANGUAGES, getAlertContent } from '../utils/translations';

interface VoiceAlertDockProps {
  currentAlert: WeatherAlert | null;
  isPlaying: boolean;
  selectedLanguage: SupportedLanguage;
  speechRate: number;
  playSirenFirst: boolean;
  onStop: () => void;
  onReplay: () => void;
  onToggleSiren: () => void;
  onChangeRate: (rate: number) => void;
  onChangeLanguage: (lang: SupportedLanguage) => void;
  onTestSiren: () => void;
}

export const VoiceAlertDock: React.FC<VoiceAlertDockProps> = ({
  currentAlert,
  isPlaying,
  selectedLanguage,
  speechRate,
  playSirenFirst,
  onStop,
  onReplay,
  onToggleSiren,
  onChangeRate,
  onChangeLanguage,
  onTestSiren
}) => {
  if (!currentAlert && !isPlaying) return null;

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);
  const alertContent = currentAlert ? getAlertContent(currentAlert, selectedLanguage) : null;

  return (
    <aside
      aria-label="Active Voice Alert Notification and Controls"
      className="fixed bottom-4 right-4 z-40 max-w-md w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 transition-all duration-300 animate-in slide-in-from-bottom-5"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Wave / Pulse & Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2.5 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-400 mt-0.5">
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce text-rose-300' : ''}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-rose-500 text-white">
                Live Voice Alert
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-bold">
                {currentLangObj?.nativeName} ({currentLangObj?.code.toUpperCase()})
              </span>
            </div>

            <h4 className="text-xs font-bold text-slate-100 mt-1 truncate">
              {alertContent?.weatherEvent || currentAlert?.weatherEvent}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              Target: <span className="text-slate-200 font-semibold">{currentAlert?.location}</span> ({currentAlert?.district})
            </p>
          </div>
        </div>

        {/* Right: Stop button */}
        <button
          onClick={onStop}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title="Stop voice broadcast"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Audio Waveform visualization */}
      {isPlaying && (
        <div className="my-2.5 py-1 flex items-center justify-center gap-1 px-3 bg-slate-950/70 rounded-xl border border-slate-800">
          {[40, 75, 95, 60, 85, 100, 70, 90, 65, 80, 50, 95, 75, 45].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-blue-500 to-rose-400 rounded-full animate-pulse transition-all duration-150"
              style={{
                height: `${Math.max(6, (h * 0.22))}px`,
                animationDelay: `${i * 70}ms`
              }}
            />
          ))}
          <span className="ml-2 text-[10px] font-mono text-blue-300">Speaking Bulletin...</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-[11px] flex-wrap">
        <div className="flex items-center gap-1.5">
          {/* Replay */}
          <button
            onClick={onReplay}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-blue-400" />
            <span>Replay</span>
          </button>

          {/* Test Siren */}
          <button
            onClick={onTestSiren}
            className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 flex items-center gap-1 font-semibold cursor-pointer"
            title="Play civil defense emergency siren sound"
          >
            <BellRing className="w-3 h-3 text-rose-400" />
            <span>Siren</span>
          </button>
        </div>

        {/* Speed rate select */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-[10px]">Speed:</span>
          {[0.8, 1.0, 1.2].map((r) => (
            <button
              key={r}
              onClick={() => onChangeRate(r)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${
                speechRate === r
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
