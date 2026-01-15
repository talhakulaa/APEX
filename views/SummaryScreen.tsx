
import React, { useState } from 'react';
import { WorkoutRecord, ModuleId } from '../types';
import { MODULE_UI_MAP } from '../services/uiColors';

interface SummaryScreenProps {
  record: WorkoutRecord;
  onDone: (finalRecord: WorkoutRecord) => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ record, onDone }) => {
  const [notes, setNotes] = useState(record.notes || '');

  const handleFinish = () => {
    onDone({ ...record, notes });
  };

  const getSymmetryLabel = (val: number) => {
    if (Math.abs(val) < 5) return 'Dengeli';
    if (val < 0) return 'Sol Baskın';
    return 'Sağ Baskın';
  };

  return (
    <div className="p-6 space-y-6 animate-in zoom-in duration-300 h-full flex flex-col pb-10 bg-app">
      <div className="text-center pt-2">
        <h2 className="text-2xl font-black uppercase tracking-tight text-main leading-none mb-1">Özet Analiz</h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-60">
          {new Date(record.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
        <div className="glass-card rounded-[2rem] p-5 border-t-4 border-t-green-500 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center text-2xl border border-green-500/20">
                <i className="fa-solid fa-award leading-none block"></i>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Skor</p>
                <p className="text-xl font-black text-main leading-none">%{record.qualityScore}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Simetri</p>
              <p className={`text-sm font-black leading-none ${Math.abs(record.symmetryIndex) < 10 ? 'text-green-500' : 'text-amber-500'}`}>
                {getSymmetryLabel(record.symmetryIndex)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'ORT', val: `%${record.avgActivation}`, color: 'text-green-500' },
              { label: 'ZİRVE', val: `%${record.peakActivation}`, color: 'text-main' },
              { label: 'SET', val: record.sets, color: 'text-main' }
            ].map((m, i) => (
              <div key={i} className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 text-center">
                <p className="text-[8px] font-black opacity-30 uppercase tracking-widest leading-none mb-1">{m.label}</p>
                <p className={`text-base font-black leading-none ${m.color}`}>{m.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {(Object.entries(record.moduleMetrics) as [ModuleId, any][]).map(([id, m]) => {
            const colors = MODULE_UI_MAP[id];
            return (
              <div key={id} className="glass-card rounded-[2rem] p-4 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 -mr-8 -mt-8 rounded-full" style={{ backgroundColor: colors.hex }}></div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colors.bgSoft} ${colors.text}`}>
                      <i className="fa-solid fa-microchip text-xs leading-none"></i>
                    </div>
                    <h4 className={`text-xs font-black uppercase leading-none ${colors.text}`}>{id} MODÜL</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-slate-500 font-black uppercase leading-none mb-0.5">Yorgunluk</p>
                    <p className={`text-xs font-black leading-none ${m.fatigueIndex < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      %{Math.round(Math.abs(m.fatigueIndex * 100))}
                    </p>
                  </div>
                </div>
                <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-900/50 border border-slate-800/50">
                  <div className="h-full bg-blue-500/40" style={{ width: `${m.timeInZones.low}%` }}></div>
                  <div className="h-full bg-green-500/60" style={{ width: `${m.timeInZones.medium}%` }}></div>
                  <div className="h-full bg-amber-500/80" style={{ width: `${m.timeInZones.high}%` }}></div>
                  <div className="h-full bg-red-500" style={{ width: `${m.timeInZones.extreme}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notlarınızı buraya yazın..."
          className="w-full h-28 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-4 text-sm font-bold text-main focus:outline-none focus:border-green-500 transition-all resize-none"
        />
      </div>

      <button onClick={handleFinish} className="w-full h-16 bg-green-500 text-white rounded-[1.5rem] font-black text-lg mt-auto shadow-xl active:scale-95 transition-all">ANALİZİ TAMAMLA</button>
    </div>
  );
};

export default SummaryScreen;
