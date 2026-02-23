import { PerspectiveCamera } from 'three';

export function createCamera(width, height) {
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 5, 12);
  camera.lookAt(0, 0, 0);
  return camera;
}
