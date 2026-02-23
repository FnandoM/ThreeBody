import { WebGLRenderer } from 'three';

export function createRenderer(width, height) {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);
  return renderer;
}
