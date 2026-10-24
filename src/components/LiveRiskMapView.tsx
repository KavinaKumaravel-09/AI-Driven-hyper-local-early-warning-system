import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  MapPin,
  AlertTriangle,
  Wind,
  Droplets,
  CloudRain,
  Shield,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { LocationWeather, RiskLevel, SupportedLanguage, WeatherAlert } from '../types/weather';
import { getRiskBadgeClasses } from '../utils/weatherUtils';
import { Volume2 } from 'lucide-react';

interface LiveRiskMapViewProps {
  locations: LocationWeather[];
  initialSelectedId?: string;
  onIssueAlertForLocation?: (location: LocationWeather) => void;
  onPlayVoiceAlert?: (alert: WeatherAlert) => void;
  playingAlertId?: string | null;
  selectedLanguage?: SupportedLanguage;
}

type MapLayerKey = 'risk' | 'rainfall' | 'radar' | 'satellite' | 'flood';

export const LiveRiskMapView: React.FC<LiveRiskMapViewProps> = ({
  locations,
  initialSelectedId = 'cbe',
  onIssueAlertForLocation,
  onPlayVoiceAlert,
  playingAlertId,
  selectedLanguage = 'en'
}) => {
  // Active layers state
  const [activeLayers, setActiveLayers] = useState<Record<MapLayerKey, boolean>>({
    risk: true,
    rainfall: true,
    radar: true,
    satellite: false,
    flood: false
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationWeather | null>(() => {
    return locations.find((l) => l.id === initialSelectedId) || locations[0];
  });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [radarRotating, setRadarRotating] = useState<boolean>(true);

  // Geographic bounds for Tamil Nadu coordinate projection
  // Lat: 8.0° N to 13.8° N (height: 5.8 deg)
  // Lng: 76.0° E to 80.6° E (width: 4.6 deg)
  const MAP_WIDTH = 840;
  const MAP_HEIGHT = 800;
  const MIN_LAT = 8.0;
  const MAX_LAT = 13.6;
  const MIN_LNG = 76.1;
  const MAX_LNG = 80.45;

  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * (MAP_WIDTH - 120) + 60;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * (MAP_HEIGHT - 120) + 60;
    return { x, y };
  };

  // Filter locations by search
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const q = searchQuery.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.district.toLowerCase().includes(q) ||
        loc.weatherEvent.toLowerCase().includes(q)
    );
  }, [locations, searchQuery]);

  const toggleLayer = (layer: MapLayerKey) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // District risk contour polygons (simulated realistic GIS hulls around key clusters)
  const riskZones = useMemo(() => {
    return [
      // Very High Risk Zone: Erode & Nilgiris corridor
      {
        id: 'zone-vh-1',
        name: 'Western Ghats Inundation & Landslide Corridor',
        risk: 'VERY_HIGH' as RiskLevel,
        points: '120,380 180,310 280,330 320,410 260,460 140,440',
        centerName: 'Erode - Nilgiris Axis'
      },
      // High Risk Zone: Coimbatore basin
      {
        id: 'zone-h-1',
        name: 'Coimbatore - Noyyal Severe Convection',
        risk: 'HIGH' as RiskLevel,
        points: '130,420 220,410 250,510 180,540 120,490',
        centerName: 'Coimbatore District'
      },
      // High Risk Zone: Cuddalore coastal squall
      {
        id: 'zone-h-2',
        name: 'Cuddalore Coastal Storm Surge Arc',
        risk: 'HIGH' as RiskLevel,
        points: '610,340 710,360 740,470 650,480 590,400',
        centerName: 'Cuddalore Shore'
      },
      // Moderate Risk Zone: Central Tiruppur & Kanchipuram
      {
        id: 'zone-m-1',
        name: 'Tiruppur - Salem Industrial Valley',
        risk: 'MODERATE' as RiskLevel,
        points: '220,370 340,320 440,370 380,470 260,460',
        centerName: 'Tiruppur / Salem'
      },
      {
        id: 'zone-m-2',
        name: 'North Tamil Nadu Belt (Kanchipuram - Chengalpattu)',
        risk: 'MODERATE' as RiskLevel,
        points: '590,130 730,120 760,230 640,240 560,190',
        centerName: 'Kanchipuram - Chengalpattu'
      },
      // Low Risk Zone: Southern Plains (Madurai / Trichy)
      {
        id: 'zone-l-1',
        name: 'Southern Plains & Delta Catchment',
        risk: 'LOW' as RiskLevel,
        points: '340,490 530,470 560,620 410,690 310,600',
        centerName: 'Madurai - Tiruchirappalli'
      }
    ];
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Controls & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search location */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search location (e.g. Coimbatore, Erode, Chennai)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Map Layers Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Layers:</span>
          </div>

          {/* Risk Layer */}
          <button
            onClick={() => toggleLayer('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeLayers.risk
                ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Risk Layer
          </button>

          {/* Rainfall Layer */}
          <button
            onClick={() => toggleLayer('rainfall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeLayers.rainfall
                ? 'bg-sky-600 text-white border-sky-700 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Rainfall Layer
          </button>

          {/* Radar Layer */}
          <button
            onClick={() => toggleLayer('radar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeLayers.radar
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Radar Layer
          </button>

          {/* Satellite Layer */}
          <button
            onClick={() => toggleLayer('satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeLayers.satellite
                ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Satellite Layer
          </button>

          {/* Flood Risk Layer */}
          <button
            onClick={() => toggleLayer('flood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeLayers.flood
                ? 'bg-teal-600 text-white border-teal-700 shadow-2xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
          >
            Flood Risk Layer
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Interactive Map Canvas (8 or 9 cols on desktop) */}
        <div className="xl:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden flex flex-col min-h-[560px]">
          {/* Top Floating Map Header & Tool Controls */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white text-xs font-semibold shadow-md flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Tamil Nadu GIS Grid (0.05° High-Res)</span>
            </div>
            {activeLayers.radar && (
              <button
                onClick={() => setRadarRotating(!radarRotating)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                  radarRotating
                    ? 'bg-indigo-900/80 border-indigo-500/50 text-indigo-200'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {radarRotating ? '● Radar Sweep ON' : '○ Radar Sweep Paused'}
              </button>
            )}
          </div>

          {/* Zoom Controls on Map */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              title="Zoom In"
              className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-md transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              title="Zoom Out"
              className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-md transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              title="Reset View"
              className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive SVG Map */}
          <div className="flex-1 w-full h-full flex items-center justify-center overflow-hidden p-2 relative">
            <svg
              viewBox="0 0 840 800"
              className="w-full h-full max-h-[640px] select-none transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Radar beam gradient */}
                <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </radialGradient>

                {/* Satellite infrared cloud gradient */}
                <radialGradient id="satelliteIr" cx="30%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.55" />
                  <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.35" />
                  <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>

                {/* Flood risk water gradient */}
                <radialGradient id="floodRiskGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#0284c7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </radialGradient>

                {/* Glow filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Geo Grid lines */}
              <g stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 4">
                {[100, 200, 300, 400, 500, 600, 700].map((y) => (
                  <line key={`lat-${y}`} x1="40" y1={y} x2="800" y2={y} />
                ))}
                {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                  <line key={`lng-${x}`} x1={x} y1="40" x2={x} y2="760" />
                ))}
              </g>

              {/* Coordinate labels */}
              <g fill="#475569" fontSize="9" fontFamily="monospace">
                <text x="50" y="105">13.5°N</text>
                <text x="50" y="270">12.0°N</text>
                <text x="50" y="470">10.5°N</text>
                <text x="50" y="680">09.0°N</text>
                <text x="160" y="780">77.0°E</text>
                <text x="380" y="780">78.5°E</text>
                <text x="640" y="780">80.0°E</text>
              </g>

              {/* Bay of Bengal Sea Outline & Water Texture (East) */}
              <path
                d="M 690,40 Q 770,180 780,320 T 730,580 T 640,740 L 820,780 L 820,40 Z"
                fill="#0a1526"
                stroke="#1e3a8a"
                strokeWidth="1"
                opacity="0.7"
              />
              <text x="730" y="400" fill="#3b82f6" opacity="0.3" fontSize="13" fontWeight="bold" letterSpacing="4">
                BAY OF BENGAL
              </text>

              {/* Western Ghats Hill Shading (West) */}
              <path
                d="M 80,240 Q 140,360 110,480 T 170,680"
                fill="none"
                stroke="#334155"
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.35"
                filter="url(#glow)"
              />
              <text x="90" y="290" fill="#64748b" opacity="0.5" fontSize="10" transform="rotate(75 90 290)">
                WESTERN GHATS RIDGELINE
              </text>

              {/* Realistic Tamil Nadu State Perimeter Base Shape */}
              <path
                d="M 620,60
                   L 710,120
                   L 730,170
                   L 765,220
                   L 750,300
                   L 700,380
                   L 720,460
                   L 700,530
                   L 610,600
                   L 550,680
                   L 440,760
                   L 390,750
                   L 340,710
                   L 280,630
                   L 210,580
                   L 150,540
                   L 110,470
                   L 140,380
                   L 100,320
                   L 160,250
                   L 240,210
                   L 360,180
                   L 490,120
                   Z"
                fill="#0f172a"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeOpacity="0.8"
              />

              {/* Major River Pathways (Cauvery, Noyyal, Palar, Vaigai) */}
              <g fill="none" stroke="#0284c7" strokeOpacity="0.4" strokeWidth="1.5">
                {/* Cauvery River */}
                <path d="M 220,330 Q 340,360 480,410 T 680,450" />
                {/* Noyyal River */}
                <path d="M 130,460 Q 230,465 310,450" />
                {/* Palar River */}
                <path d="M 520,160 Q 640,180 730,220" />
                {/* Vaigai River */}
                <path d="M 260,620 Q 400,640 540,680" />
              </g>

              {/* --------------------------------------------------
                  LAYER: SATELLITE INFRARED CLOUD COVER (Toggleable)
                  -------------------------------------------------- */}
              {activeLayers.satellite && (
                <g className="transition-opacity duration-500">
                  <ellipse cx="230" cy="420" rx="190" ry="150" fill="url(#satelliteIr)" />
                  <ellipse cx="640" cy="380" rx="140" ry="120" fill="url(#satelliteIr)" />
                  <text x="180" y="320" fill="#f472b6" fontSize="10" fontWeight="bold" opacity="0.8">
                    INSAT-3D Convective Cell TIR &lt; -65°C
                  </text>
                </g>
              )}

              {/* --------------------------------------------------
                  LAYER: FLOOD RISK WATER INUNDATION ZONES (Toggleable)
                  -------------------------------------------------- */}
              {activeLayers.flood && (
                <g className="transition-opacity duration-500">
                  <ellipse cx="280" cy="390" rx="85" ry="60" fill="url(#floodRiskGrad)" />
                  <ellipse cx="160" cy="470" rx="70" ry="50" fill="url(#floodRiskGrad)" />
                  <ellipse cx="680" cy="440" rx="75" ry="45" fill="url(#floodRiskGrad)" />
                  <text x="240" y="420" fill="#38bdf8" fontSize="10" fontWeight="bold">
                    ▲ Flash Flood Inundation &gt; 50cm Depth
                  </text>
                </g>
              )}

              {/* --------------------------------------------------
                  LAYER: RISK LAYER POLYGONS (Toggleable)
                  -------------------------------------------------- */}
              {activeLayers.risk && (
                <g className="transition-opacity duration-500">
                  {riskZones.map((zone) => {
                    let fill = '#10B981';
                    let stroke = '#059669';
                    if (zone.risk === 'VERY_HIGH') {
                      fill = '#E11D48';
                      stroke = '#BE123C';
                    } else if (zone.risk === 'HIGH') {
                      fill = '#EA580C';
                      stroke = '#C2410C';
                    } else if (zone.risk === 'MODERATE') {
                      fill = '#F59E0B';
                      stroke = '#D97706';
                    }

                    return (
                      <g key={zone.id}>
                        <polygon
                          points={zone.points}
                          fill={fill}
                          fillOpacity={zone.risk === 'VERY_HIGH' ? 0.35 : 0.22}
                          stroke={stroke}
                          strokeWidth="2"
                          strokeDasharray={zone.risk === 'VERY_HIGH' ? '4 2' : 'none'}
                          className="hover:fill-opacity-50 transition-all cursor-pointer"
                        />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* --------------------------------------------------
                  LAYER: RAINFALL ISO-CONTOURS (Toggleable)
                  -------------------------------------------------- */}
              {activeLayers.rainfall && (
                <g className="transition-opacity duration-500">
                  {/* Heavy Rainfall Cloud over Coimbatore & Erode */}
                  <circle cx="180" cy="470" r="70" fill="#2563eb" fillOpacity="0.25" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="180" cy="470" r="45" fill="#1d4ed8" fillOpacity="0.4" stroke="#93c5fd" strokeWidth="1.5" />
                  <circle cx="280" cy="380" r="60" fill="#dc2626" fillOpacity="0.3" stroke="#f87171" strokeWidth="1.5" />
                  <circle cx="650" cy="420" r="50" fill="#ea580c" fillOpacity="0.25" stroke="#fb923c" strokeWidth="1" />
                </g>
              )}

              {/* --------------------------------------------------
                  LAYER: DOPPLER RADAR SWEEP (Toggleable)
                  -------------------------------------------------- */}
              {activeLayers.radar && (
                <g className="transition-opacity duration-500 pointer-events-none">
                  {/* Radar Range Rings from Coimbatore DWR Node */}
                  <circle cx="180" cy="470" r="60" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="4 4" />
                  <circle cx="180" cy="470" r="120" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="4 4" />
                  <circle cx="180" cy="470" r="180" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="4 4" />

                  {/* Rotating Doppler Radar Sweep */}
                  <g
                    style={{
                      transformOrigin: '180px 470px',
                      animation: radarRotating ? 'spin 5s linear infinite' : 'none'
                    }}
                  >
                    <path
                      d="M 180,470 L 340,380 A 180 180 0 0 1 360,470 Z"
                      fill="url(#radarSweep)"
                    />
                    <line x1="180" y1="470" x2="360" y2="470" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.8" />
                  </g>

                  {/* Chennai DWR Secondary Sweeping node */}
                  <circle cx="720" cy="180" r="90" fill="none" stroke="#818cf8" strokeWidth="0.6" strokeOpacity="0.3" strokeDasharray="3 3" />
                </g>
              )}

              {/* --------------------------------------------------
                  LOCATION MARKERS & PINS
                  -------------------------------------------------- */}
              {filteredLocations.map((loc) => {
                const { x, y } = projectToMap(loc.lat, loc.lng);
                const isSelected = selectedLocation?.id === loc.id;
                const riskInfo = getRiskBadgeClasses(loc.risk);

                return (
                  <g
                    key={loc.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedLocation(loc)}
                  >
                    {/* Animated Pulsing Ring for High / Very High Risk */}
                    {(loc.risk === 'HIGH' || loc.risk === 'VERY_HIGH') && (
                      <circle
                        r="18"
                        fill="none"
                        stroke={riskInfo.accent}
                        strokeWidth="2"
                        opacity="0.8"
                        className="animate-ping"
                        style={{ transformOrigin: 'center' }}
                      />
                    )}

                    {/* Outer Selection Highlight Ring */}
                    {isSelected && (
                      <circle
                        r="14"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        strokeDasharray="2 2"
                        className="animate-spin"
                        style={{ transformOrigin: 'center', animationDuration: '8s' }}
                      />
                    )}

                    {/* Center Marker Pin */}
                    <circle
                      r={isSelected ? 9 : 7}
                      fill={riskInfo.accent}
                      stroke="#ffffff"
                      strokeWidth="2"
                      filter="url(#glow)"
                      className="transition-all duration-200 group-hover:scale-125"
                    />

                    {/* Location Name Label Tag */}
                    <g transform="translate(12, 4)">
                      <rect
                        x="-3"
                        y="-12"
                        width={loc.name.length * 6.8 + 14}
                        height="17"
                        rx="4"
                        fill="#0b1329"
                        fillOpacity="0.9"
                        stroke={isSelected ? '#ffffff' : '#334155'}
                        strokeWidth={isSelected ? '1.5' : '1'}
                      />
                      <text
                        x="3"
                        y="0"
                        fill={isSelected ? '#ffffff' : '#e2e8f0'}
                        fontSize="10"
                        fontWeight={isSelected ? 'bold' : '600'}
                        fontFamily="sans-serif"
                      >
                        {loc.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Map Legend */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-slate-400 font-semibold text-[11px]">RISK LEGEND:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span className="text-slate-200 text-xs">Low (&lt;15 mm/hr)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="text-slate-200 text-xs">Moderate (15–35 mm/hr)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                <span className="text-slate-200 text-xs">High (35–64 mm/hr)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-pulse" />
                <span className="text-slate-200 text-xs font-semibold">Very High (&ge;65 mm/hr)</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Click any location pin to inspect hyper-local metrics
            </span>
          </div>
        </div>

        {/* ----------------------------------------------------
            SELECTED LOCATION POPUP / INSPECTOR CARD (4 cols)
            ---------------------------------------------------- */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col justify-between">
          {selectedLocation ? (
            <div className="space-y-5">
              {/* Header with Risk Badge */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Selected Station</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedLocation.district} • {selectedLocation.state}
                  </p>
                </div>

                {/* Risk Badge */}
                {(() => {
                  const riskInfo = getRiskBadgeClasses(selectedLocation.risk);
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${riskInfo.bg} ${riskInfo.text} ${riskInfo.border}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${riskInfo.dot}`} />
                      {riskInfo.label}
                    </span>
                  );
                })()}
              </div>

              {/* Weather & Prediction Metrics (Exactly matches prompt fields) */}
              <div className="space-y-3">
                {/* Weather Event & Probability */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Weather Condition</span>
                    <span className="text-blue-700 font-bold">AI Probability: {selectedLocation.probability}%</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {selectedLocation.weatherEvent}
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${selectedLocation.probability}%` }}
                    />
                  </div>
                </div>

                {/* Expected & Lead Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 font-medium block">Expected Arrival</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {selectedLocation.expectedTime}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[11px] text-slate-500 font-medium block">Lead Time Window</span>
                    <span className="text-sm font-bold text-blue-700 font-mono">
                      {selectedLocation.leadTimeHours} Hours Advance
                    </span>
                  </div>
                </div>

                {/* Rainfall, Humidity, Wind */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100">
                    <CloudRain className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 font-medium block">Rainfall</span>
                    <span className="text-sm font-bold text-blue-900 font-mono">
                      {selectedLocation.rainfallMmHr} mm/hr
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <Droplets className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 font-medium block">Humidity</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {selectedLocation.humidityPct}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <Wind className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 font-medium block">Wind</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">
                      {selectedLocation.windSpeedKmh} km/h
                    </span>
                  </div>
                </div>

                {/* Recommended Action (Prompt Required Field) */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Recommended Action</span>
                  </div>
                  <p className="text-amber-950/90 leading-relaxed">
                    {selectedLocation.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {onPlayVoiceAlert && (
                  <button
                    onClick={() => {
                      const tempAlert: WeatherAlert = {
                        id: `ALT-LOC-${selectedLocation.id}`,
                        location: selectedLocation.name,
                        district: selectedLocation.district,
                        weatherEvent: selectedLocation.weatherEvent,
                        risk: selectedLocation.risk,
                        expectedTime: selectedLocation.expectedTime,
                        leadTime: `${selectedLocation.leadTimeHours} Hours Advance`,
                        status: 'Active',
                        probability: selectedLocation.probability,
                        affectedPopulation: selectedLocation.populationExposed,
                        issuedAt: 'Live',
                        expiresAt: 'In 3h',
                        issuedBy: 'TNSDMA Radar Ingestion',
                        channels: ['Cell Broadcast', 'Disaster Siren'],
                        instruction: selectedLocation.recommendedAction
                      };
                      onPlayVoiceAlert(tempAlert);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      playingAlertId && playingAlertId.includes(selectedLocation.id)
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen to Voice Warning ({selectedLocation.name})</span>
                  </button>
                )}

                {onIssueAlertForLocation && (
                  <button
                    onClick={() => onIssueAlertForLocation(selectedLocation)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Dispatch Warning for {selectedLocation.name}</span>
                  </button>
                )}

                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <span>Sensor Mesh Latency: 24ms</span>
                  <span>•</span>
                  <span>Geo-Resolution: 500m</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <MapPin className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-medium">Select any district marker on the map</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
