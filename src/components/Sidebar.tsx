import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Database,
  BrainCircuit,
  BellRing,
  ShieldAlert,
  BarChart3,
  Info,
  CloudLightning,
  Radio,
  X
} from 'lucide-react';

export type TabKey =
  | 'dashboard'
  | 'map'
  | 'weather-data'
  | 'ai-predictions'
  | 'alerts'
  | 'risk-analysis'
  | 'model-performance'
  | 'about';

interface SidebarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeAlertCount?: number;
  highRiskCount?: number;
}

interface NavItem {
  id: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'map', label: 'Live Risk Map', icon: MapPin, badge: 'GIS' },
  { id: 'weather-data', label: 'Weather Data', icon: Database, badge: '4 Feeds' },
  { id: 'ai-predictions', label: 'AI Predictions', icon: BrainCircuit, badge: '2–6h' },
  { id: 'alerts', label: 'Alerts', icon: BellRing, badge: 18, badgeColor: 'bg-rose-500 text-white' },
  { id: 'risk-analysis', label: 'Risk Analysis', icon: ShieldAlert },
  { id: 'model-performance', label: 'Model Performance', icon: BarChart3, badge: '92.4%' },
  { id: 'about', label: 'About System', icon: Info }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  activeAlertCount = 18
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0B1528] text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 border border-blue-400/30">
              <CloudLightning className="w-6 h-6 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0B1528] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">WEATHERGUARD</span>
                <span className="text-xs px-1.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-tight">
                Hyper-Local Early Warning System
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIH Hackathon & GovTech Banner */}
        <div className="px-4 py-2.5 bg-blue-950/40 border-b border-blue-900/30 text-[11px] text-blue-200 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span className="font-semibold text-blue-300">SIH Prototype</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300 truncate">Tamil Nadu SDMA / IMD Node</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const badgeValue = item.id === 'alerts' ? activeAlertCount : item.badge;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {badgeValue !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-blue-700 text-blue-100'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Mission Quote */}
        <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <p className="font-semibold text-blue-400 mb-0.5">Disaster Protocol</p>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">
            “Predict severe weather early. Identify exactly where. Warn people in time.”
          </p>
        </div>

        {/* System Status Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#091122]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-slate-200">System Status</p>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Monitoring Active
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              v2.4-SIH
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
