export function detectPitchYin(
  buffer,
  sampleRate,
  threshold = 0.1,
  minFreq = 100,
  maxFreq = 2000
) {
  const n = buffer.length;
  const maxLag = Math.floor(sampleRate / minFreq);
  const minLag = Math.floor(sampleRate / maxFreq);

  // Step 1: Difference function
  const d = new Float32Array(maxLag + 1);
  for (let tau = minLag; tau <= maxLag; tau++) {
    let sum = 0;
    for (let i = 0; i < n - tau; i++) {
      const diff = buffer[i] - buffer[i + tau];
      sum += diff * diff;
    }
    d[tau] = sum;
  }

  // Step 2: Cumulative mean normalized difference function (CMND)
  let runningSum = 0;
  const dPrime = new Float32Array(maxLag + 1);
  dPrime[0] = 1;
  for (let tau = minLag; tau <= maxLag; tau++) {
    runningSum += d[tau];
    dPrime[tau] = (d[tau] * tau) / runningSum;
  }

  // Step 3: Find first minimum below threshold
  let tauEstimate = -1;
  for (let tau = minLag; tau <= maxLag; tau++) {
    if (dPrime[tau] < threshold) {
      const prev = tau > minLag ? dPrime[tau - 1] : Infinity;
      const next = tau < maxLag ? dPrime[tau + 1] : Infinity;
      if (dPrime[tau] < prev && dPrime[tau] < next) {
        tauEstimate = tau;
        break;
      }
    }
  }

  if (tauEstimate === -1) {
    return -1;
  }

  // Step 4: Parabolic interpolation for higher accuracy
  const x0 = tauEstimate > minLag ? tauEstimate - 1 : tauEstimate;
  const x2 = tauEstimate < maxLag ? tauEstimate + 1 : tauEstimate;
  const s0 = dPrime[x0];
  const s1 = dPrime[tauEstimate];
  const s2 = dPrime[x2];

  const betterTau = tauEstimate + (s2 - s0) / (2 * (2 * s1 - s2 - s0));

  // Step 5: Convert lag to frequency
  return sampleRate / betterTau;
}
