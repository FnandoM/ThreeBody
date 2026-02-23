import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  FogExp2,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  Scene,
} from 'three';

export function createScene() {
  const scene = new Scene();
  scene.background = new Color(0x03040a);
  scene.fog = new FogExp2(0x060814, 0.012);

  const starCount = 2000;
  const radiusMin = 25;
  const radiusMax = 80;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const o = i * 3;

    // Random point on sphere shell with variable radius.
    const u = Math.random() * 2 - 1; // cos(theta)
    const phi = Math.random() * Math.PI * 2;
    const r = radiusMin + Math.random() * (radiusMax - radiusMin);
    const s = Math.sqrt(1 - u * u);

    positions[o] = r * s * Math.cos(phi);
    positions[o + 1] = r * u;
    positions[o + 2] = r * s * Math.sin(phi);
  }

  const starsGeo = new BufferGeometry();
  starsGeo.setAttribute('position', new Float32BufferAttribute(positions, 3));

  const starsMat = new PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  });

  const stars = new Points(starsGeo, starsMat);
  scene.add(stars);

  addNebula(scene, {
    center: [-18, 6, -28],
    spread: [18, 6, 12],
    color: 0x4dc7ff,
    count: 700,
    size: 0.38,
    opacity: 0.07,
  });

  addNebula(scene, {
    center: [20, -4, -22],
    spread: [16, 5, 10],
    color: 0xff7fd1,
    count: 650,
    size: 0.42,
    opacity: 0.06,
  });

  addNebula(scene, {
    center: [0, 10, -40],
    spread: [26, 8, 16],
    color: 0x9b8cff,
    count: 900,
    size: 0.48,
    opacity: 0.05,
  });

  return scene;
}

function addNebula(
  scene,
  { center, spread, color, count = 600, size = 0.4, opacity = 0.06 },
) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const base = new Color(color);

  for (let i = 0; i < count; i++) {
    const o = i * 3;

    // Soft cloud distribution (box-ish with center bias).
    const rx = (Math.random() - 0.5) * spread[0] * (0.35 + Math.random());
    const ry = (Math.random() - 0.5) * spread[1] * (0.35 + Math.random());
    const rz = (Math.random() - 0.5) * spread[2] * (0.35 + Math.random());

    positions[o] = center[0] + rx;
    positions[o + 1] = center[1] + ry;
    positions[o + 2] = center[2] + rz;

    const brightness = 0.35 + Math.random() * 0.65;
    colors[o] = base.r * brightness;
    colors[o + 1] = base.g * brightness;
    colors[o + 2] = base.b * brightness;
  }

  const geo = new BufferGeometry();
  geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3));

  const mat = new PointsMaterial({
    size,
    vertexColors: true,
    transparent: true,
    opacity,
    blending: AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const cloud = new Points(geo, mat);
  scene.add(cloud);
}
