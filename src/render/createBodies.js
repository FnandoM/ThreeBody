import { AdditiveBlending, BackSide, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

function addStarGlow(starMesh, color) {
  const shellNear = new Mesh(
    starMesh.geometry,
    new MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
  );
  shellNear.scale.setScalar(1.12);
  starMesh.add(shellNear);

  const shellGlow = new Mesh(
    starMesh.geometry,
    new MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.12,
      blending: AdditiveBlending,
      depthWrite: false,
      side: BackSide,
    }),
  );
  shellGlow.scale.setScalar(1.35);
  starMesh.add(shellGlow);

  const shellSoft = new Mesh(
    starMesh.geometry,
    new MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.05,
      blending: AdditiveBlending,
      depthWrite: false,
      side: BackSide,
    }),
  );
  shellSoft.scale.setScalar(1.7);
  starMesh.add(shellSoft);
}

export function createBodies(scene) {
  const sphereGeo = new SphereGeometry(1, 24, 16);

  const starMatA = new MeshBasicMaterial({ color: 0xfff6d7 });
  const starMatB = new MeshBasicMaterial({ color: 0xffffff });
  const starMatC = new MeshBasicMaterial({ color: 0xffdfb8 });
  const planetMat = new MeshBasicMaterial({ color: 0x9ad1ff });

  const starA = new Mesh(sphereGeo, starMatA);
  const starB = new Mesh(sphereGeo, starMatB);
  const starC = new Mesh(sphereGeo, starMatC);
  const planet = new Mesh(sphereGeo, planetMat);

  starA.scale.setScalar(0.45);
  starB.scale.setScalar(0.45);
  starC.scale.setScalar(0.45);
  planet.scale.setScalar(0.18);

  addStarGlow(starA, 0xfff3c4);
  addStarGlow(starB, 0xffffff);
  addStarGlow(starC, 0xffd6a5);

  starA.position.set(-1.2, 0, 0);
  starB.position.set(1.2, 0, 0);
  starC.position.set(0, 1.2, 0);
  planet.position.set(2.5, 0, 0);

  scene.add(starA, starB, starC, planet);

  return { starA, starB, starC, planet };
}
