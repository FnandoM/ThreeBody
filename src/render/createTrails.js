import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from 'three';

export function createTrail(scene, length) {
  const positions = new Float32Array(length * 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const material = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
  });

  const line = new Line(geometry, material);
  scene.add(line);

  let index = 0;

  return function update(pos) {
    const offset = index * 3;
    positions[offset] = pos.x;
    positions[offset + 1] = pos.y;
    positions[offset + 2] = pos.z;

    index = (index + 1) % length;
    geometry.attributes.position.needsUpdate = true;
  };
}
