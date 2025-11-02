import {
  GATE_DEPTH,
  GATE_HEIGHT,
  GATE_HOLE_SIZE,
  PLATFORM_WIDTH,
} from '../config.js';
import { Cuboid } from './cuboid.js';

export class Gate {
  constructor(gl, gate) {
    const { z, holeY } = gate;

    const w = PLATFORM_WIDTH;
    const h = GATE_HEIGHT;
    const d = GATE_DEPTH;
    const holeS = GATE_HOLE_SIZE;
    const barW = (w - holeS) / 2;

    this.cuboids = [
      // Left bar (full height)
      new Cuboid(gl, 0, 0, z, barW, h, d),
      // Right bar (full height)
      new Cuboid(gl, w - barW, 0, z, barW, h, d),
      // Bottom bar (below hole)
      new Cuboid(gl, barW, 0, z, w - 2 * barW, holeY, d),
      // Top bar (above hole)
      new Cuboid(
        gl,
        barW,
        holeY + holeS,
        z,
        w - 2 * barW,
        h - (holeY + holeS),
        d
      ),
    ];
  }

  draw(gl, aPosition) {
    for (const cuboid of this.cuboids) {
      cuboid.draw(gl, aPosition);
    }
  }
}
