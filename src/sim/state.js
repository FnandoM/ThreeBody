export function createState() {
  const N = 4;

  const pos  = new Float32Array(N * 3);
  const vel  = new Float32Array(N * 3);
  const acc  = new Float32Array(N * 3);
  const mass = new Float32Array(N);

  // Lagrange triangular solution for 3 equal-mass stars (bodies 0..2),
  // plus a light planet (body 3) orbiting farther out.
  const G = 1.0;
  const starMass = 1.0;
  const planetMass = 0.0009;
  const side = 2.4;      
  const planetRadius = 7.5;

  mass[0] = starMass;
  mass[1] = starMass;
  mass[2] = starMass;
  mass[3] = planetMass;

  const R = side / Math.sqrt(3); // center -> vertex for equilateral triangle
  const totalStarMass = mass[0] + mass[1] + mass[2];
  const omega = Math.sqrt((G * totalStarMass) / (side * side * side));
  const vStar = omega * R;

  // Place stars in xz-plane, rotating around the origin.
  const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
  for (let i = 0; i < 3; i++) {
    const o = i * 3;
    const th = angles[i];

    pos[o] = R * Math.cos(th);
    pos[o + 1] = 0;
    pos[o + 2] = R * Math.sin(th);

    // Tangential velocity in xz-plane: (-sin(th), 0, cos(th))
    vel[o] = -vStar * Math.sin(th);
    vel[o + 1] = 0;
    vel[o + 2] = vStar * Math.cos(th);
  }

  // Planet (body 3): light test body farther out to reduce close encounters.
  // Circular speed is only approximate because the interior mass distribution rotates.
  pos[9] = planetRadius;
  pos[10] = 0;
  pos[11] = 0;
  vel[9] = 0;
  vel[10] = 0;
  vel[11] = Math.sqrt((G * totalStarMass) / planetRadius);

  // Remove net momentum so the center of mass does not drift away.
  let px = 0;
  let py = 0;
  let pz = 0;
  let mTot = 0;
  for (let i = 0; i < N; i++) {
    const o = i * 3;
    px += mass[i] * vel[o];
    py += mass[i] * vel[o + 1];
    pz += mass[i] * vel[o + 2];
    mTot += mass[i];
  }
  const vxCom = px / mTot;
  const vyCom = py / mTot;
  const vzCom = pz / mTot;

  for (let i = 0; i < N; i++) {
    const o = i * 3;
    vel[o] -= vxCom;
    vel[o + 1] -= vyCom;
    vel[o + 2] -= vzCom;
  }

  rotateXAll(pos, vel, Math.PI / 6); // 30 deg tilt so the whole solution lives in a tilted plane
  vel[10] += 0.01; // small extra out-of-plane kick on the planet for mild chaos

  return { pos, vel, acc, mass };
}

function rotateXAll(pos, vel, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  for (let i = 0; i < pos.length; i += 3) {
    const py = pos[i + 1];
    const pz = pos[i + 2];
    pos[i + 1] = c * py - s * pz;
    pos[i + 2] = s * py + c * pz;

    const vy = vel[i + 1];
    const vz = vel[i + 2];
    vel[i + 1] = c * vy - s * vz;
    vel[i + 2] = s * vy + c * vz;
  }
}
