import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  Radio,
  Clock,
  Shield,
  Volume2,
  Square,
  Send,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Eye,
  Megaphone,
  Globe,
  WifiOff
} from 'lucide-react';
import { SupportedLanguage, WeatherAlert } from '../types/weather';
import { getRiskBadgeClasses, formatNumber } from '../utils/weatherUtils';
import { SUPPORTED_LANGUAGES, getAlertContent, RISK_TRANSLATIONS } from '../utils/translations';
import { playAttentionChime, speakAlertText, stopAudioAlert } from '../utils/audioAlert';

interface AlertsViewProps {
  alerts: WeatherAlert[];
  onOpenAlertDetails: (alert: WeatherAlert) => void;
  onOpenBroadcastModal: () => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onPlayVoiceAlert: (alert: WeatherAlert) => void;
  playingAlertId: string | null;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onOpenAlertDetails,
  onOpenBroadcastModal,
  selectedLanguage,
  onSelectLanguage,
  onPlayVoiceAlert,
  playingAlertId
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== 'ALL' && alert.risk !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && alert.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const content = getAlertContent(alert, selectedLanguage);
      return (
        alert.id.toLowerCase().includes(q) ||
        alert.location.toLowerCase().includes(q) ||
        alert.district.toLowerCase().includes(q) ||
        alert.weatherEvent.toLowerCase().includes(q) ||
        content.weatherEvent.toLowerCase().includes(q) ||
        content.instruction.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Quick Actions and Language Picker */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Early Warning & Emergency Dispatch Center
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
              {alerts.filter((a) => a.status === 'Active').length} Active Emergency Warnings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Common Alerting Protocol (CAP) compliant multilingual & voice dissemination pipeline
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Language selector pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={`Switch display to ${lang.label}`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenBroadcastModal}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
          >
            <Megaphone className="w-4 h-4 animate-bounce" />
            <span>Issue Emergency Broadcast</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Location, or Warning Text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Severity filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Severities</option>
              <option value="VERY_HIGH">Very High (Red Alert)</option>
              <option value="HIGH">High (Orange Alert)</option>
              <option value="MODERATE">Moderate (Yellow)</option>
              <option value="LOW">Low (Green)</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => {
          const riskInfo = getRiskBadgeClasses(alert.risk);
          const content = getAlertContent(alert, selectedLanguage);
          const localizedRisk = RISK_TRANSLATIONS[alert.risk]?.[selectedLanguage] || alert.risk;
          const isPlayingThis = playingAlertId === alert.id;

          return (
            <div
              key={alert.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: ID, Risk Badge, Status */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {alert.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Issued {alert.issuedAt}
                    </span>
                    {alert.isOfflineQueued && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                        <WifiOff className="w-2.5 h-2.5" />
                        Offline Queued
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${riskInfo.dot}`} />
                      {localizedRisk}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        alert.status === 'Active'
                          ? 'bg-rose-100 text-rose-800'
                          : alert.status === 'Monitoring'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Main Event & Location */}
                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {content.weatherEvent}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Target Area: <span className="font-bold text-slate-900">{alert.location}</span> ({alert.district})
                  </p>
                </div>

                {/* Instruction in active language */}
                <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {content.instruction}
                </p>
              </div>

              {/* Bottom Meta, Voice Alert Button & Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pop. At Risk: <strong className="text-slate-800 font-mono">{formatNumber(alert.affectedPopulation)}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Arrival: <strong className="text-slate-800">{content.expectedTime}</strong></span>
                  </div>
                </div>

                {/* Voice Alert and View Bulletin Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onPlayVoiceAlert(alert)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                      isPlayingThis
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingThis ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingThis ? 'Stop Audio' : 'Play Voice Alert'}</span>
                  </button>

                  <button
                    onClick={() => onOpenAlertDetails(alert)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition"
                  >
                    View Bulletin
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
