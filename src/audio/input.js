export async function initAudioInput() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const sampleRate = audioContext.sampleRate;

  const analyser = new AnalyserNode(audioContext, { fftSize: 2048 });
  source.connect(analyser);

  const timeBuffer = new Float32Array(analyser.fftSize);
  const frequencyBuffer = new Float32Array(analyser.frequencyBinCount);

  return { sampleRate, timeBuffer, frequencyBuffer, analyser };
}
