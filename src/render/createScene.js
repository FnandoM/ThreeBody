import { AxesHelper, Scene } from 'three';

export function createScene() {
  const scene = new Scene();
  const axes = new AxesHelper(5);
  scene.add(axes);
  return scene;
}
