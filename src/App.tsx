/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, TabKey } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { LiveRiskMapView } from './components/LiveRiskMapView';
import { WeatherDataView } from './components/WeatherDataView';
import { AiPredictionsView } from './components/AiPredictionsView';
import { AlertsView } from './components/AlertsView';
import { RiskAnalysisView } from './components/RiskAnalysisView';
import { ModelPerformanceView } from './components/ModelPerformanceView';
import { AboutSystemView } from './components/AboutSystemView';
import { AlertDetailModal } from './components/AlertDetailModal';
import { BroadcastModal } from './components/BroadcastModal';
import { VoiceAlertDock } from './components/VoiceAlertDock';
import { VoiceTestModal } from './components/VoiceTestModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { LocationWeather, WeatherAlert, SupportedLanguage } from './types/weather';
import {
  loadCachedAlerts,
  saveCachedAlerts,
  loadCachedLocations,
  saveCachedLocations,
  loadSavedLanguage,
  saveSavedLanguage,
  getOfflineStatusSummary,
  queueOfflineBroadcast,
  flushOfflineQueue,
  OfflineCacheStatus
} from './utils/offlineStorage';
import { getAlertContent } from './utils/translations';
import { playAttentionChime, playEmergencySiren, speakAlertText, stopAudioAlert } from './utils/audioAlert';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Online / Offline State
  const { isOnline, isSimulatedOffline, toggleSimulatedOffline } = useOnlineStatus();
  const [cacheStatus, setCacheStatus] = useState<OfflineCacheStatus>(getOfflineStatusSummary);

  // Cached locations and alerts
  const [locations, setLocations] = useState<LocationWeather[]>(() => loadCachedLocations());
  const [alerts, setAlerts] = useState<WeatherAlert[]>(() => loadCachedAlerts());

  // Multilingual State
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() => loadSavedLanguage());

  // Voice Alert State
  const [currentVoiceAlert, setCurrentVoiceAlert] = useState<WeatherAlert | null>(null);
  const [isVoicePlaying, setIsVoicePlaying] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [playSirenFirst, setPlaySirenFirst] = useState<boolean>(true);
  const [voiceTestModalOpen, setVoiceTestModalOpen] = useState<boolean>(false);

  // Focus location for map navigation
  const [mapInitialSelectedId, setMapInitialSelectedId] = useState<string>('cbe');

  // Modals state
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState<WeatherAlert | null>(null);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState<boolean>(false);

  // Synchronize alerts with local storage
  useEffect(() => {
    saveCachedAlerts(alerts);
    setCacheStatus(getOfflineStatusSummary());
  }, [alerts]);

  // Synchronize locations with local storage
  useEffect(() => {
    saveCachedLocations(locations);
  }, [locations]);

  // Handle language switch
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    saveSavedLanguage(lang);
  };

  // Navigate with optional context ID
  const handleNavigateTab = (tab: TabKey, contextId?: string) => {
    if (contextId) {
      setMapInitialSelectedId(contextId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add newly issued alert (handles online or offline queue)
  const handleBroadcastSubmitted = (newAlert: WeatherAlert) => {
    if (!isOnline) {
      queueOfflineBroadcast(newAlert);
    }
    setAlerts((prev) => [newAlert, ...prev]);
    setCacheStatus(getOfflineStatusSummary());
  };

  // Reconcile pending offline dispatches
  const handleSyncOfflineQueue = () => {
    const queuedItems = flushOfflineQueue();
    if (queuedItems.length > 0) {
      setAlerts((prev) =>
        prev.map((a) => {
          if (queuedItems.some((q) => q.id === a.id)) {
            return { ...a, isOfflineQueued: false, status: 'Active' };
          }
          return a;
        })
      );
    }
    setCacheStatus(getOfflineStatusSummary());
  };

  // Issue alert triggered from location popup
  const handleIssueAlertForLocation = (loc: LocationWeather) => {
    setBroadcastModalOpen(true);
  };

  // Refresh feeds simulation (online only)
  const handleRefreshData = () => {
    if (!isOnline) return;
    setLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        rainfallMmHr: Math.max(0, Math.round(loc.rainfallMmHr + (Math.random() * 4 - 2))),
        lastUpdated: 'Just now'
      }))
    );
  };

  // Voice Alert trigger
  const handlePlayVoiceAlert = async (alert: WeatherAlert, lang: SupportedLanguage = selectedLanguage) => {
    stopAudioAlert();
    setCurrentVoiceAlert(alert);
    setIsVoicePlaying(true);

    const localized = getAlertContent(alert, lang);

    // Play chime first
    await playAttentionChime();

    speakAlertText(
      localized.speechText,
      lang,
      speechRate,
      () => setIsVoicePlaying(true),
      () => setIsVoicePlaying(false)
    );
  };

  // Stop voice alert
  const handleStopVoiceAlert = () => {
    stopAudioAlert();
    setIsVoicePlaying(false);
  };

  // Replay voice alert
  const handleReplayVoiceAlert = () => {
    if (currentVoiceAlert) {
      handlePlayVoiceAlert(currentVoiceAlert, selectedLanguage);
    }
  };

  // Test emergency siren
  const handleTestSiren = async () => {
    await playEmergencySiren(2000);
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'Active').length;
  const currentlyPlayingId = isVoicePlaying && currentVoiceAlert ? currentVoiceAlert.id : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Fixed Desktop Sidebar & Mobile Drawer */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigateTab(tab)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeAlertCount={activeAlertCount}
      />

      {/* Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Sticky Top Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onRefreshData={handleRefreshData}
          onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
          activeAlertCount={activeAlertCount}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleSelectLanguage}
          isOnline={isOnline}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulatedOffline={toggleSimulatedOffline}
          onOpenVoiceTestModal={() => setVoiceTestModalOpen(true)}
          isVoicePlaying={isVoicePlaying}
        />

        {/* Offline & Cache Status Banner */}
        <OfflineIndicator
          isOnline={isOnline}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulateOffline={toggleSimulatedOffline}
          cacheStatus={cacheStatus}
          onSyncOfflineQueue={handleSyncOfflineQueue}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              locations={locations}
              alerts={alerts}
              onNavigateTab={handleNavigateTab}
              onOpenAlertDetails={(alert) => setSelectedAlertForDetail(alert)}
              onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
              selectedLanguage={selectedLanguage}
              onPlayVoiceAlert={handlePlayVoiceAlert}
              playingAlertId={currentlyPlayingId}
            />
          )}

          {currentTab === 'map' && (
            <LiveRiskMapView
              locations={locations}
              initialSelectedId={mapInitialSelectedId}
              onIssueAlertForLocation={handleIssueAlertForLocation}
              onPlayVoiceAlert={handlePlayVoiceAlert}
              playingAlertId={currentlyPlayingId}
              selectedLanguage={selectedLanguage}
            />
          )}

          {currentTab === 'weather-data' && (
            <WeatherDataView locations={locations} />
          )}

          {currentTab === 'ai-predictions' && (
            <AiPredictionsView />
          )}

          {currentTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onOpenAlertDetails={(alert) => setSelectedAlertForDetail(alert)}
              onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={handleSelectLanguage}
              onPlayVoiceAlert={handlePlayVoiceAlert}
              playingAlertId={currentlyPlayingId}
            />
          )}

          {currentTab === 'risk-analysis' && (
            <RiskAnalysisView locations={locations} />
          )}

          {currentTab === 'model-performance' && (
            <ModelPerformanceView />
          )}

          {currentTab === 'about' && (
            <AboutSystemView />
          )}
        </main>
      </div>

      {/* Floating Active Voice Alert Dock */}
      <VoiceAlertDock
        currentAlert={currentVoiceAlert}
        isPlaying={isVoicePlaying}
        selectedLanguage={selectedLanguage}
        speechRate={speechRate}
        playSirenFirst={playSirenFirst}
        onStop={handleStopVoiceAlert}
        onReplay={handleReplayVoiceAlert}
        onToggleSiren={() => setPlaySirenFirst(!playSirenFirst)}
        onChangeRate={(r) => setSpeechRate(r)}
        onChangeLanguage={handleSelectLanguage}
        onTestSiren={handleTestSiren}
      />

      {/* Voice & Sound Siren Test Studio Modal */}
      <VoiceTestModal
        isOpen={voiceTestModalOpen}
        onClose={() => setVoiceTestModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        speechRate={speechRate}
        onChangeSpeechRate={(r) => setSpeechRate(r)}
      />

      {/* Alert Detail Modal with Multilingual Tabs & Voice Playback */}
      <AlertDetailModal
        alert={selectedAlertForDetail}
        onClose={() => setSelectedAlertForDetail(null)}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleSelectLanguage}
      />

      {/* Warning Broadcast Dispatch Modal (Multilingual & Offline Queue Enabled) */}
      <BroadcastModal
        locations={locations}
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        onBroadcastSubmitted={handleBroadcastSubmitted}
        selectedLanguage={selectedLanguage}
        isOnline={isOnline}
      />
    </div>
  );
}
