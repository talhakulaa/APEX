
import React, { useState, useMemo } from 'react';
import { WorkoutRecord, WorkoutMode, BodyRegion, ModuleId } from '../types';
import { MODULE_UI_MAP } from '../services/uiColors';

interface JournalScreenProps {
  records: WorkoutRecord[];
  onBack: () => void;
  onUpdateRecord: (record: WorkoutRecord) => void;
}

const JournalScreen: React.FC<JournalScreenProps> = ({ records, onBack, onUpdateRecord }) => {
  const [filterMode, setFilterMode] = useState<WorkoutMode | 'Tümü'>('Tümü');
  const [filterRegion, setFilterRegion] = useState<BodyRegion | 'Tümü'>('Tümü');
  const [timeframe, setTimeframe] = useState<'7 Gün' | '30 Gün' | 'Tümü'>('Tümü');
  const [selectedRecord, setSelectedRecord] = useState<WorkoutRecord | null>(null);

  const filteredRecords = useMemo(() => {
    let result = [...records];
    const now = new Date();
    if (timeframe === '7 Gün') result = result.filter(r => (now.getTime() - new Date(r.date).getTime()) < 7 * 24 * 60 * 60 * 1000);
    else if (timeframe === '30 Gün') result = result.filter(r => (now.getTime() - new Date(r.date).getTime()) < 30 * 24 * 60 * 60 * 1000);
    if (filterMode !== 'Tümü') result = result.filter(r => r.mode === filterMode);
    if (filterRegion !== 'Tümü') result = result.filter(r => r.region === filterRegion);
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, filterMode, filterRegion, timeframe]);

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right duration-300 pb-24 h-full flex flex-col bg-app">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center active:scale-90 transition-all">
            <i className="fa-solid fa-arrow-left leading-none block"></i>
          </button>
          <h2 className="text-xl font-black uppercase text-main leading-none">Antrenman Günlüğü</h2>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {(['7 Gün', '30 Gün', 'Tümü'] as const).map(t => (
          <button key={t} onClick={() => setTimeframe(t)} className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase whitespace-nowrap transition-all border ${timeframe === t ? 'bg-green-500 text-white border-green-400 shadow-lg' : 'bg-slate-800/40 border-slate-700 text-slate-500 hover:text-slate-300'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {filteredRecords.length === 0 ? (
          <div className="p-16 text-center glass-card rounded-[2.5rem] border-dashed border-slate-700 opacity-40 mt-10">
            <i className="fa-solid fa-magnifying-glass text-4xl mb-3 leading-none block"></i>
            <p className="text-[10px] font-black uppercase tracking-widest">Kayıt Bulunamadı.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} onClick={() => setSelectedRecord(record)} className="glass-card p-5 rounded-[2rem] space-y-4 hover:border-green-500/40 transition-all cursor-pointer active:scale-[0.98]">
              <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-slate-800/50">
                    <i className={`fa-solid ${record.mode === WorkoutMode.WEIGHT ? 'fa-dumbbell text-green-500' : 'fa-heart-pulse text-blue-500'} leading-none block`}></i>
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase text-main tracking-widest leading-none mb-1">{record.region}</h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase leading-none">{new Date(record.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-main leading-none block mb-0.5">%{record.avgActivation}</span>
                  <p className="text-[9px] font-black opacity-40 uppercase tracking-tighter leading-none">{record.sets} SET</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedRecord && (
        <JournalDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} onUpdate={(updated) => { onUpdateRecord(updated); setSelectedRecord(null); }} />
      )}
    </div>
  );
};

const JournalDetailModal: React.FC<{ record: WorkoutRecord, onClose: () => void, onUpdate: (r: WorkoutRecord) => void }> = ({ record, onClose, onUpdate }) => {
  const [notes, setNotes] = useState(record.notes || '');

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 rounded-[3rem] p-8 space-y-6 shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-white uppercase leading-none">{record.region}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">{new Date(record.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 transition-colors">
            <i className="fa-solid fa-xmark text-lg leading-none"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {(Object.entries(record.moduleMetrics) as [ModuleId, any][]).map(([id, m]) => (
            <div key={id} className="flex flex-col gap-2">
              <div className="h-24 w-full glass-card rounded-2xl flex flex-col justify-end p-1 overflow-hidden">
                 <div className="w-full rounded-xl transition-all duration-1000" style={{ height: `${m.avg}%`, backgroundColor: MODULE_UI_MAP[id].hex }}></div>
              </div>
              <p className="text-[8px] font-black text-slate-500 text-center uppercase tracking-tighter">{id}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">NOTLAR</label>
           <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-32 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-5 text-sm font-bold text-white focus:outline-none focus:border-green-500 transition-all resize-none" placeholder="Antrenman detaylarını buraya ekleyin..." />
        </div>
        
        <button onClick={() => onUpdate({ ...record, notes })} className="w-full h-18 bg-green-500 text-white rounded-[2rem] font-black py-5 shadow-2xl active:scale-95 transition-all uppercase tracking-widest">DEĞİŞİKLİKLERİ KAYDET</button>
      </div>
    </div>
  );
};

export default JournalScreen;
