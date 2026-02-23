import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  LineBasicMaterial,
} from 'three';

export function createTrail(scene, length, color = 0xffffff, opacity = 0.2) {
  const positions = new Float32Array(length * 3);
  const colors = new Float32Array(length * 3);
  const history = new Float32Array(length * 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.setDrawRange(0, 0);

  const baseColor = new Color(color);

  const glowMaterial = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: opacity * 0.5,
    blending: AdditiveBlending,
    depthWrite: false,
  });

  const coreMaterial = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: Math.min(1, opacity + 0.12),
    blending: AdditiveBlending,
    depthWrite: false,
  });

  const glowLine = new Line(geometry, glowMaterial);
  const coreLine = new Line(geometry, coreMaterial);
  scene.add(glowLine, coreLine);

  let head = 0;
  let count = 0;

  return function update(pos) {
    const writeOffset = head * 3;
    history[writeOffset] = pos.x;
    history[writeOffset + 1] = pos.y;
    history[writeOffset + 2] = pos.z;

    head = (head + 1) % length;
    count = Math.min(count + 1, length);

    // Rebuild a contiguous oldest->newest polyline so the trail stays smooth after wrapping.
    const start = count < length ? 0 : head;
    const denom = Math.max(1, count - 1);

    for (let i = 0; i < count; i++) {
      const srcIndex = ((start + i) % length) * 3;
      const dstIndex = i * 3;

      positions[dstIndex] = history[srcIndex];
      positions[dstIndex + 1] = history[srcIndex + 1];
      positions[dstIndex + 2] = history[srcIndex + 2];

      // Fade tail by darkening colors (works well on dark backgrounds).
      const t = i / denom; // 0=tail, 1=head
      const brightness = 0.03 + 0.97 * t * t;
      colors[dstIndex] = baseColor.r * brightness;
      colors[dstIndex + 1] = baseColor.g * brightness;
      colors[dstIndex + 2] = baseColor.b * brightness;
    }

    geometry.setDrawRange(0, count);
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  };
}
