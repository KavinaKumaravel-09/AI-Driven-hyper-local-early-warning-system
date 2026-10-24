import React from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  History,
  ShieldCheck
} from 'lucide-react';
import { MODEL_METRICS_DATA } from '../data/mockWeatherData';

export const ModelPerformanceView: React.FC = () => {
  const metrics = MODEL_METRICS_DATA;

  return (
    <div className="space-y-6 pb-12">
      {/* Top 5 Model Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Overall Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Overall Accuracy
          </span>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 font-mono">
            {metrics.overallAccuracy}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across 128 monitoring nodes
          </p>
        </div>

        {/* Precision */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Model Precision
          </span>
          <div className="mt-2 text-3xl font-extrabold text-blue-600 font-mono">
            {metrics.precision}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Confirmed severe triggers
          </p>
        </div>

        {/* Probability of Detection (POD / Recall) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            POD (Recall)
          </span>
          <div className="mt-2 text-3xl font-extrabold text-indigo-600 font-mono">
            {metrics.recallPod}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Zero missed major cloudbursts
          </p>
        </div>

        {/* False Alarm Ratio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            False Alarm Ratio
          </span>
          <div className="mt-2 text-3xl font-extrabold text-amber-600 font-mono">
            {metrics.falseAlarmRatio}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Within WMO 10% safety bound
          </p>
        </div>

        {/* CSI Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Critical Success Index
          </span>
          <div className="mt-2 text-3xl font-extrabold text-purple-600 font-mono">
            {metrics.csiScore}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            CSI &gt; 0.75 benchmark
          </p>
        </div>
      </div>

      {/* Grid: Confusion Matrix & Lead-Time Decay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Confusion Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Severe Weather Event Classification (&ge;35 mm/hr)
                </p>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                N = 2,840 Tests
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* True Positive */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                  True Positive (TP)
                </span>
                <div className="text-2xl font-bold text-emerald-900 font-mono my-1">
                  1,338
                </div>
                <p className="text-[10px] text-emerald-700">
                  Correctly warned severe downpours
                </p>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">
                  False Positive (FP)
                </span>
                <div className="text-2xl font-bold text-amber-900 font-mono my-1">
                  128
                </div>
                <p className="text-[10px] text-amber-700">
                  Precautionary false alarms
                </p>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-[11px] font-bold text-rose-800 uppercase block">
                  False Negative (FN)
                </span>
                <div className="text-2xl font-bold text-rose-900 font-mono my-1">
                  82
                </div>
                <p className="text-[10px] text-rose-700">
                  Unanticipated local rain surges
                </p>
              </div>

              {/* True Negative */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[11px] font-bold text-blue-800 uppercase block">
                  True Negative (TN)
                </span>
                <div className="text-2xl font-bold text-blue-900 font-mono my-1">
                  1,292
                </div>
                <p className="text-[10px] text-blue-700">
                  Correctly predicted dry / normal
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Validated against IMD Automated Rain Gauge ground truth records.
          </div>
        </div>

        {/* Lead-Time Accuracy Decay Curve (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Lead-Time Accuracy Horizon (1h to 6h Advance)
                </h3>
                <p className="text-xs text-slate-500">
                  Verification of AI nowcasting skill across temporal lead windows
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                High Confidence
              </span>
            </div>

            <div className="space-y-3.5 mt-5">
              {metrics.leadTimeAccuracy.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.leadTime}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">{item.sampleCount} trials</span>
                      <span className="font-mono font-bold text-slate-900">{item.accuracy}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.accuracy > 90
                          ? 'bg-emerald-500'
                          : item.accuracy > 80
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">2–6 Hour window provides critical evacuation lead time for district administrations.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
