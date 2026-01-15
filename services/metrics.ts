
import { EmgDataPoint, ModuleId, ModuleSpecificMetrics, WorkoutRecord, BodyRegion, WorkoutMode } from '../types';

export const metricsService = {
  calculateModuleMetrics: (samples: EmgDataPoint[], moduleId: ModuleId): ModuleSpecificMetrics => {
    if (samples.length === 0) {
      return {
        avg: 0, peak: 0, contractions: 0, fatigueIndex: 0,
        timeInZones: { low: 0, medium: 0, high: 0, extreme: 0 }
      };
    }

    const values = samples.map(s => s[moduleId]);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const peak = Math.max(...values);

    // Contractions: Count peaks above 50% with at least 1s gap (approx 7 samples at 150ms)
    let contractions = 0;
    let inContraction = false;
    let coolingDown = 0;
    values.forEach(v => {
      if (coolingDown > 0) coolingDown--;
      if (v > 50 && !inContraction && coolingDown === 0) {
        contractions++;
        inContraction = true;
      } else if (v < 30) {
        inContraction = false;
        if (inContraction) coolingDown = 5;
      }
    });

    // Fatigue Index: Compare first half average with second half average
    const half = Math.floor(values.length / 2);
    const firstHalfAvg = values.slice(0, half).reduce((a, b) => a + b, 0) / half;
    const secondHalfAvg = values.slice(half).reduce((a, b) => a + b, 0) / (values.length - half);
    const fatigueIndex = firstHalfAvg > 0 ? (secondHalfAvg - firstHalfAvg) / firstHalfAvg : 0;

    // Time in Zones
    const zones = { low: 0, medium: 0, high: 0, extreme: 0 };
    values.forEach(v => {
      if (v < 30) zones.low++;
      else if (v < 60) zones.medium++;
      else if (v < 80) zones.high++;
      else zones.extreme++;
    });
    
    const total = values.length;
    return {
      avg: Math.round(avg),
      peak: Math.round(peak),
      contractions,
      fatigueIndex: parseFloat(fatigueIndex.toFixed(2)),
      timeInZones: {
        low: Math.round((zones.low / total) * 100),
        medium: Math.round((zones.medium / total) * 100),
        high: Math.round((zones.high / total) * 100),
        extreme: Math.round((zones.extreme / total) * 100),
      }
    };
  },

  calculateSymmetry: (blueAvg: number, greenAvg: number, yellowAvg: number, redAvg: number): number => {
    const left = blueAvg + greenAvg;
    const right = yellowAvg + redAvg;
    if (left + right === 0) return 0;
    // -100 to 100. 0 is perfect. Negative = Left Dominant, Positive = Right Dominant.
    return Math.round(((right - left) / (left + right)) * 100);
  },

  generateRecord: (
    samples: EmgDataPoint[], 
    mode: WorkoutMode, 
    region: BodyRegion, 
    duration: number, 
    sets: number
  ): WorkoutRecord => {
    const blueMetrics = metricsService.calculateModuleMetrics(samples, ModuleId.BLUE);
    const greenMetrics = metricsService.calculateModuleMetrics(samples, ModuleId.GREEN);
    const yellowMetrics = metricsService.calculateModuleMetrics(samples, ModuleId.YELLOW);
    const redMetrics = metricsService.calculateModuleMetrics(samples, ModuleId.RED);

    const overallAvg = Math.round(samples.reduce((a, b) => a + b.avg, 0) / (samples.length || 1));
    const overallPeak = Math.max(blueMetrics.peak, greenMetrics.peak, yellowMetrics.peak, redMetrics.peak);
    const symmetry = metricsService.calculateSymmetry(blueMetrics.avg, greenMetrics.avg, yellowMetrics.avg, redMetrics.avg);

    // Calculate Quality Score based on symmetry, fatigue, and intensity
    const intensityFactor = Math.min(100, overallAvg * 1.5);
    const symmetryFactor = 100 - Math.abs(symmetry);
    const qualityScore = Math.round((intensityFactor * 0.4) + (symmetryFactor * 0.6));

    return {
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      mode,
      region,
      duration,
      avgActivation: overallAvg,
      peakActivation: overallPeak,
      sets,
      notes: '',
      symmetryIndex: symmetry,
      qualityScore,
      moduleMetrics: {
        [ModuleId.BLUE]: blueMetrics,
        [ModuleId.GREEN]: greenMetrics,
        [ModuleId.YELLOW]: yellowMetrics,
        [ModuleId.RED]: redMetrics,
      }
    };
  }
};
