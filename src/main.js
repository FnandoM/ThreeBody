import { createCamera } from './render/createCamera.js';
import { createRenderer } from './render/createRenderer.js';
import { createScene } from './render/createScene.js';
import { createBodies } from './render/createBodies.js';
import { createTrail } from './render/createTrails.js';

const app = document.querySelector('#app');
app.innerHTML = '';

const width = window.innerWidth;
const height = window.innerHeight;

const scene = createScene();
const camera = createCamera(width, height);
const renderer = createRenderer(width, height);
const bodies = createBodies(scene);
const planetTrail = createTrail(scene, 256);

app.append(renderer.domElement);

function animate() {
  const t = performance.now() * 0.001;
  bodies.planet.position.x = Math.cos(t) * 2.5;
  bodies.planet.position.z = Math.sin(t) * 2.5;

  planetTrail(bodies.planet.position);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  const nextWidth = window.innerWidth;
  const nextHeight = window.innerHeight;
  camera.aspect = nextWidth / nextHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(nextWidth, nextHeight);
});
