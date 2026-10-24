import React, { useState } from 'react';
import {
  Database,
  Radio,
  Wifi,
  Activity,
  Server,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { DataSourceStatus, LocationWeather } from '../types/weather';
import { DATA_SOURCES } from '../data/mockWeatherData';

interface WeatherDataViewProps {
  locations: LocationWeather[];
}

export const WeatherDataView: React.FC<WeatherDataViewProps> = ({ locations }) => {
  const [dataSources] = useState<DataSourceStatus[]>(DATA_SOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('ALL');

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.weatherEvent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ----------------------------------------------------
          1. FOUR MULTI-SOURCE DATA CARDS
          ---------------------------------------------------- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Ingested In-Situ & Remote Sensing Feeds
            </h2>
            <p className="text-xs text-slate-500">
              High-frequency multi-modal data fusion pipeline for convective nowcasting
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All 4 Ingestion Pipelines Operational</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {dataSources.map((source) => {
            const isConnected = source.status === 'Connected' || source.status === 'Synchronized' || source.status.includes('Active');
            return (
              <div
                key={source.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top status line */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">
                      {source.type}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        isConnected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {source.status}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {source.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Latency: <span className="font-mono text-slate-700 font-bold">{source.pingMs} ms</span> • Sync: {source.lastSync}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {source.description}
                  </p>

                  {/* Ingested Parameters */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Ingested Streams
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {source.primaryMetrics.map((metric, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom stats summary */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Active Nodes: <span className="font-bold text-slate-900 font-mono">{source.totalStations}</span>
                  </div>
                  <div className="text-blue-700 font-semibold font-mono">
                    {source.dataPointsPerMin} pts/min
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------
          2. LIVE SURFACE TELEMETRY FEED (TABLE)
          ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Live Station Telemetry & Sensor Mesh Feed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Calibrated readings refreshed at 60-second intervals from micro-grid sensors
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search station or district..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="text-xs text-slate-500 font-mono font-semibold">
              Showing {filteredLocations.length} stations
            </div>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4">Station Name</th>
                <th className="py-3 px-4">District / Coord</th>
                <th className="py-3 px-4">Rainfall (mm/hr)</th>
                <th className="py-3 px-4">Temp (°C)</th>
                <th className="py-3 px-4">Humidity (%)</th>
                <th className="py-3 px-4">Wind (km/h)</th>
                <th className="py-3 px-4">Pressure (hPa)</th>
                <th className="py-3 px-4">Soil Saturation</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {loc.name} Station
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    <div>{loc.district}</div>
                    <div className="text-[10px] text-slate-400">
                      {loc.lat.toFixed(2)}°N, {loc.lng.toFixed(2)}°E
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    {loc.rainfallMmHr} mm/hr
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800">
                    {loc.temperatureC}°C
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800">
                    {loc.humidityPct}%
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800">
                    {loc.windSpeedKmh} {loc.windDirection}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800">
                    {loc.pressureHpa}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            loc.soilMoisturePct > 85
                              ? 'bg-rose-600'
                              : loc.soilMoisturePct > 65
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${loc.soilMoisturePct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-600">
                        {loc.soilMoisturePct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All telemetry streams calibrated against IMD surface standards (WMO No. 8)</span>
          </div>
          <span className="font-mono text-[11px]">Sampling rate: 1 Hz</span>
        </div>
      </div>
    </div>
  );
};
