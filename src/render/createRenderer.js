import { WebGLRenderer } from 'three';

export function createRenderer(width, height, { pixelScale = 3 } = {}) {
  const renderer = new WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(1);
  renderer.setSize(
    Math.max(1, Math.floor(width / pixelScale)),
    Math.max(1, Math.floor(height / pixelScale)),
    false,
  );

  const canvas = renderer.domElement;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.style.imageRendering = 'pixelated';

  renderer.pixelScale = pixelScale;
  renderer.setClearColor(0x000000, 1);
  return renderer;
}
