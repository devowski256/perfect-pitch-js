import { vec3 } from 'gl-matrix';

import { NOTES, SOLFEGE } from './audio/notes.js';
import {
  BALL_DIAMETER,
  BALL_INIT_SPEED,
  GATE_DISTANCE,
  GATE_HOLE_SIZE,
} from './config.js';
import { pitchToHeight } from './rescale.js';

export const INITIAL_STATE = {
  gameOverTimer: -1,
  currentGate: 0,
  ball: {
    speed: BALL_INIT_SPEED,
    position: vec3.fromValues(0, 0, 0),
  },
  gates: NOTES.map((pitch, i) => ({
    z: (i + 1) * GATE_DISTANCE,
    label: SOLFEGE[i],
    holeY: pitchToHeight(pitch) - (GATE_HOLE_SIZE - BALL_DIAMETER) / 2,
  })),
};
