import { Accessor } from "three/examples/jsm/transpiler/AST.js";


/**
 * Newtonian N-body gravity with Plummer softening.
 *
 * a_i = G Σ_{j ≠ i} m_j (r_j - r_i) / (|r_j - r_i|^2 + eps^2)^(3/2)
 *
 * This is the acceleration form of:
 *
 * F = G m_i m_j / r^2
 * a = F / m_i
 *
 * Softening (eps) prevents singularities when r → 0.
 */
export function computeAcc(pos, mass, outAcc, G, eps){
    const N = mass.length;

    //Zero acceleration
    for (let i = 0; i < N * 3; i++){
        outAcc[i] = 0;
    }

    //double loop over every pair
    for (let i = 0; i < N; i++){
        const oi= i * 3

        const xi = pos[oi];
        const yi = pos[oi + 1];
        const zi = pos[oi + 2];

        let ax = 0;
        let ay = 0;
        let az = 0;

        for (let j = 0; j < N; j++){
            if (i === j) continue;

            const oj = j * 3;

            const dx = pos[oj] - xi;
            const dy = pos[oj + 1] - yi;
            const dz = pos[oj + 2] - zi;
            
            // (dx)^2 + (dy)^2 +(dz)^2
            const r2 = dx * dx + dy * dy + dz * dz + eps*eps;

            // invR3 = 1 / (r^2)^(3/2)
            const invR = 1 / Math.sqrt(r2)
            const invR3 = invR * invR * invR;

            const scale = G * mass[j] * invR3;

            ax += dx * scale;
            ay += dy * scale;
            az += dz * scale;
        }

        outAcc[oi] = ax;
        outAcc[oi + 1] = ay;
        outAcc[oi + 2] = az;
    }
}
