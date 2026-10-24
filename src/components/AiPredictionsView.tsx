import React, { useState } from 'react';
import {
  BrainCircuit,
  Clock,
  Play,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  RefreshCw,
  Cpu,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { TIMELINE_PREDICTIONS } from '../data/mockWeatherData';
import { getRiskBadgeClasses } from '../utils/weatherUtils';

export const AiPredictionsView: React.FC = () => {
  const [timeline] = useState(TIMELINE_PREDICTIONS);
  const [selectedHour, setSelectedHour] = useState<number>(2); // Default to +2h peak
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simComplete, setSimComplete] = useState<boolean>(false);

  const currentTimelinePoint =
    timeline.find((t) => t.hourOffset === selectedHour) || timeline[1];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimComplete(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimComplete(true);
      setTimeout(() => setSimComplete(false), 4000);
    }, 1200);
  };

  const riskBadge = getRiskBadgeClasses(currentTimelinePoint.riskLevel);

  return (
    <div className="space-y-6 pb-12">
      {/* ----------------------------------------------------
          1. HEADER & SIMULATION TRIGGER
          ---------------------------------------------------- */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white border border-blue-800/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>2–6 Hour Advanced AI Nowcasting Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Predictive Convective Precipitation Extrapolation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Synthesizes Doppler radar reflectivity cubes, INSAT infrared brightness temperatures, and hyper-local IoT telemetry using Spatiotemporal ConvLSTM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isSimulating
                ? 'bg-slate-700 text-slate-300 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-300" />
                <span>Running Nowcast Ensemble...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-white" />
                <span>Run Nowcast Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {simComplete && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Nowcast simulation completed: Updated 128 taluks with 2-6h forecast window.</span>
        </div>
      )}

      {/* ----------------------------------------------------
          2. TIMELINE SCRUBBER (2–6 HOURS ADVANCE)
          ---------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Interactive 2–6 Hour Early Warning Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Select any forecast horizon to inspect modeled precipitation intensity and peak flood hazard
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Horizon: +{selectedHour} Hours</span>
          </div>
        </div>

        {/* Hour buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
          {timeline.map((point) => {
            const isSelected = point.hourOffset === selectedHour;
            const pRisk = getRiskBadgeClasses(point.riskLevel);
            return (
              <button
                key={point.hourOffset}
                onClick={() => setSelectedHour(point.hourOffset)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">
                    +{point.hourOffset}h Lead
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      point.riskLevel === 'VERY_HIGH'
                        ? 'bg-rose-600 animate-pulse'
                        : point.riskLevel === 'HIGH'
                        ? 'bg-orange-500'
                        : point.riskLevel === 'MODERATE'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="text-base font-extrabold text-slate-900 font-mono">
                  {point.predictedRainfallMm}{' '}
                  <span className="text-[10px] font-normal text-slate-500">mm/hr</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>Conf: {point.confidencePct}%</span>
                  <span className="font-mono">{point.radarDbz} dBZ</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel for the Selected Forecast Hour */}
        <div className="mt-6 p-5 rounded-xl bg-slate-900 text-white border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                {riskBadge.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Projection Window: {currentTimelinePoint.timeLabel}
              </span>
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">
              {currentTimelinePoint.predictedRainfallMm > 50
                ? 'Extreme Convective Cloudburst Imminent'
                : currentTimelinePoint.predictedRainfallMm > 30
                ? 'Intense Heavy Showers & Rapid Water Accumulation'
                : 'Moderating Precipitation Cells'}
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              At +{selectedHour} hours ahead, modeled Doppler echo tops indicate maximum vertical velocity over Coimbatore, Erode, and Nilgiris slope catchments.
            </p>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 block">Rainfall Rate</span>
              <span className="text-2xl font-bold text-blue-400 font-mono">
                {currentTimelinePoint.predictedRainfallMm} mm/hr
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 block">Peak Wind Gusts</span>
              <span className="text-2xl font-bold text-teal-400 font-mono">
                {currentTimelinePoint.windGustKmh} km/h
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 block">Radar Reflectivity</span>
              <span className="text-2xl font-bold text-amber-400 font-mono">
                {currentTimelinePoint.radarDbz} dBZ
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/90 border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 block">Ensemble Confidence</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono">
                {currentTimelinePoint.confidencePct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          3. AI / ML ARCHITECTURE PIPELINE
          ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 w-fit mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            1. Spatiotemporal ConvLSTM
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Ingests consecutive 10-minute Doppler radar sequences to predict precipitation cell movement, cell splitting, and convective cloud core intensification.
          </p>
          <div className="mt-3 text-[11px] text-blue-700 font-semibold font-mono">
            Output: 2D Reflectivity Array (500m res)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 w-fit mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            2. Graph Neural Network (GNN)
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Models hydrological basin connectivity, river nodes, and canal junctions to calculate downstream flow routing and upstream retention capacities.
          </p>
          <div className="mt-3 text-[11px] text-indigo-700 font-semibold font-mono">
            Output: Node Inundation Probability
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 w-fit mb-3">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            3. Probabilistic Warning Classifier
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
            Converts multi-ensemble forecasts into calibrated risk tiers (Low, Moderate, High, Very High) complying with NDMA disaster decision trees.
          </p>
          <div className="mt-3 text-[11px] text-purple-700 font-semibold font-mono">
            Output: CAP-Compliant Bulletin JSON
          </div>
        </div>
      </div>
    </div>
  );
};
