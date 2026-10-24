export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export type WeatherEventType =
  | 'Heavy Rainfall'
  | 'Thunderstorm & Lightning'
  | 'Flash Flood Risk'
  | 'Cloudburst'
  | 'Landslide Warning'
  | 'High Wind / Squall'
  | 'Moderate Showers'
  | 'Partly Cloudy';

export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ml' | 'te';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  speechCode: string;
  flag: string;
}

export interface AlertTranslation {
  weatherEvent: string;
  instruction: string;
  expectedTime: string;
  leadTime: string;
  speechText: string;
  locationName?: string;
  districtName?: string;
  riskLabel?: string;
}

export interface LocationWeather {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  risk: RiskLevel;
  weatherEvent: WeatherEventType;
  probability: number; // in %
  expectedTime: string; // e.g. "Within 2 hours"
  leadTimeHours: number; // 2 to 6
  rainfallMmHr: number;
  accumulated24hMm: number;
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirection: string;
  cloudCoverPct: number;
  pressureHpa: number;
  radarReflectivityDbz: number;
  floodDepthCm: number;
  populationExposed: number;
  recommendedAction: string;
  lastUpdated: string;
  soilMoisturePct: number;
  activeSensors: number;
}

export interface WeatherAlert {
  id: string;
  location: string;
  district: string;
  weatherEvent: WeatherEventType;
  risk: RiskLevel;
  expectedTime: string;
  leadTime: string;
  status: 'Active' | 'Monitoring' | 'Resolved' | 'Dispatched';
  probability: number;
  affectedPopulation: number;
  issuedAt: string;
  expiresAt: string;
  issuedBy: string;
  channels: ('Cell Broadcast' | 'SMS' | 'Disaster Siren' | 'Police Patrols')[];
  instruction: string;
  translations?: Partial<Record<SupportedLanguage, AlertTranslation>>;
  isOfflineQueued?: boolean;
}

export interface DataSourceStatus {
  id: string;
  name: string;
  type: string;
  status: 'Connected' | 'Synchronized' | 'Calibrating' | '98.4% Active';
  pingMs: number;
  lastSync: string;
  totalStations: number;
  dataPointsPerMin: number;
  primaryMetrics: string[];
  description: string;
}

export interface PredictionTimelinePoint {
  hourOffset: number; // +1h, +2h, +3h, +4h, +5h, +6h
  timeLabel: string;
  predictedRainfallMm: number;
  confidencePct: number;
  radarDbz: number;
  riskLevel: RiskLevel;
  windGustKmh: number;
}

export interface ModelMetric {
  overallAccuracy: number;
  precision: number;
  recallPod: number;
  falseAlarmRatio: number;
  csiScore: number;
  leadTimeAccuracy: {
    leadTime: string;
    accuracy: number;
    sampleCount: number;
  }[];
}
