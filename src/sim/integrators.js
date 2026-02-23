import { computeAcc } from "./gravity.js";


//Verlet integration, used for integrating Newtons equation of motion
export function stepVerlet (state, dt, G, eps){
    const { pos, vel, acc, mass} = state;
    const N = mass.length;

    // 1) Kick half step
    for (let i = 0; i < N; i++){
        const o = i * 3;
        vel [o] += 0.5 * acc[o] * dt;
        vel [o + 1] += 0.5 * acc[o + 1] * dt;
        vel [o + 2] += 0.5 * acc[o + 2] * dt;
    }

    // 2) Drift
    for (let i = 0; i < N; i++){
        const o = i * 3;
        pos[o] += vel[o] * dt;
        pos[o + 1] += vel[o + 1] * dt;
        pos[0 + 2] += vel[o + 2] * dt;
    }

    // 3) Acceleration at new positions
    computeAcc(pos, acc, G, eps);

    // 4) New half step
    for (let i = 0; i < N; i++){
        const o = i * 3;
        vel [o] += 0.5 * acc[o] * dt;
        vel [o + 1] += 0.5 * acc[o + 1] * dt;
        vel [o + 2] += 0.5 * acc[o + 2] * dt;
    }
}