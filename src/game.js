import { detectPitchYin } from './audio/detectPitchYin.js';
import {
  drawSpectrum,
  drawWaveform,
  initCanvasSpectrum,
  initCanvasWaveform,
} from './audio/graphs.js';
import { initAudioInput } from './audio/input.js';
import { NOTES, SOLFEGE } from './audio/notes.js';
import { MAX_DT, SHOW_AUDIO_GRAPHS } from './config.js';
import { INITIAL_STATE } from './state.js';
import { update } from './update.js';
import { View } from './view.js';
import { initCanvasWebgl } from './webgl.js';

export async function initGameLoop() {
  console.log('Notes to sing:');
  for (const [i, note] of Object.entries(NOTES)) {
    console.log(`${SOLFEGE[i]} (${note} Hz)`);
  }

  const state = INITIAL_STATE;

  const contextWaveform = initCanvasWaveform();
  const contextSpectrum = initCanvasSpectrum();
  const { gl, program } = initCanvasWebgl();
  const view = new View(gl, program, state);

  document.getElementById('container').style.visibility = 'visible';

  const { sampleRate, analyser, timeBuffer, frequencyBuffer } =
    await initAudioInput();

  let previousTime = performance.now();

  function loop(currentTime) {
    const dt = Math.min((currentTime - previousTime) / 1000, MAX_DT);
    previousTime = currentTime;

    analyser.getFloatTimeDomainData(timeBuffer);
    if (SHOW_AUDIO_GRAPHS) {
      analyser.getFloatFrequencyData(frequencyBuffer);
    }

    const pitch = detectPitchYin(timeBuffer, sampleRate);
    console.log(pitch);

    update(state, pitch, dt);
    view.render(state);

    if (SHOW_AUDIO_GRAPHS) {
      drawWaveform(contextWaveform, timeBuffer);
      drawSpectrum(
        contextSpectrum,
        frequencyBuffer,
        analyser.minDecibels,
        analyser.maxDecibels
      );
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
