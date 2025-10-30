import {
  GAME_WIDTH,
  SHOW_AUDIO_GRAPHS,
  SPECTRUM_HEIGHT,
  WAVEFORM_HEIGHT,
} from '../config.js';
import { rescale } from '../rescale.js';

export function initCanvasWaveform() {
  if (!SHOW_AUDIO_GRAPHS) {
    return;
  }

  const canvas = document.getElementById('waveform');
  canvas.width = GAME_WIDTH;
  canvas.height = WAVEFORM_HEIGHT;

  return canvas.getContext('2d');
}

export function initCanvasSpectrum() {
  if (!SHOW_AUDIO_GRAPHS) {
    return;
  }

  const canvas = document.getElementById('spectrum');
  canvas.width = GAME_WIDTH;
  canvas.height = SPECTRUM_HEIGHT;

  return canvas.getContext('2d');
}

export function drawWaveform(ctx, data) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, GAME_WIDTH, WAVEFORM_HEIGHT * 2);

  ctx.fillStyle = '#FFF';

  for (let i = 0; i < Math.min(data.length, GAME_WIDTH); i += 1) {
    const height = (data[i] * WAVEFORM_HEIGHT) / 2;

    ctx.fillRect(i, WAVEFORM_HEIGHT / 2 - height, 1, height);
  }
}

export function drawSpectrum(ctx, data, dbMin, dbMax) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, GAME_WIDTH, SPECTRUM_HEIGHT);

  ctx.fillStyle = '#FFF';
  ctx.fillRect(0, 0, GAME_WIDTH, 1);

  for (let i = 0; i < Math.min(data.length, GAME_WIDTH); i += 1) {
    const height = rescale(data[i], dbMin, dbMax, 0, SPECTRUM_HEIGHT);

    ctx.fillRect(i, SPECTRUM_HEIGHT - height, 1, height);
  }
}
