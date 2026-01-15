
import React, { useState, useMemo } from 'react';
import { BodyRegion, ModuleStatus, ModuleId } from '../types';
import { MODULE_UI_MAP } from '../services/uiColors';

interface PlacementScreenProps {
  region: BodyRegion;
  modules: ModuleStatus[];
  onModulePlaced: (id: ModuleId) => void;
  onStart: () => void;
  onBack: () => void;
}

const getPlacementCoordinates = (region: BodyRegion) => {
  return [
    { id: ModuleId.BLUE, x: -35, y: -45, label: 'Üst Sol' },
    { id: ModuleId.GREEN, x: 35, y: -45, label: 'Üst Sağ' },
    { id: ModuleId.YELLOW, x: -35, y: 35, label: 'Alt Sol' },
    { id: ModuleId.RED, x: 35, y: 35, label: 'Alt Sağ' },
  ];
};

const PlacementScreen: React.FC<PlacementScreenProps> = ({ region, modules, onModulePlaced, onStart, onBack }) => {
  const [step, setStep] = useState(1);
  const [calibrating, setCalibrating] = useState(false);
  const [calibProgress, setCalibProgress] = useState(0);

  const placementSpots = useMemo(() => getPlacementCoordinates(region), [region]);
  const allPlaced = modules.every(m => m.placed);

  const startCalibration = () => {
    setCalibrating(true); setCalibProgress(0);
    const interval = window.setInterval(() => {
      setCalibProgress(prev => {
        if (prev >= 100) { window.clearInterval(interval); setCalibrating(false); setStep(3); return 100; }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div className="p-6 flex flex-col h-full space-y-6 animate-in slide-in-from-bottom duration-500 pb-10 bg-app">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center active:scale-90 transition-all">
          <i className="fa-solid fa-arrow-left leading-none block"></i>
        </button>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-main">{region} Yerleşimi</h2>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Adım {step}/3</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative bg-slate-800/10 rounded-[3rem] border border-slate-700/20 p-8 min-h-[350px] shadow-inner">
        <div className="relative w-full aspect-[4/5] flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none">
                <i className="fa-solid fa-person text-[320px] text-slate-400"></i>
            </div>
            <div className="relative z-0 w-64 h-80 border-2 border-dashed border-slate-700/30 rounded-[4rem] flex items-center justify-center">
                {placementSpots.map((spot, i) => {
                  const module = modules.find(m => m.id === spot.id);
                  const colors = MODULE_UI_MAP[spot.id];
                  return (
                    <div key={spot.id} className={`absolute w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${module?.placed ? 'active-neon scale-110' : 'bg-slate-900/60 border border-slate-700'}`}
                      style={{ transform: `translate(${spot.x}px, ${spot.y}px)`, backgroundColor: module?.placed ? colors.hex : undefined }}>
                      <span className={`text-xs font-black leading-none ${module?.placed ? 'text-white' : 'text-slate-600'}`}>{module?.placed ? <i className="fa-solid fa-check"></i> : (i + 1)}</span>
                    </div>
                  );
                })}
            </div>
        </div>

        <div className="w-full mt-6 space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {modules.map((m, idx) => {
                   const colors = MODULE_UI_MAP[m.id];
                   return (
                    <button key={m.id} onClick={() => onModulePlaced(m.id)} disabled={m.placed} className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${m.placed ? 'bg-slate-800/40 border-slate-700 opacity-50' : 'glass-card border-slate-700/50 active:scale-95'}`}>
                      <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase leading-none text-main">{placementSpots[idx].label}</p>
                        <p className="text-[8px] font-bold opacity-40 uppercase tracking-tighter mt-1">{m.placed ? 'OK' : 'Takın'}</p>
                      </div>
                    </button>
                   );
                })}
              </div>
              <button onClick={() => setStep(2)} disabled={!allPlaced} className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all ${allPlaced ? 'bg-green-500 text-white active:scale-95' : 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed'}`}>
                {allPlaced ? 'KALİBRASYONA GEÇ' : 'TÜM MODÜLLERİ TAKIN'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-green-500/20">
                  <i className="fa-solid fa-gauge-high text-2xl leading-none"></i>
                </div>
                <h3 className="font-black text-lg uppercase tracking-tight text-main leading-none">MVC Kalibrasyonu</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-snug">Kasınızı 3 saniye boyunca<br/>tüm gücünüzle kasın.</p>
                {calibrating ? (
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                    <div className="h-full bg-green-500 transition-all duration-200" style={{ width: `${calibProgress}%` }}></div>
                  </div>
                ) : (
                  <button onClick={startCalibration} className="w-full py-5 bg-green-500 text-white rounded-2xl font-black shadow-lg active:scale-95 transition-all uppercase tracking-widest">BAŞLAT</button>
                )}
            </div>
          )}

          {step === 3 && (
             <div className="space-y-8 text-center animate-in bounce-in duration-500">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
                    <div className="relative z-10 w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl text-5xl">
                        <i className="fa-solid fa-check leading-none"></i>
                    </div>
                </div>
                <h3 className="font-black text-2xl text-green-500 uppercase tracking-tight leading-none">Sistem Hazır!</h3>
                <button onClick={onStart} className="w-full py-6 bg-green-500 text-white rounded-2xl font-black text-base shadow-2xl active:scale-95 uppercase tracking-widest transition-all">ANTRENMANI BAŞLAT</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementScreen;
