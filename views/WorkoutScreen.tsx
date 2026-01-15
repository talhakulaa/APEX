
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BodyRegion, WorkoutMode, EmgDataPoint, WorkoutRecord, ModuleId } from '../types';
import { EmgProcessor } from '../services/emgProcessor';
import { metricsService } from '../services/metrics';
import { UI_STRINGS, MODULE_UI_MAP } from '../services/uiColors';

interface WorkoutScreenProps {
  mode: WorkoutMode;
  region: BodyRegion;
  onComplete: (record: WorkoutRecord) => void;
  isDemo: boolean;
}

type SimulationMode = 'AUTO' | 'MANUAL' | 'OFF';

// Grafik için genişletilmiş veri tipi
interface StreamPoint extends EmgDataPoint {
  t: number; // Başlangıçtan itibaren saniye
}

const MODULES: ModuleId[] = [ModuleId.BLUE, ModuleId.GREEN, ModuleId.YELLOW, ModuleId.RED];

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ mode, region, onComplete, isDemo }) => {
  const [seconds, setSeconds] = useState(0);
  const [sets, setSets] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isContracting, setIsContracting] = useState(false);
  const [simMode, setSimMode] = useState<SimulationMode>(isDemo ? 'AUTO' : 'OFF');
  const [streamData, setStreamData] = useState<StreamPoint[]>([]);
  
  const processor = useMemo(() => new EmgProcessor(), []);
  const startMsRef = useRef<number>(Date.now());
  const fullHistoryRef = useRef<EmgDataPoint[]>([]);
  const rollingBufferRef = useRef<StreamPoint[]>([]);
  const finishedRef = useRef(false);
  
  const timerRef = useRef<number | null>(null);
  const dataStreamRef = useRef<number | null>(null);
  const simCounterRef = useRef(0);

  const TICK_INTERVAL = 150;
  const CYCLE_TICKS = 40; // 6s total
  const CONTRACTION_TICKS = 14; // ~2.1s
  const MAX_POINTS = 300; // Son 300 nokta (~45 saniye)

  // Çizelge (Grid) Ayarları
  const GRID_COLS = 24; 
  const WINDOW_SAMPLES = 80; // ~12 saniye (80 * 150ms)

  // Süre Sayacı
  useEffect(() => {
    if (isActive && !finishedRef.current) {
      timerRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  // Veri Akışı ve Simülasyon
  useEffect(() => {
    if (isActive && !finishedRef.current && simMode !== 'OFF') {
      dataStreamRef.current = window.setInterval(() => {
        let currentContraction = isContracting;

        if (simMode === 'AUTO') {
          simCounterRef.current = (simCounterRef.current + 1) % CYCLE_TICKS;
          currentContraction = simCounterRef.current < CONTRACTION_TICKS;
          setIsContracting(currentContraction);
        }

        const rawInputs = (isDemo) ? 
          EmgProcessor.generate4ChannelDemo(Date.now(), currentContraction) : 
          [Math.random()*10, Math.random()*10, Math.random()*10, Math.random()*10];
        
        const point = processor.processRaw(rawInputs);
        fullHistoryRef.current.push(point);

        const relTime = parseFloat(((Date.now() - startMsRef.current) / 1000).toFixed(1));
        const newStreamPoint: StreamPoint = { ...point, t: relTime };

        rollingBufferRef.current = [...rollingBufferRef.current, newStreamPoint].slice(-MAX_POINTS);
        setStreamData(rollingBufferRef.current);
      }, TICK_INTERVAL);
    } else {
      if (dataStreamRef.current) clearInterval(dataStreamRef.current);
    }
    return () => { if (dataStreamRef.current) clearInterval(dataStreamRef.current); };
  }, [isActive, simMode, isContracting, processor, isDemo]);

  const handleFinish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    if (dataStreamRef.current) clearInterval(dataStreamRef.current);
    const record = metricsService.generateRecord(fullHistoryRef.current, mode, region, seconds, sets);
    onComplete(record);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const cycleProgress = (simCounterRef.current / CYCLE_TICKS) * 100;

  // Çizelge (Grid) Verisi Hesaplama
  const gridRows = useMemo(() => {
    const subset = streamData.slice(-WINDOW_SAMPLES);
    if (subset.length === 0) return null;

    const step = Math.max(1, subset.length / GRID_COLS);
    
    return MODULES.map(id => {
      const cells = Array.from({ length: GRID_COLS }, (_, i) => {
        const sampleIdx = Math.min(Math.floor(i * step), subset.length - 1);
        return subset[sampleIdx]?.[id] || 0;
      });

      const lastValue = subset[subset.length - 1][id];
      let level = 'DÜŞÜK';
      if (lastValue >= 80) level = 'ZİRVE';
      else if (lastValue >= 60) level = 'YÜKSEK';
      else if (lastValue >= 30) level = 'ORTA';

      return { id, cells, lastValue, level };
    });
  }, [streamData]);

  return (
    <div className="flex flex-col h-full p-4 space-y-4 select-none relative bg-app">
      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 rounded-[1.5rem] text-center border-t-4 border-t-green-500 shadow-lg flex flex-col items-center justify-center">
          <p className="text-[10px] opacity-40 font-black uppercase tracking-widest leading-none">Süre</p>
          <p className="text-xl font-mono font-black text-green-500 leading-none mt-2">{formatTime(seconds)}</p>
        </div>
        <div className="glass-card p-4 rounded-[1.5rem] text-center flex flex-col items-center justify-center">
          <p className="text-[10px] opacity-40 font-black uppercase tracking-widest leading-none">Setler</p>
          <p className="text-xl font-black leading-none mt-2">{sets}</p>
        </div>
        <div className="glass-card p-4 rounded-[1.5rem] text-center border-t-4 border-t-blue-500 shadow-lg flex flex-col items-center justify-center">
          <p className="text-[10px] opacity-40 font-black uppercase tracking-widest leading-none">Bölge</p>
          <p className="text-xs font-black truncate leading-none mt-2">{region}</p>
        </div>
      </div>

      {/* Canlı Akış Kartı */}
      <div className="flex-1 glass-card rounded-[2.5rem] p-6 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 z-10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${!isActive ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></div>
            <div className="flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Live EMG Stream</h3>
              <div className={`flex items-center gap-1.5 mt-1.5 ${isContracting ? 'text-green-500' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${isContracting ? 'bg-green-500 animate-ping' : 'bg-slate-600'}`}></span>
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                  Sinyal: {simMode === 'OFF' ? 'PASİF' : (isContracting ? 'KASILMA' : 'BEKLEME')}
                </span>
              </div>
            </div>
          </div>
          
          {isDemo && (
            <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/50">
              {(['AUTO', 'MANUAL', 'OFF'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => {
                    setSimMode(m);
                    if (m !== 'AUTO') { setIsContracting(false); simCounterRef.current = 0; }
                  }}
                  className={`px-3 py-2 text-[8px] font-black rounded-xl transition-all ${simMode === m ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {simMode === 'AUTO' && (
          <div className="absolute top-20 left-6 right-6 h-1 bg-slate-800/50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-150" style={{ width: `${cycleProgress}%` }}></div>
          </div>
        )}

        {/* Grafik Konteyneri */}
        <div className="w-full h-[220px] relative mt-2">
          {streamData.length < 2 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-30">
              <i className={`fa-solid fa-satellite-dish text-5xl animate-bounce ${UI_STRINGS.iconBase}`}></i>
              <p className="text-xs font-black uppercase tracking-widest">Sinyal Bekleniyor...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={streamData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} minTickGap={40} tickFormatter={(val) => `${val}s`} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 800 }} tickFormatter={(val) => `%${val}`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px' }} labelStyle={{ color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }} labelFormatter={(l) => `Zaman: ${l}s`} formatter={(v: number) => [`%${Math.round(v)}`, 'Aktivasyon']} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingTop: '15px' }} />
                <Line name="M1" type="monotone" dataKey="BLUE" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line name="M2" type="monotone" dataKey="GREEN" stroke="#22c55e" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line name="M3" type="monotone" dataKey="YELLOW" stroke="#eab308" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line name="M4" type="monotone" dataKey="RED" stroke="#ef4444" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Kas Aktivasyonu Çizelgesi (Heat Grid) */}
        <div className="mt-6 pt-6 border-t border-slate-800/60">
           <div className="flex items-center justify-between mb-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kas Aktivasyonu Çizelgesi</p>
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Son ~12 Saniye</p>
           </div>

           <div className="space-y-3">
             {gridRows ? gridRows.map(row => (
               <div key={row.id} className="grid grid-cols-[70px_1fr_42px_55px] gap-2 items-center">
                 <div className="flex items-center gap-2">
                   <div className={`w-2.5 h-2.5 rounded-full ${MODULE_UI_MAP[row.id].bg}`}></div>
                   <span className={`text-[10px] font-black ${MODULE_UI_MAP[row.id].text} tracking-tight`}>{row.id}</span>
                 </div>

                 <div className="flex gap-0.5 h-3.5 overflow-hidden">
                   {row.cells.map((val, idx) => (
                     <div 
                        key={idx} 
                        className="flex-1 rounded-[2px]" 
                        style={{ 
                          backgroundColor: MODULE_UI_MAP[row.id].hex,
                          opacity: 0.12 + (0.88 * (val / 100))
                        }}
                     />
                   ))}
                 </div>

                 <div className="text-[10px] font-black text-slate-200 text-right">%{Math.round(row.lastValue)}</div>
                 <div className="text-[8px] font-black text-slate-500 text-right uppercase tracking-tighter truncate">{row.level}</div>
               </div>
             )) : (
               <div className="h-24 flex items-center justify-center opacity-20 border border-dashed border-slate-700 rounded-2xl">
                 <p className="text-[9px] font-black uppercase tracking-widest">Çizelge Verisi Hazırlanıyor...</p>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Alt Kontroller */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setIsActive(!isActive)} className={`h-20 rounded-[2rem] font-black flex items-center justify-center gap-4 transition-all border-2 shadow-xl ${isActive ? 'glass-card border-slate-700 text-slate-400' : 'bg-green-500 border-green-400 text-white active:scale-95'}`}>
          <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'} text-2xl ${UI_STRINGS.iconBase}`}></i>
          <span className="text-sm uppercase tracking-widest">{isActive ? 'DURDUR' : 'BAŞLAT'}</span>
        </button>
        <button onClick={() => setSets(s => s + 1)} className="h-20 glass-card rounded-[2rem] font-black flex flex-col items-center justify-center active:scale-95 border-b-4 border-slate-700 shadow-xl">
          <span className="text-[10px] opacity-40 uppercase tracking-widest leading-none mb-1">Set Ekle</span>
          <span className="text-xl leading-none">SET #{sets + 1}</span>
        </button>
      </div>

      <button onClick={handleFinish} className="h-24 bg-red-600 hover:bg-red-500 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl active:scale-[0.98] flex items-center justify-center gap-6 transition-all uppercase tracking-tight">
        <i className={`fa-solid fa-flag-checkered text-3xl ${UI_STRINGS.iconBase}`}></i>
        ANTRENMANI BİTİR
      </button>
    </div>
  );
};

export default WorkoutScreen;
