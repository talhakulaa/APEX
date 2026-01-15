
import { ModuleId } from '../types';

export const MODULE_UI_MAP = {
  [ModuleId.BLUE]: {
    bg: 'bg-blue-500',
    bgSoft: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500',
    borderSoft: 'border-blue-500/20',
    shadow: 'shadow-blue-500/40',
    hex: '#3b82f6'
  },
  [ModuleId.GREEN]: {
    bg: 'bg-green-500',
    bgSoft: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500',
    borderSoft: 'border-green-500/20',
    shadow: 'shadow-green-500/40',
    hex: '#22c55e'
  },
  [ModuleId.YELLOW]: {
    bg: 'bg-yellow-500',
    bgSoft: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    border: 'border-yellow-500',
    borderSoft: 'border-yellow-500/20',
    shadow: 'shadow-yellow-500/40',
    hex: '#eab308'
  },
  [ModuleId.RED]: {
    bg: 'bg-red-500',
    bgSoft: 'bg-red-500/10',
    text: 'text-red-500',
    border: 'border-red-500',
    borderSoft: 'border-red-500/20',
    shadow: 'shadow-red-500/40',
    hex: '#ef4444'
  }
};

// İkon ve buton hizalamaları için global yardımcı sınıflar
export const UI_STRINGS = {
  iconBase: "leading-none block",
  flexCenter: "flex items-center justify-center"
};
