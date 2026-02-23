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

const scene = createScene();
const camera = createCamera(width, height);
const renderer = createRenderer(width, height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


controls.target.set(0, 0, 0);

app.append(renderer.domElement);

const bodies = createBodies(scene);
const planetTrail = createTrail(scene, 256, 0x9ad1ff);


const state = createState();

// Sim-parametre (sim-units)
const G = 1.0;
const eps = 0.02;
const dt = 0.005;

//Initialiser acc én gang før første Verlet-step
computeAcc(state.pos, state.mass, state.acc, G, eps);


function syncMeshesFromState() {
  bodies.starA.position.set(state.pos[0], state.pos[1], state.pos[2]);
  bodies.starB.position.set(state.pos[3], state.pos[4], state.pos[5]);
  bodies.starC.position.set(state.pos[6], state.pos[7], state.pos[8]);
  bodies.planet.position.set(state.pos[9], state.pos[10], state.pos[11]);
}

function animate() {
  // 1) Sim step
  stepVerlet(state, dt, G, eps);

  syncMeshesFromState();

  planetTrail(bodies.planet.position);

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Resize: oppdater renderer + kamera-projeksjon
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
