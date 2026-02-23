import "../src/style.css";

import { createCamera } from "./render/createCamera.js";
import { createRenderer } from "./render/createRenderer.js";
import { createScene } from "./render/createScene.js";
import { createBodies } from "./render/createBodies.js";
import { createTrail } from "./render/createTrails.js";

import { createState } from "./sim/state.js";
import { computeAcc } from "./sim/gravity.js";
import { stepVerlet } from "./sim/integrators.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const app = document.querySelector("#app");
app.innerHTML = "";

const width = window.innerWidth;
const height = window.innerHeight;
const PIXEL_SCALE = 3;

const scene = createScene();
const camera = createCamera(width, height);
const renderer = createRenderer(width, height, { pixelScale: PIXEL_SCALE });

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


controls.target.set(0, 0, 0);

app.append(renderer.domElement);

const bodies = createBodies(scene);
const starATrail = createTrail(scene, 256, 0xfff3c4, 0.18);
const starBTrail = createTrail(scene, 256, 0xffffff, 0.18);
const starCTrail = createTrail(scene, 256, 0xffd6a5, 0.18);
const planetTrail = createTrail(scene, 256, 0x9ad1ff, 0.28);


const state = createState();

// Sim-parametre (sim-units)
const G = 1.0;
const eps = 0.05;
const dt = 0.01;
const ENABLE_COLLISIONS = false;

//Initialiser acc én gang før første Verlet-step
computeAcc(state.pos, state.mass, state.acc, G, eps);

const bodyMeshes = [bodies.starA, bodies.starB, bodies.starC, bodies.planet];
const bodyTrails = [starATrail, starBTrail, starCTrail, planetTrail];
const collisionRadii = [0.45, 0.45, 0.45, 0.18];

function mergeBodies(state, survivor, victim) {
  const { pos, vel, mass } = state;
  const so = survivor * 3;
  const vo = victim * 3;

  const m1 = mass[survivor];
  const m2 = mass[victim];
  if (m1 <= 0 || m2 <= 0) return;

  const totalMass = m1 + m2;

  // Center-of-mass merge with momentum conservation.
  pos[so] = (pos[so] * m1 + pos[vo] * m2) / totalMass;
  pos[so + 1] = (pos[so + 1] * m1 + pos[vo + 1] * m2) / totalMass;
  pos[so + 2] = (pos[so + 2] * m1 + pos[vo + 2] * m2) / totalMass;

  vel[so] = (vel[so] * m1 + vel[vo] * m2) / totalMass;
  vel[so + 1] = (vel[so + 1] * m1 + vel[vo + 1] * m2) / totalMass;
  vel[so + 2] = (vel[so + 2] * m1 + vel[vo + 2] * m2) / totalMass;

  mass[survivor] = totalMass;
  mass[victim] = 0;

  vel[vo] = 0; vel[vo + 1] = 0; vel[vo + 2] = 0;
  pos[vo] = pos[so]; pos[vo + 1] = pos[so + 1]; pos[vo + 2] = pos[so + 2];

  bodyMeshes[victim].visible = false;

  // Grow collision radius roughly with volume^(1/3) assuming constant density.
  const r1 = collisionRadii[survivor];
  const r2 = collisionRadii[victim];
  collisionRadii[survivor] = Math.cbrt(r1 ** 3 + r2 ** 3);
}

function handleCollisions() {
  const { pos, mass } = state;
  const N = mass.length;
  let changed = false;

  for (let i = 0; i < N; i++) {
    if (mass[i] <= 0) continue;
    const oi = i * 3;

    for (let j = i + 1; j < N; j++) {
      if (mass[j] <= 0) continue;
      const oj = j * 3;

      const dx = pos[oj] - pos[oi];
      const dy = pos[oj + 1] - pos[oi + 1];
      const dz = pos[oj + 2] - pos[oi + 2];

      const minDist = collisionRadii[i] + collisionRadii[j];
      if (dx * dx + dy * dy + dz * dz > minDist * minDist) continue;

      const survivor = mass[i] >= mass[j] ? i : j;
      const victim = survivor === i ? j : i;
      mergeBodies(state, survivor, victim);
      changed = true;

      if (mass[i] <= 0) break;
    }
  }

  if (changed) {
    computeAcc(state.pos, state.mass, state.acc, G, eps);
  }
}


function syncMeshesFromState() {
  bodies.starA.position.set(state.pos[0], state.pos[1], state.pos[2]);
  bodies.starB.position.set(state.pos[3], state.pos[4], state.pos[5]);
  bodies.starC.position.set(state.pos[6], state.pos[7], state.pos[8]);
  bodies.planet.position.set(state.pos[9], state.pos[10], state.pos[11]);
}

function animate() {
  // 1) Sim step
  stepVerlet(state, dt, G, eps);
  if (ENABLE_COLLISIONS) handleCollisions();

  syncMeshesFromState();

  for (let i = 0; i < bodyMeshes.length; i++) {
    if (!bodyMeshes[i].visible) continue;
    bodyTrails[i](bodyMeshes[i].position);
  }

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
syncMeshesFromState();
animate();

// Resize: oppdater renderer + kamera-projeksjon
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pixelScale = renderer.pixelScale ?? PIXEL_SCALE;

  renderer.setSize(
    Math.max(1, Math.floor(w / pixelScale)),
    Math.max(1, Math.floor(h / pixelScale)),
    false,
  );
  renderer.domElement.style.width = `${w}px`;
  renderer.domElement.style.height = `${h}px`;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
