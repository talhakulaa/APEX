
import React, { useMemo, useState } from 'react';
import { WorkoutMode, UserProfile, WorkoutRecord, BodyRegion, ModuleId } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  records: WorkoutRecord[];
  onStart: (mode: WorkoutMode) => void;
  onAnalytics: () => void;
  onJournal: () => void;
  onUpdateRecord: (record: WorkoutRecord) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, records, onStart, onAnalytics, onJournal, onUpdateRecord }) => {
  const [selectedRecord, setSelectedRecord] = useState<WorkoutRecord | null>(null);

  const regionalProgress = useMemo(() => {
    const now = new Date();
    const last7DaysStart = now.getTime() - 7 * 24 * 60 * 60 * 1000;

    const getVolumeScore = (recordsSubset: WorkoutRecord[]) => 
      recordsSubset.reduce((acc, r) => acc + (r.sets * r.avgActivation * (r.duration / 60)), 0);

    return Object.values(BodyRegion).map(region => {
      const regionRecords = records.filter(r => r.region === region);
      const currentScore = getVolumeScore(regionRecords.filter(r => new Date(r.date).getTime() >= last7DaysStart));
      const score = Math.min(100, Math.round((currentScore / 2500) * 100));
      return { region, score, active: currentScore > 0 };
    }).sort((a, b) => b.score - a.score);
  }, [records]);

  const recentWorkouts = useMemo(() => 
    [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  , [records]);

  return (
    <div className="p-6 space-y-6 pb-24 bg-app min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-main">Selam, {user.name.split(' ')[0]}</h1>
          <p className="text-[10px] text-sub uppercase font-bold tracking-widest">{user.goal}</p>
        </div>
        <div onClick={onAnalytics} className="w-10 h-10 glass-card rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-all">
          <i className="fa-solid fa-chart-line text-green-500"></i>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onStart(WorkoutMode.WEIGHT)} className="glass-card p-5 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500/20">
            <i className="fa-solid fa-dumbbell text-xl"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-main">Ağırlık</span>
        </button>
        <button onClick={() => onStart(WorkoutMode.CARDIO)} className="glass-card p-5 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20">
            <i className="fa-solid fa-heart-pulse text-xl"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-main">Kardiyo</span>
        </button>
      </div>

      <div className="glass-card rounded-[2.5rem] p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase text-sub tracking-widest">Haftalık Bölgesel Hacim</h3>
          <span onClick={onAnalytics} className="text-[8px] text-green-500 font-black cursor-pointer uppercase hover:underline">Detaylar</span>
        </div>
        <div className="space-y-4">
          {regionalProgress.filter(p => p.active).length === 0 ? (
            <div className="text-center py-6 opacity-40">
               <i className="fa-solid fa-chart-simple text-2xl mb-2"></i>
               <p className="text-[9px] font-black uppercase">Veri bulunmuyor</p>
            </div>
          ) : (
            regionalProgress.filter(p => p.active).slice(0, 3).map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                  <span className="text-main">{p.region}</span>
                  <span className="text-green-500">%{p.score}</span>
                </div>
                <div className="h-2 w-full bg-slate-800/40 rounded-full overflow-hidden border border-slate-700/10">
                  <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${p.score}%` }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black uppercase text-sub tracking-widest">Son Antrenmanlar</h3>
          <span onClick={onJournal} className="text-[8px] text-green-500 font-black cursor-pointer uppercase hover:underline">Tümü</span>
        </div>
        <div className="space-y-3">
          {recentWorkouts.map(r => (
            <div key={r.id} onClick={() => setSelectedRecord(r)} className="glass-card p-4 rounded-3xl flex justify-between items-center cursor-pointer active:scale-98 transition-all hover:border-green-500/30">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg ${r.mode === WorkoutMode.WEIGHT ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  <i className={`fa-solid ${r.mode === WorkoutMode.WEIGHT ? 'fa-dumbbell' : 'fa-heart-pulse'}`}></i>
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight text-main">{r.region}</p>
                  <p className="text-[9px] text-dim font-bold uppercase">{new Date(r.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-green-500">%{r.avgActivation}</span>
                <p className="text-[8px] text-dim font-black uppercase">{r.sets} SET</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full glass-card rounded-[2.5rem] p-7 space-y-5 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <i className="fa-solid fa-clipboard-list"></i>
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-main">{selectedRecord.region} Analizi</h2>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-white hover:bg-red-500/20 transition-all">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <textarea 
              value={selectedRecord.notes} 
              onChange={(e) => onUpdateRecord({...selectedRecord, notes: e.target.value})}
              placeholder="Antrenman hakkında notlar ekleyin..."
              className="w-full h-32 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-green-500 transition-all resize-none font-medium"
            />
            <button onClick={() => setSelectedRecord(null)} className="w-full py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">DEĞİŞİKLİKLERİ KAYDET</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
