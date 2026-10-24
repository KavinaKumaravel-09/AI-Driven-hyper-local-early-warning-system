import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
  AlertTriangle,
  Volume2,
  CheckCircle2,
  Smartphone,
  ShieldAlert,
  Globe,
  WifiOff,
  Square
} from 'lucide-react';
import { LocationWeather, RiskLevel, SupportedLanguage, WeatherAlert } from '../types/weather';
import { SUPPORTED_LANGUAGES } from '../utils/translations';
import { playAttentionChime, speakAlertText, stopAudioAlert } from '../utils/audioAlert';

interface BroadcastModalProps {
  locations: LocationWeather[];
  isOpen: boolean;
  onClose: () => void;
  onBroadcastSubmitted: (newAlert: WeatherAlert) => void;
  selectedLanguage: SupportedLanguage;
  isOnline: boolean;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  locations,
  isOpen,
  onClose,
  onBroadcastSubmitted,
  selectedLanguage,
  isOnline
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('cbe');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('HIGH');
  const [weatherEvent, setWeatherEvent] = useState<string>('Heavy Rainfall & Cloudburst');
  const [expectedTime, setExpectedTime] = useState<string>('Within 1.5 hours');
  const [instruction, setInstruction] = useState<string>(
    'Prepare emergency resources and monitor low-lying areas. Move residents near river basins to designated flood shelters immediately.'
  );
  const [broadcastLanguage, setBroadcastLanguage] = useState<SupportedLanguage>(selectedLanguage);
  const [channels, setChannels] = useState<{
    cell: boolean;
    sms: boolean;
    siren: boolean;
    police: boolean;
    voiceBroadcast: boolean;
  }>({
    cell: true,
    sms: true,
    siren: true,
    police: false,
    voiceBroadcast: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePreviewVoice = async () => {
    stopAudioAlert();
    setIsPreviewingVoice(true);
    await playAttentionChime();

    const targetLoc = locations.find((l) => l.id === selectedLocationId) || locations[0];
    const previewSpeech = `Emergency Warning for ${targetLoc.name}. ${riskLevel} alert. ${weatherEvent}. Expected: ${expectedTime}. Guidance: ${instruction}`;

    speakAlertText(
      previewSpeech,
      broadcastLanguage,
      0.95,
      () => setIsPreviewingVoice(true),
      () => setIsPreviewingVoice(false)
    );
  };

  const handleStopPreview = () => {
    stopAudioAlert();
    setIsPreviewingVoice(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    stopAudioAlert();

    const targetLoc = locations.find((l) => l.id === selectedLocationId) || locations[0];

    const activeChannels: ('Cell Broadcast' | 'SMS' | 'Disaster Siren' | 'Police Patrols')[] = [];
    if (channels.cell) activeChannels.push('Cell Broadcast');
    if (channels.sms) activeChannels.push('SMS');
    if (channels.siren) activeChannels.push('Disaster Siren');
    if (channels.police) activeChannels.push('Police Patrols');

    const newAlert: WeatherAlert = {
      id: `ALT-${Math.floor(1025 + Math.random() * 50)}`,
      location: targetLoc.name,
      district: targetLoc.district,
      weatherEvent: weatherEvent as any,
      risk: riskLevel,
      expectedTime,
      leadTime: 'Within 2 hours',
      status: 'Active',
      probability: 88,
      affectedPopulation: targetLoc.populationExposed,
      issuedAt: 'Just now',
      expiresAt: 'In 3 hours',
      issuedBy: 'TNSDMA Hyper-Local Emergency Dispatch',
      channels: activeChannels,
      instruction,
      isOfflineQueued: !isOnline,
      translations: {
        [broadcastLanguage]: {
          weatherEvent,
          instruction,
          expectedTime,
          leadTime: 'Within 2 hours',
          speechText: `Emergency Warning for ${targetLoc.name}. ${weatherEvent}. ${instruction}`
        }
      }
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      onBroadcastSubmitted(newAlert);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1400);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-rose-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 animate-bounce" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Emergency Warning Broadcast Dispatch
                </h3>
                {!isOnline && (
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-900 text-[10px] font-bold flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    Offline Queue
                  </span>
                )}
              </div>
              <p className="text-[11px] text-rose-100">
                Common Alerting Protocol (CAP) Multi-lingual & Audio Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAudioAlert();
              onClose();
            }}
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {success ? (
            <div className="py-10 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-slate-900">
                {isOnline
                  ? 'Emergency Warning Broadcast Dispatched!'
                  : 'Broadcast Saved to Offline Dispatch Queue!'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {isOnline
                  ? 'Transmitted across Cell Broadcast towers, localized SMS, siren networks, and TTS voice channels.'
                  : 'Cached securely in local storage. Will sync to SEOC network upon online reconnection.'}
              </p>
            </div>
          ) : (
            <>
              {/* Target Location */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target District / Location
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.district}) — Current Risk: {loc.risk}
                    </option>
                  ))}
                </select>
              </div>

              {/* Broadcast Language & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Language
                  </label>
                  <select
                    value={broadcastLanguage}
                    onChange={(e) => setBroadcastLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.nativeName} ({lang.label})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Risk Severity
                  </label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden"
                  >
                    <option value="VERY_HIGH">Very High (Red Alert)</option>
                    <option value="HIGH">High (Orange Alert)</option>
                    <option value="MODERATE">Moderate (Yellow Watch)</option>
                    <option value="LOW">Low (Green Advisory)</option>
                  </select>
                </div>
              </div>

              {/* Weather Event & Expected Arrival */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Weather Event Title
                  </label>
                  <input
                    type="text"
                    value={weatherEvent}
                    onChange={(e) => setWeatherEvent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Expected Arrival
                  </label>
                  <input
                    type="text"
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Action Directive */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Public Action Guidance / Instructions
                </label>
                <textarea
                  rows={3}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Audio Voice Alert Preview Button */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-semibold text-slate-700">Voice Alert Test Preview</span>
                </div>
                {isPreviewingVoice ? (
                  <button
                    type="button"
                    onClick={handleStopPreview}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePreviewVoice}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Test Voice Speech</span>
                  </button>
                )}
              </div>

              {/* Channels */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Dissemination Channels
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.cell}
                      onChange={(e) => setChannels({ ...channels, cell: e.target.checked })}
                      className="rounded text-rose-600"
                    />
                    <span>Cell Broadcast Towers</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.siren}
                      onChange={(e) => setChannels({ ...channels, siren: e.target.checked })}
                      className="rounded text-rose-600"
                    />
                    <span>Civil Defense Sirens</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                      className="rounded text-rose-600"
                    />
                    <span>Localized SMS Blast</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.voiceBroadcast}
                      onChange={(e) => setChannels({ ...channels, voiceBroadcast: e.target.checked })}
                      className="rounded text-rose-600"
                    />
                    <span>Voice Alert Audio</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    stopAudioAlert();
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? 'Transmitting Broadcast...'
                      : isOnline
                      ? 'Authorize & Broadcast'
                      : 'Save to Offline Queue'}
                  </span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
