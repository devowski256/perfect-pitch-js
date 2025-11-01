import { NOTES, NOTES_FIRST, NOTES_LAST } from './audio/notes.js';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 700;

export const WAVEFORM_HEIGHT = 60;
export const SPECTRUM_HEIGHT = 60;

export const MAX_DT = 0.1;

export const GATE_HEIGHT = 5;
export const GATE_DEPTH = 0.05;
export const GATE_DISTANCE = 4;

export const PLATFORM_Z = -5;
export const PLATFORM_WIDTH = 2.5;
export const PLATFORM_HEIGHT = 0.1;
export const PLATFORM_DEPTH = -PLATFORM_Z + (NOTES.length + 1) * GATE_DISTANCE;

export const BALL_Y_SMOOTHING_FACTOR = 0.1;
export const BALL_MAX_Y = 4.6;
export const BALL_DIAMETER = 0.5;
export const BALL_MAX_SPEED = 2;
export const BALL_INIT_SPEED = 1;
export const BALL_ACCELERATION = 1.5;
export const BALL_GAME_OVER_Z = PLATFORM_DEPTH + PLATFORM_Z - BALL_DIAMETER * 2;

export const GATE_HOLE_TOLERANCE = 0.4;
export const GATE_HOLE_SIZE = (1 + GATE_HOLE_TOLERANCE) * BALL_DIAMETER;

export const PITCH_MIN = NOTES_FIRST * 0.5;
export const PITCH_MAX = NOTES_LAST * 1.15;
export const PITCH_RANGE = PITCH_MAX - PITCH_MIN;

export const SHOW_AUDIO_GRAPHS = false;
export const CHEATING_ENABLED = false;

const color = (rgba) => rgba.map((x) => x / 255);

export const COLOR_BACKGROUND = color([35, 34, 44, 255]);
export const COLOR_PLATFORM = color([108, 110, 123, 255]);
export const COLOR_BALL = color([253, 10, 179, 255]);
export const COLOR_GATE = color([130, 75, 3, 255]);
export const COLOR_GATE_DONE = color([43, 161, 0, 255]);
