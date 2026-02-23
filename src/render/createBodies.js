import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export function createBodies(scene) {
  const sphereGeo = new SphereGeometry(1, 24, 16);

  const starMatA = new MeshBasicMaterial({ color: 0xfff3c4 });
  const starMatB = new MeshBasicMaterial({ color: 0xffffff });
  const starMatC = new MeshBasicMaterial({ color: 0xffd6a5 });
  const planetMat = new MeshBasicMaterial({ color: 0x9ad1ff });

  const starA = new Mesh(sphereGeo, starMatA);
  const starB = new Mesh(sphereGeo, starMatB);
  const starC = new Mesh(sphereGeo, starMatC);
  const planet = new Mesh(sphereGeo, planetMat);

  starA.scale.setScalar(0.45);
  starB.scale.setScalar(0.45);
  starC.scale.setScalar(0.45);
  planet.scale.setScalar(0.18);

  starA.position.set(-1.2, 0, 0);
  starB.position.set(1.2, 0, 0);
  starC.position.set(0, 1.2, 0);
  planet.position.set(2.5, 0, 0);

  scene.add(starA, starB, starC, planet);

  return { starA, starB, starC, planet };
}
