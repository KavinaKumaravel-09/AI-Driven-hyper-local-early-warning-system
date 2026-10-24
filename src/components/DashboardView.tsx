import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  BrainCircuit,
  BellRing,
  Award,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Cloud,
  Gauge,
  ArrowRight,
  TrendingUp,
  Clock,
  Shield,
  Filter,
  Eye,
  ChevronRight,
  Radio
} from 'lucide-react';
import { LocationWeather, WeatherAlert, SupportedLanguage } from '../types/weather';
import { getRiskBadgeClasses } from '../utils/weatherUtils';
import { TabKey } from './Sidebar';
import { SUPPORTED_LANGUAGES, getAlertContent, RISK_TRANSLATIONS } from '../utils/translations';
import { Volume2, Square, Globe } from 'lucide-react';

interface DashboardViewProps {
  locations: LocationWeather[];
  alerts: WeatherAlert[];
  onNavigateTab: (tab: TabKey, contextId?: string) => void;
  onOpenAlertDetails: (alert: WeatherAlert) => void;
  onOpenBroadcastModal: () => void;
  selectedLanguage: SupportedLanguage;
  onPlayVoiceAlert: (alert: WeatherAlert) => void;
  playingAlertId: string | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  locations,
  alerts,
  onNavigateTab,
  onOpenAlertDetails,
  onOpenBroadcastModal,
  selectedLanguage,
  onPlayVoiceAlert,
  playingAlertId
}) => {
  // Default selected location is Coimbatore as requested in the prompt
  const [selectedLocationId, setSelectedLocationId] = useState<string>('cbe');
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'CRITICAL' | 'ACTIVE'>('ALL');

  const selectedLocation =
    locations.find((loc) => loc.id === selectedLocationId) || locations[0];

  // Stats numbers from prompt
  const areasMonitored = 128;
  const activeHighRiskZones = 7;
  const predictionsGenerated = 342;
  const alertsIssued = alerts.length > 0 ? alerts.length : 18;
  const modelAccuracy = '92.4%';

  // Filtered alerts
  const filteredAlerts = alerts.filter((a) => {
    if (alertFilter === 'CRITICAL') return a.risk === 'HIGH' || a.risk === 'VERY_HIGH';
    if (alertFilter === 'ACTIVE') return a.status === 'Active';
    return true;
  });

  const coimbatoreRiskBadge = getRiskBadgeClasses(selectedLocation.risk);

  return (
    <div className="space-y-6 pb-12">
      {/* ----------------------------------------------------
          1. TOP STATISTICS CARDS (5 Cards)
          ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Areas Monitored */}
        <div className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Areas Monitored
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {areasMonitored}
            </span>
            <span className="text-xs text-slate-500 font-medium">Districts & Taluks</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% telemetry online</span>
          </div>
        </div>

        {/* 2. Active High-Risk Zones */}
        <div className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active High-Risk Zones
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600 tracking-tight font-mono">
              {activeHighRiskZones}
            </span>
            <span className="text-xs text-rose-700/80 font-medium">Critical Action</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
            <span>5 Very High • 2 High</span>
          </div>
        </div>

        {/* 3. Predictions Generated */}
        <div className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Predictions Generated
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {predictionsGenerated}
            </span>
            <span className="text-xs text-slate-500 font-medium">Today</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-600 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Next cycle in 4 mins</span>
          </div>
        </div>

        {/* 4. Alerts Issued */}
        <div className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alerts Issued
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {alertsIssued}
            </span>
            <span className="text-xs text-slate-500 font-medium">CAP Bulletins</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-orange-600 font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>4 broadcasts dispatched</span>
          </div>
        </div>

        {/* 5. Model Accuracy */}
        <div className="bg-white rounded-xl p-4.5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Model Accuracy
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 tracking-tight font-mono">
              {modelAccuracy}
            </span>
            <span className="text-xs text-slate-500 font-medium">Validated</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <span>CSI Index 0.81</span>
            <span className="text-slate-300">•</span>
            <span>FAR 8.7%</span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. AI PREDICTION PANEL & CURRENT WEATHER OVERVIEW
          ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Severe Weather Prediction (Main Featured Panel - 7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#122345] text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle decorative background radar circles */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full border border-blue-500/10 pointer-events-none translate-x-24 -translate-y-24" />
          <div className="absolute right-0 top-0 w-56 h-56 rounded-full border border-blue-500/15 pointer-events-none translate-x-12 -translate-y-12" />

          <div>
            {/* Header with District Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-600/30 border border-blue-400/30 text-blue-300">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    AI Severe Weather Prediction
                  </h2>
                  <p className="text-xs text-slate-400">
                    Lead-time nowcasting window: 2 to 6 hours ahead
                  </p>
                </div>
              </div>

              {/* District Dropdown Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Focus:</span>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="bg-slate-800/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-hidden focus:ring-1 focus:ring-blue-400 cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.risk.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Prediction Details */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-7">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold mb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>PREDICTION: {selectedLocation.weatherEvent.toUpperCase()}</span>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {selectedLocation.weatherEvent === 'Heavy Rainfall'
                    ? 'Heavy Rainfall Likely'
                    : selectedLocation.weatherEvent}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-400">Affected Region: </span>
                    <span className="text-white font-bold">{selectedLocation.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected: </span>
                    <span className="text-amber-300 font-semibold">{selectedLocation.expectedTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Risk Level: </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-sm ${
                        selectedLocation.risk === 'VERY_HIGH'
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                          : selectedLocation.risk === 'HIGH'
                          ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                          : selectedLocation.risk === 'MODERATE'
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      }`}
                    >
                      {selectedLocation.risk.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Probability Radial / Big Metric */}
              <div className="sm:col-span-5 flex flex-col items-center sm:items-end justify-center">
                <div className="relative flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 w-full sm:w-auto min-w-[170px]">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Model Probability
                  </span>
                  <div className="text-4xl font-black text-blue-400 font-mono my-1">
                    {selectedLocation.probability}%
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${selectedLocation.probability}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    Confidence: High ({selectedLocation.probability > 80 ? '94%' : '82%'} ensemble agreement)
                  </span>
                </div>
              </div>
            </div>

            {/* Actionable guidance preview */}
            <div className="mt-5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">Emergency Protocol: </span>
              {selectedLocation.recommendedAction}
            </div>
          </div>

          {/* Model Explanation Footnote & CTA buttons */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Prediction generated from rainfall, radar, satellite, humidity and wind patterns.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Voice Alert CTA */}
              <button
                onClick={() => {
                  const matchingAlert: WeatherAlert = alerts.find(
                    (a) => a.location.toLowerCase().includes(selectedLocation.name.toLowerCase())
                  ) || {
                    id: `ALT-NOW-${selectedLocation.id}`,
                    location: selectedLocation.name,
                    district: selectedLocation.district,
                    weatherEvent: selectedLocation.weatherEvent,
                    risk: selectedLocation.risk,
                    expectedTime: selectedLocation.expectedTime,
                    leadTime: `Within ${selectedLocation.leadTimeHours} hours`,
                    status: 'Active',
                    probability: selectedLocation.probability,
                    affectedPopulation: selectedLocation.populationExposed,
                    issuedAt: 'Nowcast',
                    expiresAt: 'In 3 hours',
                    issuedBy: 'TNSDMA ConvLSTM Early Warning',
                    channels: ['Cell Broadcast', 'Disaster Siren', 'SMS'],
                    instruction: selectedLocation.recommendedAction
                  };
                  onPlayVoiceAlert(matchingAlert);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  playingAlertId && (playingAlertId.includes(selectedLocation.id) || playingAlertId === 'ALT-1024')
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40'
                }`}
                title="Listen to spoken voice warning"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Voice Alert</span>
              </button>

              <button
                onClick={() => onNavigateTab('map', selectedLocation.id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View on GIS Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('ai-predictions')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                2–6h Timeline
              </button>
            </div>
          </div>
        </div>

        {/* CURRENT WEATHER OVERVIEW (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Current Weather Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Station: {selectedLocation.name} Met-Tower ({selectedLocation.lat.toFixed(2)}°N, {selectedLocation.lng.toFixed(2)}°E)
                </p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${coimbatoreRiskBadge.bg} ${coimbatoreRiskBadge.text} ${coimbatoreRiskBadge.border}`}>
                {coimbatoreRiskBadge.label}
              </span>
            </div>

            {/* 6 Weather Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {/* Temperature */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Temperature</span>
                  <Thermometer className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {selectedLocation.temperatureC}°C
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Dew point 24°C</div>
              </div>

              {/* Humidity */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Humidity</span>
                  <Droplets className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {selectedLocation.humidityPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Vapor saturated</div>
              </div>

              {/* Rainfall */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center justify-between text-blue-800 mb-1">
                  <span className="text-xs font-medium">Rainfall</span>
                  <CloudRain className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-blue-900 font-mono">
                  {selectedLocation.rainfallMmHr} <span className="text-xs font-normal">mm/hr</span>
                </div>
                <div className="text-[10px] text-blue-700 mt-0.5">24h: {selectedLocation.accumulated24hMm} mm</div>
              </div>

              {/* Wind Speed */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Wind Speed</span>
                  <Wind className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {selectedLocation.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Heading: {selectedLocation.windDirection}</div>
              </div>

              {/* Cloud Cover */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Cloud Cover</span>
                  <Cloud className="w-4 h-4 text-slate-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {selectedLocation.cloudCoverPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cumulonimbus cell</div>
              </div>

              {/* Atmospheric Pressure */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Atmospheric Pressure</span>
                  <Gauge className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {selectedLocation.pressureHpa} <span className="text-xs font-normal">hPa</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Rapid drop (-3 hPa/h)</div>
              </div>
            </div>
          </div>

          {/* Bottom Sensor Telemetry Status */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{selectedLocation.activeSensors} Micro-sensors transmitting</span>
            </div>
            <button
              onClick={() => onNavigateTab('weather-data')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Telemetry Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          3. RISK SUMMARY (4 Cards)
          ---------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Current Risk Categorization (128 Monitored Areas)
          </h3>
          <span className="text-xs text-slate-500">Standard NDMA Risk Matrix</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Low Risk */}
          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-800">Low Risk</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50">
                Normal
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
              78 <span className="text-xs font-normal text-slate-500">areas</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rainfall &lt; 15 mm/hr • Stable conditions
            </p>
          </div>

          {/* Moderate Risk */}
          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-800">Moderate Risk</span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 px-2 py-0.5 rounded-full bg-amber-50">
                Watch
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
              31 <span className="text-xs font-normal text-slate-500">areas</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rainfall 15–35 mm/hr • Thunderstorm alert
            </p>
          </div>

          {/* High Risk */}
          <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs font-bold text-orange-800">High Risk</span>
              </div>
              <span className="text-[11px] font-semibold text-orange-700 px-2 py-0.5 rounded-full bg-orange-50">
                Warning
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-orange-700 font-mono">
              14 <span className="text-xs font-normal text-slate-500">areas</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rainfall 35–64 mm/hr • Waterlogging danger
            </p>
          </div>

          {/* Very High Risk */}
          <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
                <span className="text-xs font-bold text-rose-800">Very High Risk</span>
              </div>
              <span className="text-[11px] font-semibold text-rose-700 px-2 py-0.5 rounded-full bg-rose-50 animate-pulse">
                Emergency
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-600 font-mono">
              5 <span className="text-xs font-normal text-slate-500">areas</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Rainfall &gt; 65 mm/hr • Flash flood & landslide
            </p>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          4. RECENT ALERTS (Table & Action Center)
          ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Early Warning Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                {alerts.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated CAP warning bulletins generated by AI nowcasting mesh
            </p>
          </div>

          {/* Filters and actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setAlertFilter('ALL')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  alertFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setAlertFilter('CRITICAL')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  alertFilter === 'CRITICAL'
                    ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical / High
              </button>
              <button
                onClick={() => setAlertFilter('ACTIVE')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  alertFilter === 'ACTIVE'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Only
              </button>
            </div>

            <button
              onClick={() => onNavigateTab('alerts')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Weather Event</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Expected Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.slice(0, 6).map((alert) => {
                const riskMeta = getRiskBadgeClasses(alert.risk);
                return (
                  <tr
                    key={alert.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => onOpenAlertDetails(alert)}
                  >
                    {/* Alert ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {alert.id}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{alert.location}</div>
                      <div className="text-[10px] text-slate-500">{alert.district}</div>
                    </td>

                    {/* Weather Event */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{alert.weatherEvent}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Prob: {alert.probability}%
                      </span>
                    </td>

                    {/* Risk */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${riskMeta.bg} ${riskMeta.text} ${riskMeta.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${riskMeta.dot}`} />
                        {alert.risk.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Expected Time */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{alert.expectedTime}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{alert.leadTime}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                          alert.status === 'Active'
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : alert.status === 'Monitoring'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayVoiceAlert(alert);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            playingAlertId === alert.id
                              ? 'bg-rose-100 text-rose-700 animate-pulse'
                              : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title="Listen to spoken voice warning"
                        >
                          <Volume2 className={`w-4 h-4 ${playingAlertId === alert.id ? 'animate-bounce text-rose-600' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAlertDetails(alert);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View alert dispatch details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Integrated with NDMA Common Alerting Protocol (CAP) and State Disaster Control Room</span>
          </div>
          <button
            onClick={onOpenBroadcastModal}
            className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Simulate Warning Broadcast Drill</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
