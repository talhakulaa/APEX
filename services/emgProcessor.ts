
import { EmgDataPoint } from '../types';

export class EmgProcessor {
  private windowSize: number = 20;
  private buffers: number[][] = [[], [], [], []];
  private mvcValues: number[] = [1000, 1000, 1000, 1000];

  public setMvc(channel: number, value: number) {
    this.mvcValues[channel] = value > 0 ? value : 1000;
  }

  public processRaw(raws: number[]): EmgDataPoint {
    const activations = raws.map((raw, i) => {
      const rectified = Math.abs(raw);
      this.buffers[i].push(rectified);
      if (this.buffers[i].length > this.windowSize) {
        this.buffers[i].shift();
      }
      const sumOfSquares = this.buffers[i].reduce((acc, val) => acc + (val * val), 0);
      const rms = Math.sqrt(sumOfSquares / this.buffers[i].length);
      return Math.min(100, (rms / this.mvcValues[i]) * 100);
    });

    const avg = activations.reduce((a, b) => a + b, 0) / 4;

    return {
      timestamp: Date.now(),
      BLUE: activations[0],
      GREEN: activations[1],
      YELLOW: activations[2],
      RED: activations[3],
      avg: avg
    };
  }

  public static generate4ChannelDemo(time: number, isContracting: boolean): number[] {
    // Generate distinct signals for each module to avoid identical lines
    return [0, 1, 2, 3].map(i => {
      const baseNoise = (Math.random() - 0.5) * 30;
      // Variance in intensity per module
      const moduleMultiplier = 0.7 + (i * 0.15); 
      const contractionSignal = isContracting 
        ? (Math.random() * 500 + 300) * moduleMultiplier * (0.9 + Math.random() * 0.2)
        : (Math.random() * 40);
      
      return baseNoise + contractionSignal;
    });
  }
}
