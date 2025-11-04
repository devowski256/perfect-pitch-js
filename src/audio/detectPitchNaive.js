export function detectPitchNaive(
  buffer,
  sampleRate,
  minFreq = 100,
  maxFreq = 1200,
  threshold = 0.4
) {
  // Discard noise
  const rms = Math.sqrt(buffer.reduce((a, b) => a + b * b, 0) / buffer.length);
  if (rms < 0.01) {
    return -1;
  }

  const n = buffer.length;
  const maxLag = Math.floor(sampleRate / minFreq);
  const minLag = Math.floor(sampleRate / maxFreq);

  let bestLag = -1;
  let bestCorr = 0;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    let sum1 = 0;
    let sum2 = 0;

    for (let i = 0; i < n - lag; i++) {
      const x1 = buffer[i];
      const x2 = buffer[i + lag];
      corr += x1 * x2;
      sum1 += x1 * x1;
      sum2 += x2 * x2;
    }

    const norm = corr / Math.sqrt(sum1 * sum2 + 1e-9);

    if (norm > bestCorr) {
      bestCorr = norm;
      bestLag = lag;
    }
  }

  // Reject if correlation is too weak (likely noise)
  if (bestCorr < threshold) {
    return -1;
  }

  return sampleRate / bestLag;
}
