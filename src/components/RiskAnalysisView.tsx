import React, { useState } from 'react';
import {
  ShieldAlert,
  Waves,
  Mountain,
  Building2,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { LocationWeather } from '../types/weather';
import { getRiskBadgeClasses, formatNumber } from '../utils/weatherUtils';

interface RiskAnalysisViewProps {
  locations: LocationWeather[];
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({ locations }) => {
  // Sort by highest risk / rainfall
  const sortedLocations = [...locations].sort(
    (a, b) => b.rainfallMmHr - a.rainfallMmHr
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              High-Slope Flash Flood Risk
            </span>
            <Mountain className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            2 Districts
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Nilgiris & Coimbatore Western Ghats
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Urban Waterlogging Risk
            </span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            4 Metro Zones
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Coimbatore, Tiruppur, Chennai, Salem
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Coastal Surge / High Wind
            </span>
            <Waves className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            Cuddalore Arc
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            46 km/h gusts • Bay of Bengal squalls
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Population in High Risk
            </span>
            <Users className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-mono">
            1.19 Million
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across 5 Very High & 2 High zones
          </p>
        </div>
      </div>

      {/* District Vulnerability Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Hyper-Local District Risk Ranking & Vulnerability Index
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked dynamically by projected 2–6h precipitation accumulation, slope gradient, and drainage saturation
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 px-3 py-1 rounded-lg bg-slate-100">
            GIS Terrain Model v3.1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">District / Area</th>
                <th className="py-3 px-4">Current Risk</th>
                <th className="py-3 px-4">Rain Rate</th>
                <th className="py-3 px-4">Projected Flood Depth</th>
                <th className="py-3 px-4">Soil Saturation</th>
                <th className="py-3 px-4">Vulnerable Population</th>
                <th className="py-3 px-4">Primary Hazard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedLocations.map((loc, idx) => {
                const riskBadge = getRiskBadgeClasses(loc.risk);
                return (
                  <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{loc.name}</span>
                      <span className="text-[10px] text-slate-400 block">{loc.district}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
                        {loc.risk.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {loc.rainfallMmHr} mm/hr
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      <span className={loc.floodDepthCm > 40 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                        {loc.floodDepthCm} cm
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {loc.soilMoisturePct}%
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {formatNumber(loc.populationExposed)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {loc.weatherEvent}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
