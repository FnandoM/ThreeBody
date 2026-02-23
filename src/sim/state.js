export function createState() {
  const N = 4;

  const pos  = new Float32Array(N * 3);
  const vel  = new Float32Array(N * 3);
  const acc  = new Float32Array(N * 3);
  const mass = new Float32Array(N);

  // body 0 = starA
  pos[0] = -1.2; pos[1] = 0.0; pos[2] = 0.0;
  mass[0] = 1.0;
  vel[0] = 0.0; vel[1] = -0.18; vel[2] = 0.12;

  // body 1 = starB
  pos[3] = 1.2; pos[4] = 0.0; pos[5] = 0.0;
  mass[1] = 1.0;
  vel[3] = 0.0; vel[4] = 0.18; vel[5] = -0.12;

  // body 2 = starC
  pos[6] = 0.0; pos[7] = 1.2; pos[8] = 0.0;
  mass[2] = 1.0;
  vel[6] = -0.14; vel[7] = 0.0; vel[8] = 0.0;

  // body 3 = planet
  pos[9] = 2.5; pos[10] = 0.0; pos[11] = 0.0;
  mass[3] = 0.001;

  // Approx orbit speed around ~3 solar masses at r=2.5 (demo values)
  const G = 1.0;
  const r = 2.5;
  vel[11] = Math.sqrt((G * (mass[0] + mass[1] + mass[2])) / r);

  return { pos, vel, acc, mass };
}
