
import React, { useState, useMemo } from 'react';
import { WorkoutRecord } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

interface AnalyticsScreenProps {
  records: WorkoutRecord[];
  onBack: () => void;
  onJournal: () => void;
}

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ records, onBack, onJournal }) => {
  const [tab, setTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

  const analyticsData = useMemo(() => {
    const now = new Date();
    const hasRecords = records.length > 0;
    
    if (tab === 'Daily') {
      const hours = Array.from({ length: 12 }, (_, i) => ({ 
        name: `${(i + 4) * 2}:00`, 
        val: 0, 
        count: 0 
      }));
      
      records.forEach(r => {
        const d = new Date(r.date);
        if (d.toDateString() === now.toDateString()) {
          const hour = d.getHours();
          const bucket = Math.floor(hour / 2) - 2;
          if (bucket >= 0 && bucket < 12) {
            hours[bucket].val += r.avgActivation;
            hours[bucket].count++;
          }
        }
      });

      const finalData = hours.map(h => ({ 
        name: h.name, 
        val: h.count > 0 ? Math.round(h.val / h.count) : 0
      }));

      const activeDays = finalData.filter(d => d.val > 0).length;
      return {
        chartData: finalData,
        avg: activeDays > 0 ? Math.round(finalData.reduce((a, b) => a + b.val, 0) / activeDays) : 0,
        trend: hasRecords ? '+4.2%' : '—',
        isUp: true
      };
    } else if (tab === 'Weekly') {
      const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
      const weeklyData = days.map(d => ({ name: d, val: 0, count: 0 }));

      records.forEach(r => {
        const d = new Date(r.date);
        // Check if within last 7 days
        if (now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000) {
          const dayIdx = (d.getDay() + 6) % 7; 
          weeklyData[dayIdx].val += r.avgActivation;
          weeklyData[dayIdx].count++;
        }
      });

      const finalData = weeklyData.map(d => ({
        name: d.name,
        val: d.count > 0 ? Math.round(d.val / d.count) : 0
      }));

      const activeDays = finalData.filter(d => d.val > 0).length;
      return {
        chartData: finalData,
        avg: activeDays > 0 ? Math.round(finalData.reduce((a, b) => a + b.val, 0) / activeDays) : 0,
        trend: hasRecords ? '+12.4%' : '—',
        isUp: true
      };
    } else {
      const weeks = ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'];
      const monthlyData = weeks.map(w => ({ name: w, val: 0, count: 0 }));

      records.forEach(r => {
        const d = new Date(r.date);
        if (d.getMonth() === now.getMonth()) {
          const weekIdx = Math.floor((d.getDate() - 1) / 7);
          if (weekIdx < 4) {
            monthlyData[weekIdx].val += r.avgActivation;
            monthlyData[weekIdx].count++;
          }
        }
      });

      const finalData = monthlyData.map(w => ({
        name: w.name,
        val: w.count > 0 ? Math.round(w.val / w.count) : 0
      }));

      const activeWeeks = finalData.filter(d => d.val > 0).length;
      return {
        chartData: finalData,
        avg: activeWeeks > 0 ? Math.round(finalData.reduce((a, b) => a + b.val, 0) / activeWeeks) : 0,
        trend: hasRecords ? '-2.1%' : '—',
        isUp: false
      };
    }
  }, [tab, records]);

  const totalDurationSeconds = records.reduce((a, b) => a + b.duration, 0);
  const totalMinutes = Math.floor(totalDurationSeconds / 60);
  const totalSeconds = totalDurationSeconds % 60;

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-left duration-300 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-main uppercase tracking-tight">Gelişim Takibi</h2>
        <button onClick={onBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center border border-slate-700">
            <i className="fa-solid fa-arrow-left text-green-500"></i>
        </button>
      </div>

      <div className="flex p-1 bg-slate-950/20 rounded-2xl border border-card-border">
        {(['Daily', 'Weekly', 'Monthly'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${tab === t ? 'bg-green-500 text-white shadow-lg' : 'text-dim hover:text-sub'}`}
          >
            {t === 'Daily' ? 'Günlük' : t === 'Weekly' ? 'Haftalık' : 'Aylık'}
          </button>
        ))}
      </div>

      {/* Main Metric Card */}
      <div className="glass-card rounded-[2.5rem] p-6 space-y-4 relative overflow-hidden">
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <p className="text-[10px] text-sub font-black uppercase tracking-widest mb-1">
                  {tab === 'Daily' ? 'Günlük Ortalama' : tab === 'Weekly' ? 'Haftalık Ortalama' : 'Aylık Ortalama'}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-main">{analyticsData.avg > 0 ? `%${analyticsData.avg}` : '—'}</span>
                  <span className="text-[10px] text-dim font-black uppercase tracking-tighter">aktivasyon</span>
                </div>
            </div>
            {records.length > 0 && (
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black ${analyticsData.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  <i className={`fa-solid ${analyticsData.isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                  {analyticsData.trend}
              </div>
            )}
        </div>

        <div className="h-56 w-full mt-4 relative flex items-center justify-center">
          {records.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-30 z-20">
              <div className="w-16 h-16 bg-slate-800/50 rounded-3xl flex items-center justify-center border border-dashed border-slate-600">
                <i className="fa-solid fa-chart-simple text-3xl"></i>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-center leading-relaxed text-dim">
                Henüz veri bulunmuyor.<br/>Antrenman yaparak grafiği oluştur.
              </p>
            </div>
          ) : null}
          
          <div className={`w-full h-full transition-opacity duration-500 ${records.length === 0 ? 'opacity-5 blur-[2px]' : 'opacity-100'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 9, fill: '#64748b', fontWeight: 800}} 
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                  contentStyle={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: '16px', fontSize: '10px', color: 'var(--text-primary)', fontWeight: 'bold'}}
                  itemStyle={{color: '#22c55e'}}
                  labelStyle={{color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase'}}
                  formatter={(value: number) => [`%${value}`, 'Aktivasyon']}
                />
                <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={tab === 'Daily' ? 12 : 24}>
                  {analyticsData.chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.val > 75 ? '#ef4444' : entry.val > 40 ? '#22c55e' : '#3b82f6'} 
                      fillOpacity={entry.val === 0 ? 0.05 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="pt-4 flex justify-between items-center text-[8px] text-dim font-black uppercase tracking-widest border-t border-card-border">
          <span>Düşük Aktivasyon</span>
          <span>İdeal Bölge</span>
          <span>Zirve Seviye</span>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-[2rem] border-l-4 border-blue-500 shadow-sm">
           <div className="flex items-center gap-2 text-blue-500 mb-3">
             <i className="fa-solid fa-clock text-xs"></i>
             <span className="text-[9px] font-black uppercase tracking-widest">Toplam Süre</span>
           </div>
           <p className="text-2xl font-black text-main">
             {records.length > 0 ? (
               <>
                 {totalMinutes} <span className="text-[10px] text-dim uppercase">dk</span> {totalSeconds} <span className="text-[10px] text-dim uppercase">sn</span>
               </>
             ) : '—'}
           </p>
           <p className="text-[9px] text-dim mt-2 font-bold uppercase tracking-tight">Tüm kayıtlar toplamı</p>
        </div>
        <div className="glass-card p-5 rounded-[2rem] border-l-4 border-amber-500 shadow-sm">
           <div className="flex items-center gap-2 text-amber-500 mb-3">
             <i className="fa-solid fa-calendar-check text-xs"></i>
             <span className="text-[9px] font-black uppercase tracking-widest">Süreklilik</span>
           </div>
           <p className="text-2xl font-black text-main">
             {records.length > 0 ? (
               <>
                {records.length} <span className="text-[10px] text-dim uppercase">Antrenman</span>
               </>
             ) : '—'}
           </p>
           <p className="text-[9px] text-dim mt-2 font-bold uppercase tracking-tight">Kayıtlı oturum sayısı</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <h3 className="text-[10px] font-black text-dim uppercase tracking-widest">Son Aktiviteler</h3>
          <button onClick={onJournal} className="text-[9px] text-green-500 font-black uppercase hover:underline">Hepsini Gör</button>
        </div>
        
        <div className="space-y-3">
          {records.length === 0 ? (
             <div className="text-center py-12 glass-card rounded-[2.5rem] border-dashed border-card-border flex flex-col items-center gap-4 opacity-40">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-card-border">
                  <i className="fa-solid fa-clipboard-list text-slate-500 text-2xl"></i>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-dim">Antrenman günlüğü boş.</p>
             </div>
          ) : (
            records.slice(0, 5).map((r) => (
                <div key={r.id} className="glass-card p-4 rounded-3xl flex items-center justify-between border-card-border hover:border-green-500/30 transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${r.avgActivation > 70 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            <i className={`fa-solid ${r.mode === 'Ağırlık' ? 'fa-dumbbell' : 'fa-heart-pulse'}`}></i>
                        </div>
                        <div>
                            <p className="font-black text-sm text-main uppercase tracking-tight">{r.region}</p>
                            <p className="text-[9px] text-dim font-bold uppercase tracking-tighter">{new Date(r.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <span className="text-base font-black text-main">%{r.avgActivation}</span>
                          <i className="fa-solid fa-bolt text-[8px] text-amber-500"></i>
                        </div>
                        <p className="text-[8px] text-dim font-black uppercase tracking-widest">
                          {Math.floor(r.duration / 60)}dk {r.duration % 60}sn
                        </p>
                    </div>
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
