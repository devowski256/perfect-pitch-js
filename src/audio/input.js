export async function initAudioInput() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const sampleRate = audioContext.sampleRate;

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  const timeBuffer = new Float32Array(analyser.fftSize);
  const frequencyBuffer = new Float32Array(analyser.frequencyBinCount);
  source.connect(analyser);

  return { sampleRate, timeBuffer, frequencyBuffer, analyser };
}
