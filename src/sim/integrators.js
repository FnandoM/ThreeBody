/**
 * Newtonian N-body gravity with Plummer softening.
 *
 * a_i = G Σ_{j≠i} m_j (r_j - r_i) / (|r_j - r_i|^2 + eps^2)^(3/2)
 *
 * pos: Float32Array(N*3)  [x0,y0,z0, x1,y1,z1, ...]
 * mass: Float32Array(N)
 * outAcc: Float32Array(N*3)
 */
export function computeAcc(pos, mass, outAcc, G, eps) {
  const N = mass.length;

  // zero acc
  for (let k = 0; k < N * 3; k++) outAcc[k] = 0;

  for (let i = 0; i < N; i++) {
    const oi = i * 3;
    const xi = pos[oi];
    const yi = pos[oi + 1];
    const zi = pos[oi + 2];

    let ax = 0, ay = 0, az = 0;

    for (let j = 0; j < N; j++) {
      if (i === j) continue;

      const oj = j * 3;

      const dx = pos[oj]     - xi;
      const dy = pos[oj + 1] - yi;
      const dz = pos[oj + 2] - zi;

      const r2 = dx*dx + dy*dy + dz*dz + eps*eps;
      const invR = 1 / Math.sqrt(r2);
      const invR3 = invR * invR * invR;

      const scale = G * mass[j] * invR3;
      ax += dx * scale;
      ay += dy * scale;
      az += dz * scale;
    }

    outAcc[oi]     = ax;
    outAcc[oi + 1] = ay;
    outAcc[oi + 2] = az;
  }
}