import React, { useState } from 'react';
import {
  X,
  Shield,
  Clock,
  MapPin,
  AlertTriangle,
  Users,
  Radio,
  FileText,
  Volume2,
  Square,
  CheckCircle2,
  Globe,
  BellRing
} from 'lucide-react';
import { SupportedLanguage, WeatherAlert } from '../types/weather';
import { getRiskBadgeClasses, formatNumber } from '../utils/weatherUtils';
import { SUPPORTED_LANGUAGES, getAlertContent, RISK_TRANSLATIONS } from '../utils/translations';
import { playAttentionChime, speakAlertText, stopAudioAlert } from '../utils/audioAlert';

interface AlertDetailModalProps {
  alert: WeatherAlert | null;
  onClose: () => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  selectedLanguage,
  onLanguageChange
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  if (!alert) return null;

  const riskInfo = getRiskBadgeClasses(alert.risk);
  const localizedContent = getAlertContent(alert, selectedLanguage);
  const localizedRisk = RISK_TRANSLATIONS[alert.risk]?.[selectedLanguage] || alert.risk;

  const handlePlayVoice = async () => {
    stopAudioAlert();
    setIsPlayingVoice(true);

    // Play 2-tone attention chime first
    await playAttentionChime();

    speakAlertText(
      localizedContent.speechText,
      selectedLanguage,
      0.95,
      () => setIsPlayingVoice(true),
      () => setIsPlayingVoice(false)
    );
  };

  const handleStopVoice = () => {
    stopAudioAlert();
    setIsPlayingVoice(false);
  };

  const handleClose = () => {
    handleStopVoice();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-blue-600 px-2 py-0.5 rounded">
              {alert.id}
            </span>
            <span className="text-sm font-bold tracking-tight">
              CAP Multilingual Warning Bulletin
            </span>
            {alert.isOfflineQueued && (
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-bold">
                Offline Queued
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs Row */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 shrink-0" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            Language:
          </span>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedLanguage === lang.code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
              }`}
            >
              <span className="mr-1">{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Top Title & Risk */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">Weather Event</span>
              <h3 className="text-xl font-bold text-slate-900">{localizedContent.weatherEvent}</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Target: <strong>{alert.location}</strong> ({alert.district})
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}
            >
              <span className={`w-2 h-2 rounded-full ${riskInfo.dot}`} />
              {localizedRisk}
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-500">Expected Arrival:</span>
              <div className="font-bold text-slate-900 mt-0.5 font-mono">{localizedContent.expectedTime}</div>
            </div>
            <div>
              <span className="text-slate-500">Advance Lead Time:</span>
              <div className="font-bold text-blue-700 mt-0.5">{alert.leadTime}</div>
            </div>
            <div>
              <span className="text-slate-500">Population at Risk:</span>
              <div className="font-bold text-slate-900 mt-0.5 font-mono">{formatNumber(alert.affectedPopulation)}</div>
            </div>
            <div>
              <span className="text-slate-500">Issued Authority:</span>
              <div className="font-bold text-slate-900 mt-0.5 truncate">{alert.issuedBy}</div>
            </div>
          </div>

          {/* Action Directive */}
          <div>
            <span className="text-xs font-bold text-slate-900 block mb-1">
              Action Directive / Evacuation Advisory:
            </span>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
              {localizedContent.instruction}
            </div>
          </div>

          {/* Voice Alert Player Card */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <Volume2 className={`w-4 h-4 ${isPlayingVoice ? 'animate-bounce' : ''}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-950 block">
                  Audible Voice Alert ({SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.label})
                </span>
                <span className="text-[11px] text-blue-700">
                  Plays CAP chime followed by speech synthesis
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPlayingVoice ? (
                <button
                  onClick={handleStopVoice}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Audio</span>
                </button>
              ) : (
                <button
                  onClick={handlePlayVoice}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Play Voice Alert</span>
                </button>
              )}
            </div>
          </div>

          {/* Dissemination Channels */}
          <div>
            <span className="text-xs font-bold text-slate-900 block mb-1.5">
              Active Dissemination Channels:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {alert.channels.map((ch, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1"
                >
                  <Radio className="w-3 h-3 text-blue-600" />
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Multi-channel CAP broadcast active</span>
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
          >
            Close Bulletin
          </button>
        </div>
      </div>
    </div>
  );
};
