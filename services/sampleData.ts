
import { WorkoutRecord, BodyRegion, WorkoutMode, ModuleId, ModuleSpecificMetrics } from '../types';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateModuleMetrics(avg: number, peak: number): ModuleSpecificMetrics {
  const mAvg = Math.max(0, Math.min(100, avg + getRandomInt(-8, 8)));
  const mPeak = Math.max(mAvg, Math.min(100, peak + getRandomInt(-12, 5)));
  
  let low = 30; let med = 40; let high = 20; let extreme = 10;
  if (avg > 65) { low = 5; med = 15; high = 45; extreme = 35; }
  else if (avg < 45) { low = 60; med = 25; high = 10; extreme = 5; }

  return {
    avg: mAvg,
    peak: mPeak,
    contractions: getRandomInt(12, 30),
    fatigueIndex: parseFloat((Math.random() * 0.6 - 0.3).toFixed(2)),
    timeInZones: { low, medium: med, high, extreme }
  };
}

export function generateSampleRecordsForEmir(now: Date): WorkoutRecord[] {
  const records: WorkoutRecord[] = [];
  const regions = Object.values(BodyRegion);
  const modes = Object.values(WorkoutMode);

  const createRecord = (date: Date, region: BodyRegion, mode: WorkoutMode) => {
    const avg = getRandomInt(40, 80);
    const peak = getRandomInt(avg + 15, 99);
    const duration = getRandomInt(1200, 3000); 
    const sets = mode === WorkoutMode.WEIGHT ? getRandomInt(3, 8) : getRandomInt(1, 3);
    const symmetry = getRandomInt(-30, 30); // İstenen -30/+30 aralığı
    
    return {
      id: Math.random().toString(36).substring(2, 11),
      date: date.toISOString(),
      mode,
      region,
      duration,
      avgActivation: avg,
      peakActivation: peak,
      sets,
      notes: 'Antrenman verileri stabil, hedef bölge aktivasyonu başarılı.',
      symmetryIndex: symmetry,
      qualityScore: getRandomInt(65, 98),
      moduleMetrics: {
        [ModuleId.BLUE]: generateModuleMetrics(avg, peak),
        [ModuleId.GREEN]: generateModuleMetrics(avg, peak),
        [ModuleId.YELLOW]: generateModuleMetrics(avg, peak),
        [ModuleId.RED]: generateModuleMetrics(avg, peak),
      }
    };
  };

  // 1. TODAY (Daily View) - 2 records
  const d1 = new Date(now); d1.setHours(10, 0, 0);
  records.push(createRecord(d1, BodyRegion.CHEST, WorkoutMode.WEIGHT));
  
  const d2 = new Date(now); d2.setHours(19, 30, 0);
  records.push(createRecord(d2, BodyRegion.ARM, WorkoutMode.WEIGHT));

  // 2. LAST 7 DAYS (Weekly View) - 6 records
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now); d.setDate(now.getDate() - i);
    d.setHours(getRandomInt(9, 21));
    records.push(createRecord(d, regions[i % regions.length], modes[i % 2]));
  }

  // 3. MONTHLY (Remaining) - ~10 more records
  for (let i = 8; i <= 28; i += 2) {
    if (records.length >= 18) break;
    const d = new Date(now); d.setDate(now.getDate() - i);
    d.setHours(getRandomInt(8, 22));
    records.push(createRecord(d, regions[getRandomInt(0, regions.length - 1)], modes[getRandomInt(0, 1)]));
  }

  return records;
}
