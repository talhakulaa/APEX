
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onBack?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onSave, onBack }) => {
  const [formData, setFormData] = useState<UserProfile>(user || {
    id: Math.random().toString(36).substring(2, 9),
    name: '',
    age: 25,
    height: 175,
    weight: 70,
    gender: 'Erkek',
    goal: 'Kas Gelişimi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const goals = ['Yağ Yakımı', 'Kas Gelişimi', 'Güç Artışı', 'Dayanıklılık'];
  const genders = ['Erkek', 'Kadın', 'Diğer'];

  const handleSave = () => {
    if (formData.name.trim().length < 2) return;
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  const isFormValid = formData.name.trim().length >= 2;

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right duration-300 h-full flex flex-col pb-10">
      <div className="flex items-center gap-4">
        {onBack && (
          <button onClick={onBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-slate-800">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}
        <h2 className="text-2xl font-black uppercase tracking-tight">{user ? 'Profil Düzenle' : 'Profil Oluştur'}</h2>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-widest">Tam Adınız</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-800/20 border border-slate-700/50 rounded-2xl p-4 focus:border-green-500 outline-none font-bold text-sm transition-all"
            placeholder="İsminiz nedir?"
          />
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-widest">Yaş</label>
            <input 
              type="number" 
              value={formData.age} 
              onChange={e => setFormData({...formData, age: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-800/20 border border-slate-700/50 rounded-2xl p-4 focus:border-green-500 outline-none font-bold text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-widest">Cinsiyet</label>
            <select 
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
              className="w-full bg-slate-800/20 border border-slate-700/50 rounded-2xl p-4 focus:border-green-500 outline-none font-bold text-sm transition-all appearance-none"
            >
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-widest">Boy (cm)</label>
            <input 
              type="number" 
              value={formData.height} 
              onChange={e => setFormData({...formData, height: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-800/20 border border-slate-700/50 rounded-2xl p-4 focus:border-green-500 outline-none font-bold text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-widest">Kilo (kg)</label>
            <input 
              type="number" 
              value={formData.weight} 
              onChange={e => setFormData({...formData, weight: parseInt(e.target.value) || 0})}
              className="w-full bg-slate-800/20 border border-slate-700/50 rounded-2xl p-4 focus:border-green-500 outline-none font-bold text-sm transition-all"
            />
          </div>
        </div>

        {/* Goal Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase opacity-50 px-1 tracking-widest">Ana Hedefiniz</label>
          <div className="grid grid-cols-2 gap-3">
            {goals.map(g => (
              <button 
                key={g} 
                onClick={() => setFormData({...formData, goal: g})}
                className={`p-4 rounded-2xl text-[10px] font-black border transition-all uppercase tracking-widest ${formData.goal === g ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/20' : 'glass-card opacity-60'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!isFormValid}
        className={`w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 shadow-xl mt-4 ${isFormValid ? 'bg-green-500 text-white shadow-green-500/30' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
      >
        {user ? 'BİLGİLERİ GÜNCELLE' : 'PROFİLİ TAMAMLA'}
      </button>
    </div>
  );
};

export default ProfileScreen;
