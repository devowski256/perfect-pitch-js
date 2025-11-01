export function detectPitchNaive(
  buffer,
  sampleRate,
  minFreq = PITCH_MIN,
  maxFreq = PITCH_MAX,
  threshold = 0.25
) {
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
  if (bestLag === -1 || bestCorr < threshold) {
    return -1;
  }

  return sampleRate / bestLag;
}
