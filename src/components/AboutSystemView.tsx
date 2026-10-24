import React from 'react';
import {
  Info,
  Shield,
  CloudLightning,
  BrainCircuit,
  MapPin,
  Radio,
  Award,
  CheckCircle2,
  Users,
  Target,
  ArrowRight
} from 'lucide-react';

export const AboutSystemView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B1528] via-[#122345] to-[#1E3A8A] text-white rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-4">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Smart India Hackathon Prototype</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          WeatherGuard AI
        </h2>
        <p className="text-sm sm:text-base text-blue-200 font-medium mt-1">
          Hyper-Local AI Weather Early Warning System
        </p>

        {/* The required Core Mantra */}
        <div className="mt-6 p-4 rounded-xl bg-blue-950/60 border border-blue-400/30 max-w-xl">
          <p className="text-lg font-bold text-white tracking-tight italic">
            “Predict severe weather early. Identify exactly where. Warn people in time.”
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-2xl">
          An operational disaster-management prototype engineered to bridge the critical 2–6 hour prediction gap for extreme weather events such as cloudbursts, severe thunderstorms, flash floods, and localized landslides.
        </p>
      </div>

      {/* Problem Statement & Innovation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3 text-rose-700 font-bold text-sm">
            <Target className="w-5 h-5 text-rose-600" />
            <span>The 2–6 Hour Early Warning Challenge</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conventional Numerical Weather Prediction (NWP) models require hours of supercomputing time, making them ineffective for rapid convective cloud bursts that develop and strike within 2 to 4 hours. By combining Doppler radar extrapolation, satellite vapor tracking, and micro-sensor networks, WeatherGuard AI generates hyper-local warnings 2–6 hours in advance.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3 text-blue-700 font-bold text-sm">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Operational Disaster Management Integration</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built following the National Disaster Management Authority (NDMA) Common Alerting Protocol (CAP). Integrates with State Emergency Operation Centres (SEOC), District Collectorates, public sirens, and telecom cell broadcasts to safeguard vulnerable populations.
          </p>
        </div>
      </div>

      {/* 4 Architectural Pillars */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
          System Architecture & Pipeline Flow
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm mb-2">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900">Multi-Modal Ingestion</h4>
            <p className="text-xs text-slate-600 mt-1">
              Ingests AWS surface telemetry, S/C band Doppler radar reflectivity, INSAT-3D TIR rasters, and IoT stream gauges.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-2">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900">ConvLSTM Nowcaster</h4>
            <p className="text-xs text-slate-600 mt-1">
              Deep recurrent spatial models extrapolate precipitation cell velocities, cloud top cooling, and vertical wind shear.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm mb-2">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900">GIS Risk Geofencing</h4>
            <p className="text-xs text-slate-600 mt-1">
              Projects rainfall accumulation against digital elevation models (DEM) to classify Low, Moderate, High, and Very High risk polygons.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm mb-2">
              4
            </div>
            <h4 className="text-sm font-bold text-slate-900">Automated CAP Warning</h4>
            <p className="text-xs text-slate-600 mt-1">
              Dispatches multi-lingual bulletins via Cell Broadcast, localized SMS, civil defense sirens, and emergency services dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
