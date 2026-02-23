export function createState() {
  const N = 2;

  const pos  = new Float32Array(N * 3);
  const vel  = new Float32Array(N * 3);
  const acc  = new Float32Array(N * 3);
  const mass = new Float32Array(N);

  // Star (body 0)
  pos[0] = 0; pos[1] = 0; pos[2] = 0;
  mass[0] = 1.0;

  // Planet (body 1)
  pos[3] = 2.5; pos[4] = 0; pos[5] = 0;
  mass[1] = 0.001;

  // Circular orbit velocity: v = sqrt(GM/r)
  const G = 1.0;
  const r = 2.5;
  vel[5] = Math.sqrt(G * mass[0] / r); // z-direction

  return { pos, vel, acc, mass };
}