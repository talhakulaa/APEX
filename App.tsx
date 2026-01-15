
import React, { useState, useEffect } from 'react';
import { AppState, WorkoutMode, BodyRegion, WorkoutRecord, UserProfile, AppSettings, ModuleId, ModuleStatus } from './types';
import { storage } from './services/storage';
import { generateSampleRecordsForEmir } from './services/sampleData';
import { UI_STRINGS } from './services/uiColors';
import HomeScreen from './views/HomeScreen';
import BodySelectionScreen from './views/BodySelectionScreen';
import PlacementScreen from './views/PlacementScreen';
import WorkoutScreen from './views/WorkoutScreen';
import SummaryScreen from './views/SummaryScreen';
import AnalyticsScreen from './views/AnalyticsScreen';
import ProfileScreen from './views/ProfileScreen';
import SettingsScreen from './views/SettingsScreen';
import JournalScreen from './views/JournalScreen';

const INITIAL_MODULES: ModuleStatus[] = [
  { id: ModuleId.BLUE, color: 'blue-500', label: 'Modül 1', placed: false, battery: 92, connected: true, signal: 95 },
  { id: ModuleId.GREEN, color: 'green-500', label: 'Modül 2', placed: false, battery: 88, connected: true, signal: 92 },
  { id: ModuleId.YELLOW, color: 'yellow-500', label: 'Modül 3', placed: false, battery: 95, connected: true, signal: 98 },
  { id: ModuleId.RED, color: 'red-500', label: 'Modül 4', placed: false, battery: 84, connected: true, signal: 90 },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>(AppState.HOME);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => storage.loadSettings());
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([]);
  const [modules, setModules] = useState<ModuleStatus[]>(INITIAL_MODULES);
  const [selectedMode, setSelectedMode] = useState<WorkoutMode | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [lastWorkout, setLastWorkout] = useState<WorkoutRecord | null>(null);

  useEffect(() => {
    let profile = storage.loadProfile();
    let records = storage.loadRecords();
    
    const isEmir = (name: string) => name.trim().toLowerCase() === 'emir';

    if (!profile) {
      profile = {
        id: 'emir-001',
        name: 'Emir',
        goal: 'Kas Gelişimi',
        age: 28,
        height: 182,
        weight: 85,
        gender: 'Erkek',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storage.saveProfile(profile);
      records = generateSampleRecordsForEmir(new Date());
      storage.saveRecords(records);
    } else if (isEmir(profile.name) && records.length === 0) {
      records = generateSampleRecordsForEmir(new Date());
      storage.saveRecords(records);
    }

    setUserProfile(profile);
    setWorkoutRecords(records);
  }, []);

  const themeClass = settings.theme === 'dark' ? 'theme-dark' : 'theme-light';

  const navigateTo = (page: AppState) => {
    if (page === AppState.HOME || page === AppState.BODY_SELECTION) {
      setModules(INITIAL_MODULES);
    }
    setCurrentPage(page);
  };

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    storage.saveProfile(profile);
    navigateTo(AppState.HOME);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storage.saveSettings(updated);
  };

  const updateModuleStatus = (id: ModuleId, updates: Partial<ModuleStatus>) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const onWorkoutComplete = (record: WorkoutRecord) => {
    setLastWorkout(record);
    navigateTo(AppState.SUMMARY);
  };

  const handleSaveSummary = (finalRecord: WorkoutRecord) => {
    const updated = [finalRecord, ...workoutRecords];
    setWorkoutRecords(updated);
    storage.saveRecords(updated);
    navigateTo(AppState.HOME);
  };

  const handleUpdateRecord = (updatedRecord: WorkoutRecord) => {
    const updated = workoutRecords.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    setWorkoutRecords(updated);
    storage.saveRecords(updated);
  };

  const renderContent = () => {
    if (!userProfile && currentPage !== AppState.PROFILE) {
      return (
        <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-8 bg-app min-h-screen">
          <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-2xl shadow-green-500/20 rotate-3">
            <i className={`fa-solid fa-bolt-lightning ${UI_STRINGS.iconBase}`}></i>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-main uppercase tracking-tighter">MyoTrack</h2>
            <p className="text-xs text-sub font-bold uppercase tracking-widest opacity-60">Professional EMG Studio</p>
          </div>
          <button onClick={() => navigateTo(AppState.PROFILE)} className="w-full py-5 bg-green-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-green-500/20">BAŞLA</button>
        </div>
      );
    }

    switch (currentPage) {
      case AppState.HOME:
        return <HomeScreen user={userProfile!} records={workoutRecords} onStart={(mode) => { setSelectedMode(mode); navigateTo(AppState.BODY_SELECTION); }} onAnalytics={() => navigateTo(AppState.ANALYTICS)} onUpdateRecord={handleUpdateRecord} onJournal={() => navigateTo(AppState.JOURNAL)} />;
      case AppState.BODY_SELECTION:
        return <BodySelectionScreen onSelect={(r) => { setSelectedRegion(r); navigateTo(AppState.PLACEMENT); }} onBack={() => navigateTo(AppState.HOME)} />;
      case AppState.PLACEMENT:
        return <PlacementScreen region={selectedRegion!} modules={modules} onModulePlaced={(id) => updateModuleStatus(id, { placed: true })} onStart={() => navigateTo(AppState.WORKOUT)} onBack={() => navigateTo(AppState.BODY_SELECTION)} />;
      case AppState.WORKOUT:
        return <WorkoutScreen mode={selectedMode!} region={selectedRegion!} isDemo={settings.demoMode} onComplete={onWorkoutComplete} />;
      case AppState.SUMMARY:
        return lastWorkout ? <SummaryScreen record={lastWorkout} onDone={handleSaveSummary} /> : navigateTo(AppState.HOME);
      case AppState.ANALYTICS:
        return <AnalyticsScreen records={workoutRecords} onBack={() => navigateTo(AppState.HOME)} onJournal={() => navigateTo(AppState.JOURNAL)} />;
      case AppState.JOURNAL:
        return <JournalScreen records={workoutRecords} onBack={() => navigateTo(AppState.HOME)} onUpdateRecord={handleUpdateRecord} />;
      case AppState.PROFILE:
        return <ProfileScreen user={userProfile} onSave={updateProfile} onBack={() => userProfile ? navigateTo(AppState.HOME) : undefined} />;
      case AppState.SETTINGS:
        return <SettingsScreen settings={settings} onUpdate={updateSettings} onBack={() => navigateTo(AppState.HOME)} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${themeClass} max-w-md mx-auto min-h-screen flex flex-col relative border-x border-card-border bg-app overflow-hidden`}>
      <div className="px-4 py-2 flex justify-between items-center text-[10px] border-b border-card-border z-50 bg-app">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${settings.demoMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-sub font-bold uppercase tracking-widest">{settings.demoMode ? 'Simülasyon Aktif' : 'Sensörler Bağlı'}</span>
        </div>
        <div className="flex items-center gap-3">
          <i className={`fa-solid fa-signal opacity-50 text-sub ${UI_STRINGS.iconBase}`}></i>
          <i className={`fa-solid fa-battery-full text-green-500 ${UI_STRINGS.iconBase}`}></i>
        </div>
      </div>
      
      <main className="flex-1 overflow-y-auto bg-app">{renderContent()}</main>
      
      {userProfile && ![AppState.WORKOUT, AppState.SUMMARY, AppState.CALIBRATION].includes(currentPage) && (
        <nav className="h-20 border-t flex justify-around items-center px-4 bg-app border-card-border z-50 bg-opacity-95 backdrop-blur-lg">
          {[
            { id: AppState.HOME, icon: 'fa-house', label: 'Ev' },
            { id: AppState.JOURNAL, icon: 'fa-book', label: 'Günlük' },
            { id: 'CENTER', icon: 'fa-dumbbell', label: 'Workout' },
            { id: AppState.PROFILE, icon: 'fa-user', label: 'Profil' },
            { id: AppState.SETTINGS, icon: 'fa-gear', label: 'Ayarlar' }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => item.id === 'CENTER' ? navigateTo(AppState.BODY_SELECTION) : navigateTo(item.id as AppState)} 
              className={`flex flex-col items-center gap-1 transition-all ${item.id === 'CENTER' ? 'relative -top-6 w-14 h-14 bg-green-500 text-white rounded-2xl shadow-xl flex items-center justify-center' : (currentPage === item.id ? 'text-green-500 scale-105' : 'text-slate-500 opacity-60')}`}
            >
              <i className={`fa-solid ${item.icon} ${item.id === 'CENTER' ? 'text-2xl' : 'text-lg'} ${UI_STRINGS.iconBase}`}></i>
              {item.id !== 'CENTER' && <span className="text-[9px] uppercase font-black tracking-tighter leading-none">{item.label}</span>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;
