import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020b1f);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 8, 18);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.1;

// Lights
const ambient = new THREE.AmbientLight(0x404040, 2);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(10, 20, 10);
light.castShadow = true;
scene.add(light);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0x001122 })
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Shelf generator
function createShelf(x, z) {
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x0a4ea8 })
  );

  shelf.position.set(x, 2, z);
  shelf.castShadow = true;
  scene.add(shelf);
}

// Left row
for (let i = -12; i <= 12; i += 4) createShelf(-5, i);

// Right row
for (let i = -12; i <= 12; i += 4) createShelf(5, i);

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();