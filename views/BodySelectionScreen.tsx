
import React, { useState } from 'react';
import { BodyRegion } from '../types';
import { UI_STRINGS } from '../services/uiColors';

interface BodySelectionScreenProps {
  onSelect: (region: BodyRegion) => void;
  onBack: () => void;
}

type ViewSide = 'FRONT' | 'BACK';

const BodySelectionScreen: React.FC<BodySelectionScreenProps> = ({ onSelect, onBack }) => {
  const [viewSide, setViewSide] = useState<ViewSide>('FRONT');

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-right duration-300 h-full flex flex-col bg-app">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center active:scale-90 transition-all border border-slate-700">
            <i className={`fa-solid fa-arrow-left ${UI_STRINGS.iconBase}`}></i>
          </button>
          <h2 className="text-xl font-black uppercase tracking-tight text-main">Antrenman Bölgesi</h2>
        </div>
        
        <div className="flex bg-slate-900/40 p-1 rounded-xl border border-slate-700/50">
          <button 
            onClick={() => setViewSide('FRONT')}
            className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${viewSide === 'FRONT' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-500'}`}
          >
            ÖN
          </button>
          <button 
            onClick={() => setViewSide('BACK')}
            className={`px-4 py-1.5 text-[9px] font-black rounded-lg transition-all ${viewSide === 'BACK' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-500'}`}
          >
            ARKA
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-slate-800/5 rounded-[3.5rem] border border-slate-700/20 overflow-hidden flex items-center justify-center shadow-inner group">
        {/* Mannequin Silhouette with subtle pulse */}
        <div className="relative h-[85%] aspect-[1/2.2] flex items-center justify-center opacity-10 pointer-events-none transition-all duration-700 scale-105">
          <i className={`fa-solid ${viewSide === 'FRONT' ? 'fa-person' : 'fa-person-walking-arrow-loop-left'} text-[360px] text-slate-400 ${UI_STRINGS.iconBase}`}></i>
        </div>

        {/* Selection Areas / Hotspots */}
        <div className="absolute inset-0 z-10 p-4">
          {viewSide === 'FRONT' ? (
            <>
              <Hotspot label="OMUZ" region={BodyRegion.SHOULDER} top="15%" left="22%" icon="fa-child-reaching" onSelect={onSelect} />
              <Hotspot label="OMUZ" region={BodyRegion.SHOULDER} top="15%" right="22%" icon="fa-child-reaching" onSelect={onSelect} />
              <Hotspot label="GÖĞÜS" region={BodyRegion.CHEST} top="25%" left="50%" tx="-50%" icon="fa-person-running" onSelect={onSelect} />
              <Hotspot label="KOL" region={BodyRegion.ARM} top="38%" left="12%" icon="fa-hand-fist" onSelect={onSelect} />
              <Hotspot label="KOL" region={BodyRegion.ARM} top="38%" right="12%" icon="fa-hand-fist" onSelect={onSelect} />
              <Hotspot label="KARIN" region={BodyRegion.ABS} top="46%" left="50%" tx="-50%" icon="fa-table-cells" onSelect={onSelect} />
              <Hotspot label="BACAK" region={BodyRegion.LEG} top="75%" left="30%" icon="fa-shoe-prints" onSelect={onSelect} />
              <Hotspot label="BACAK" region={BodyRegion.LEG} top="75%" right="30%" icon="fa-shoe-prints" onSelect={onSelect} />
            </>
          ) : (
            <>
              <Hotspot label="SIRT" region={BodyRegion.BACK} top="28%" left="50%" tx="-50%" icon="fa-arrows-left-right-to-line" onSelect={onSelect} />
              <Hotspot label="KOL" region={BodyRegion.ARM} top="38%" left="12%" icon="fa-hand-fist" onSelect={onSelect} />
              <Hotspot label="KOL" region={BodyRegion.ARM} top="38%" right="12%" icon="fa-hand-fist" onSelect={onSelect} />
              <Hotspot label="BACAK" region={BodyRegion.LEG} top="75%" left="30%" icon="fa-shoe-prints" onSelect={onSelect} />
              <Hotspot label="BACAK" region={BodyRegion.LEG} top="75%" right="30%" icon="fa-shoe-prints" onSelect={onSelect} />
            </>
          )}
        </div>
      </div>

      <div className="p-5 glass-card rounded-[2rem] border border-slate-700/30 flex items-center gap-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
           <i className={`fa-solid fa-hand-pointer text-xl ${UI_STRINGS.iconBase}`}></i>
        </div>
        <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
          {viewSide === 'FRONT' ? 'ÖN' : 'ARKA'} kas grubuna dokunun. Kalibrasyon seçiminize göre optimize edilecektir.
        </p>
      </div>
    </div>
  );
};

interface HotspotProps {
  label: string;
  region: BodyRegion;
  top: string;
  left?: string;
  right?: string;
  tx?: string;
  icon: string;
  onSelect: (r: BodyRegion) => void;
}

const Hotspot: React.FC<HotspotProps> = ({ label, region, top, left, right, tx = "0", icon, onSelect }) => (
  <button 
    onClick={() => onSelect(region)}
    className="absolute flex flex-col items-center gap-2 group active:scale-95 transition-all z-20"
    style={{ top, left, right, transform: `translateX(${tx})` }}
  >
    <div className="w-14 h-14 rounded-[1.25rem] bg-green-500/5 border border-green-500/20 backdrop-blur-md flex items-center justify-center text-slate-500 group-hover:text-green-500 group-hover:bg-green-500/20 group-hover:border-green-500/40 group-active:scale-90 transition-all shadow-lg group-hover:shadow-green-500/20">
      <i className={`fa-solid ${icon} text-xl ${UI_STRINGS.iconBase}`}></i>
    </div>
    <div className="px-3 py-1 bg-slate-900/90 rounded-lg border border-slate-800 shadow-xl opacity-80 group-hover:opacity-100 transition-opacity">
       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-500">
         {label}
       </span>
    </div>
  </button>
);

export default BodySelectionScreen;
