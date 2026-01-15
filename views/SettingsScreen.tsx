
import React from 'react';
import { AppSettings } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ settings, onUpdate, onBack }) => {
  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right duration-300 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-slate-800 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-green-500"></i>
        </button>
        <h2 className="text-2xl font-black uppercase tracking-tight text-main">Ayarlar</h2>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-dim px-1">Tercihler</h3>
        
        {/* Appearance Section */}
        <div className="glass-card p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${settings.theme === 'dark' ? 'bg-slate-800 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
              <i className={`fa-solid ${settings.theme === 'dark' ? 'fa-moon' : 'fa-sun'} text-xl`}></i>
            </div>
            <div>
              <span className="font-black text-sm uppercase tracking-tight text-main">Tema Modu</span>
              <p className="text-[10px] text-sub font-bold uppercase">{settings.theme === 'dark' ? 'Karanlık' : 'Aydınlık'}</p>
            </div>
          </div>
          <button 
            onClick={() => onUpdate({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.theme === 'dark' ? 'bg-green-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Demo Mode Section */}
        <div className="glass-card p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${settings.demoMode ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-dim'}`}>
              <i className="fa-solid fa-flask text-xl"></i>
            </div>
            <div>
              <span className="font-black text-sm uppercase tracking-tight text-main">Simülasyon</span>
              <p className="text-[10px] text-sub font-bold uppercase">{settings.demoMode ? 'Demo Aktif' : 'Cihaz Modu'}</p>
            </div>
          </div>
          <button 
            onClick={() => onUpdate({ demoMode: !settings.demoMode })}
            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.demoMode ? 'bg-amber-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.demoMode ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Notifications Section */}
        <div className="glass-card p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${settings.notifications ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-dim'}`}>
              <i className="fa-solid fa-bell text-xl"></i>
            </div>
            <div>
              <span className="font-black text-sm uppercase tracking-tight text-main">Bildirimler</span>
              <p className="text-[10px] text-sub font-bold uppercase">{settings.notifications ? 'Açık' : 'Kapalı'}</p>
            </div>
          </div>
          <button 
            onClick={() => onUpdate({ notifications: !settings.notifications })}
            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${settings.notifications ? 'bg-blue-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${settings.notifications ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      <div className="p-8 glass-card rounded-[2.5rem] border-dashed border-slate-700/50 text-center space-y-3 mt-10">
        <div className="w-12 h-12 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-2 text-dim border border-card-border">
          <i className="fa-solid fa-code text-xl"></i>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-sub">Versiyon 2.5.4-STABLE</p>
        <p className="text-[9px] text-dim font-bold">MyoTrack Engine v5.1.0-Release</p>
        <p className="text-[8px] text-dim opacity-40 mt-4 leading-relaxed italic">"Gelişim, verinin doğru analizi ile başlar."</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
