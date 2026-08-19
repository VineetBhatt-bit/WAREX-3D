import * as THREE from "three";

export function createRack(x, z, rackData) {
  const rack = new THREE.Group();

  rack.userData = {
    id: rackData.id,
    category: rackData.category,
    capacity: rackData.capacity,
    level: rackData.level,
    products: rackData.products
  };

  const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x1557a6,
    metalness: 0.65,
    roughness: 0.3
  });

  const orangeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff8c00,
    metalness: 0.5,
    roughness: 0.35
  });

  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0x59636e,
    metalness: 0.35,
    roughness: 0.65
  });

  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xb88952,
    roughness: 0.8
  });

  // =========================
  // Vertical Steel Frames
  // =========================

  const postGeometry = new THREE.BoxGeometry(
    0.16,
    5.2,
    0.16
  );

  const posts = [
    [-0.9, -0.55],
    [0.9, -0.55],
    [-0.9, 0.55],
    [0.9, 0.55]
  ];

  posts.forEach(([px, pz]) => {
    const post = new THREE.Mesh(
      postGeometry,
      blueMaterial.clone()
    );

    post.position.set(px, 2.6, pz);
    post.castShadow = true;
    post.receiveShadow = true;

    rack.add(post);
  });

  // =========================
  // Storage Levels
  // =========================

  const levels = [0.8, 2.0, 3.2, 4.4];

  levels.forEach((y) => {
    // Front orange beam
    const frontBeam = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.14, 0.14),
      orangeMaterial.clone()
    );

    frontBeam.position.set(0, y, -0.55);

    // Back orange beam
    const backBeam = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.14, 0.14),
      orangeMaterial.clone()
    );

    backBeam.position.set(0, y, 0.55);

    frontBeam.castShadow = true;
    backBeam.castShadow = true;

    rack.add(frontBeam);
    rack.add(backBeam);

    // Storage platform
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.1, 1.0),
      shelfMaterial.clone()
    );

    shelf.position.set(0, y - 0.08, 0);
    shelf.castShadow = true;
    shelf.receiveShadow = true;

    rack.add(shelf);

    // =========================
    // Inventory Boxes
    // =========================

    const products = rack.userData.products || [];

    if (products.length > 0) {
      products.slice(0, 3).forEach((product, index) => {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.48, 0.42, 0.42),
          boxMaterial.clone()
        );

        box.position.set(
          -0.5 + index * 0.5,
          y + 0.22,
          0
        );

        box.castShadow = true;
        box.receiveShadow = true;

        box.userData = {
          sku: product.sku,
          name: product.name,
          quantity: product.quantity,
          price: product.price
        };

        rack.add(box);
      });
    }
  });

  // =========================
  // Rack Position
  // =========================

  rack.position.set(x, 0, z);

  return rack;
}